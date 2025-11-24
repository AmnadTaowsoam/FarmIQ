# -*- coding: utf-8 -*-
"""
Stereo disparity viewer + height measurement over a plate.

ออกแบบให้:
- ใช้ ROI ใหญ่ครอบทั้ง plate ได้
- ความสูง H คำนวณจาก depth reference ของ EMPTY plate ต่อพิกเซล (per-pixel)
- กรอง noise ด้วยเกณฑ์ขั้นต่ำของความสูง (H_MIN_MM)
"""

import sys
from collections import deque
from urllib.parse import quote

import cv2
import numpy as np

# เพิ่ม path ไปยัง package app ของ service นี้
sys.path.append(r"D:\FarmIQ\device\services\vision-capture-2cam-service")
from app.stereo_calib_utils import StereoRectifier


CALIB_YML = r"D:\FarmIQ\device\services\vision-capture-2cam-service\calib\stereo_rectify_maps.yml"

# ---------- Global calibration state ----------
Z_PLATE_REF = None          # depth ของ plate ตอนกด 's' (หน่วยเดียวกับ Q)
SCALE_MM_PER_UNIT = None    # scale แปลง unitZ → mm
H_KNOWN_MM = 217.0          # ความสูง block ที่รู้จริง (ใช้ตอน 'c' override scale)

PLATE_DISTANCE_MM = 1020.0  # ระยะกล้องถึง plate (ใช้คำนวณ SCALE_MM_PER_UNIT)

# ความสูงขั้นต่ำที่จะถือว่า "มีวัตถุ" (mm)
H_MIN_MM = 20.0

Z_HISTORY = deque(maxlen=3)  # smoothing สำหรับค่า height (ในหน่วย depth)

# แผนที่ depth reference ของ EMPTY plate (หน่วยเดียวกับ Z) สำหรับ ROI
Z_PLATE_REF_MAP = None      # shape เท่ากับ roi_Z_clean

# ค่า height ล่าสุด (หน่วย depth) สำหรับปุ่ม 'c'
LAST_HEIGHT_UNITS = None


def crop_plate_roi(img, top_ratio=0.12, bottom_ratio=0.00, side_ratio=0.18):
    """
    ครอปเฉพาะบริเวณ plate จากภาพ rectified (ตัดขอบบน/ล่าง/ซ้าย/ขวาออกตามสัดส่วน)
    """
    h, w = img.shape[:2]
    top = int(h * top_ratio)
    bottom = int(h * (1.0 - bottom_ratio))
    left = int(w * side_ratio)
    right = int(w * (1.0 - side_ratio))

    top = max(0, min(top, h - 1))
    bottom = max(top + 1, min(bottom, h))
    left = max(0, min(left, w - 1))
    right = max(left + 1, min(right, w))

    return img[top:bottom, left:right]


def load_Q_from_yml(calib_path: str) -> np.ndarray:
    fs = cv2.FileStorage(calib_path, cv2.FILE_STORAGE_READ)
    if not fs.isOpened():
        raise RuntimeError(f"Cannot open calib file: {calib_path}")
    Q = fs.getNode("Q").mat()
    fs.release()
    if Q is None:
        raise RuntimeError("Q matrix not found in calib file")
    print("Loaded Q from calib, shape:", Q.shape)
    return Q


def clean_depth_roi(roi_Z: np.ndarray):
    """
    ทำความสะอาด depth_Z ใน ROI (2D):
    - กรอง NaN / inf ทิ้ง
    - กรอง outlier ที่เกิน 3*std รอบ median

    คืนค่า:
        roi_Z_clean : depth หลังตัด outlier (ตำแหน่ง outlier จะเป็น NaN)
        valid_vals  : 1D array ของค่าที่ valid
    """
    finite_mask = np.isfinite(roi_Z)
    if not np.any(finite_mask):
        return roi_Z, np.array([])

    vals = roi_Z[finite_mask]
    med = np.median(vals)
    std = np.std(vals)

    if std < 1e-6:
        return roi_Z, vals

    z_low = med - 3.0 * std
    z_high = med + 3.0 * std

    roi_clean = roi_Z.copy()
    outlier_mask = (roi_Z < z_low) | (roi_Z > z_high)
    roi_clean[outlier_mask] = np.nan

    valid_vals = roi_clean[np.isfinite(roi_clean)]
    return roi_clean, valid_vals


def main():
    global Z_PLATE_REF, SCALE_MM_PER_UNIT, Z_PLATE_REF_MAP, LAST_HEIGHT_UNITS

    rectifier = StereoRectifier()
    Q = load_Q_from_yml(CALIB_YML)

    # ---------- RTSP config ----------
    pwd = quote("P@ssw0rd", safe="")  # encode @
    urlL = f"rtsp://admin:{pwd}@192.168.1.199:554/Streaming/Channels/101"
    urlR = f"rtsp://admin:{pwd}@192.168.1.200:554/Streaming/Channels/101"

    capL = cv2.VideoCapture(urlL, cv2.CAP_FFMPEG)
    capR = cv2.VideoCapture(urlR, cv2.CAP_FFMPEG)

    if not capL.isOpened() or not capR.isOpened():
        print("Cannot open RTSP streams, please check IP/credential/network")
        return

    print(
        "Camera L size:",
        capL.get(cv2.CAP_PROP_FRAME_WIDTH),
        capL.get(cv2.CAP_PROP_FRAME_HEIGHT),
    )
    print(
        "Camera R size:",
        capR.get(cv2.CAP_PROP_FRAME_WIDTH),
        capR.get(cv2.CAP_PROP_FRAME_HEIGHT),
    )

    # ---------- StereoSGBM ----------
    stereo = cv2.StereoSGBM_create(
        minDisparity=0,
        numDisparities=16 * 48,  # 768 px (ต้องหาร 16 ลงตัว)
        blockSize=9,
        P1=8 * 3 * 9 ** 2,
        P2=32 * 3 * 9 ** 2,
        disp12MaxDiff=1,
        uniquenessRatio=5,
        speckleWindowSize=50,
        speckleRange=2,
        preFilterCap=63,
        mode=cv2.STEREO_SGBM_MODE_SGBM_3WAY,
    )

    TARGET_SHOW_WIDTH = 1920
    DEBUG_WIDTH = 1280
    DEBUG_HEIGHT = 980

    printed_stats = False
    printed_z_stats = False

    while True:
        retL, frameL = capL.read()
        retR, frameR = capR.read()

        if not retL or not retR:
            print("Failed to read from cameras, try reconnect...")
            # ปิด stream เดิมแล้วลองเปิดใหม่อีกครั้ง
            capL.release()
            capR.release()

            capL = cv2.VideoCapture(urlL, cv2.CAP_FFMPEG)
            capR = cv2.VideoCapture(urlR, cv2.CAP_FFMPEG)

            if not capL.isOpened() or not capR.isOpened():
                print("Reconnect failed, exit program")
                break

            print("Reconnect success")
            continue

        # ---------- 1) Rectify ----------
        rectL, rectR = rectifier.rectify(frameL, frameR)

        # ---------- 2) Crop ให้เหลือเฉพาะ plate ----------
        rectL_crop = crop_plate_roi(rectL, top_ratio=0.12, bottom_ratio=0.00, side_ratio=0.18)
        rectR_crop = crop_plate_roi(rectR, top_ratio=0.12, bottom_ratio=0.00, side_ratio=0.18)

        # ---------- 3) Gray ----------
        grayL = cv2.cvtColor(rectL_crop, cv2.COLOR_BGR2GRAY)
        grayR = cv2.cvtColor(rectR_crop, cv2.COLOR_BGR2GRAY)

        # ---------- 4) Disparity ----------
        disp_raw = stereo.compute(grayL, grayR).astype(np.float32) / 16.0

        if not printed_stats:
            valid_all = disp_raw[disp_raw > 0]
            if valid_all.size > 0:
                p5, p50, p95 = np.percentile(valid_all, [5, 50, 95])
                print("disp_raw min/max:", float(np.min(valid_all)), float(np.max(valid_all)))
                print("disp_raw p5/p50/p95:", float(p5), float(p50), float(p95))
            else:
                print("no valid disparity")
            printed_stats = True

        # เตรียม disparity สำหรับ visualization + depth
        disp = disp_raw.copy()
        disp[disp <= 0] = np.nan

        disp_for_depth = disp_raw.copy()
        disp_for_depth[disp_for_depth <= 0] = 0

        # ---------- 4.1) Disparity -> 3D ----------
        points_3d = cv2.reprojectImageTo3D(disp_for_depth, Q)  # (H, W, 3)
        depth_Z = points_3d[:, :, 2]

        # ---------- 5) ROI บน disparity/3D ----------
        h, w = disp.shape

        ROI_CENTER_X_RATIO = 0.30
        ROI_CENTER_Y_RATIO = 0.54
        ROI_WIDTH_RATIO = 0.60
        ROI_HEIGHT_RATIO = 0.90

        cx = int(w * ROI_CENTER_X_RATIO)
        cy = int(h * ROI_CENTER_Y_RATIO)
        half_w = int(w * ROI_WIDTH_RATIO / 2.0)
        half_h = int(h * ROI_HEIGHT_RATIO / 2.0)

        roi_x1 = max(0, cx - half_w)
        roi_x2 = min(w, cx + half_w)
        roi_y1 = max(0, cy - half_h)
        roi_y2 = min(h, cy + half_h)

        roi_disp = disp[roi_y1:roi_y2, roi_x1:roi_x2]
        valid_disp_roi = roi_disp[~np.isnan(roi_disp) & (roi_disp > 0)]

        if valid_disp_roi.size > 0:
            vmin, vmax = np.percentile(valid_disp_roi, [5, 95])
        else:
            vmin, vmax = 0.0, 1.0

        disp_vis = np.nan_to_num(disp, nan=vmin)

        if vmax - vmin < 1e-6:
            disp_norm = np.zeros_like(disp_vis, dtype=np.float32)
        else:
            disp_norm = (disp_vis - vmin) / (vmax - vmin)
            disp_norm = np.clip(disp_norm, 0, 1)

        disp_uint8 = (disp_norm * 255).astype(np.uint8)
        disp_color = cv2.applyColorMap(disp_uint8, cv2.COLORMAP_JET)

        # ---------- 5.1) Clean depth ----------
        roi_Z = depth_Z[roi_y1:roi_y2, roi_x1:roi_x2]
        roi_Z_clean, valid_Z_roi = clean_depth_roi(roi_Z)

        if not printed_z_stats and valid_Z_roi.size > 0:
            print("ROI Z min/max:", float(np.min(valid_Z_roi)), float(np.max(valid_Z_roi)))
            printed_z_stats = True

        # bounding box ของ object (ในพิกัด ROI) เอาไว้ใช้ตอนวาด
        obj_bbox = None  # (x, y, w, h)

        height_units_smooth = None

        # ---------- 5.1.1) คำนวณ metric_map (ความสูงเหนือ plate) + หา blob ----------
        if valid_Z_roi.size > 0 and Z_PLATE_REF_MAP is not None:
            if Z_PLATE_REF_MAP.shape != roi_Z_clean.shape:
                # ถ้า ROI เปลี่ยนขนาด ให้ล้าง map แล้วให้กด 's' ใหม่
                Z_PLATE_REF_MAP = None
            else:
                metric_map = Z_PLATE_REF_MAP - roi_Z_clean  # >0 = สูงกว่า plate
                metric_valid = metric_map[np.isfinite(metric_map)]

                # แปลง H_MIN_MM เป็นหน่วย depth เป็น threshold ขั้นต่ำ
                if SCALE_MM_PER_UNIT is not None and SCALE_MM_PER_UNIT > 1e-6:
                    MIN_DZ_UNITS = H_MIN_MM / SCALE_MM_PER_UNIT
                else:
                    MIN_DZ_UNITS = 80.0  # ประมาณ ~9mm ถ้า scale ~0.11mm/unit

                MAX_DZ_UNITS = 50000.0
                # จำนวน pixel ขั้นต่ำของ blob ใหญ่พอจะถือเป็นวัตถุ
                MIN_OBJ_PIXELS = 300

                # mask พื้นที่ที่ "สูงกว่า" plate ตาม threshold
                mask_obj = (
                    np.isfinite(metric_map)
                    & (metric_map > MIN_DZ_UNITS)
                    & (metric_map < MAX_DZ_UNITS)
                )

                num_obj = int(np.count_nonzero(mask_obj))

                if num_obj >= MIN_OBJ_PIXELS:
                    # ---------- หา blob ใหญ่สุดจาก mask_obj ----------
                    mask_uint8 = np.zeros_like(metric_map, dtype=np.uint8)
                    mask_uint8[mask_obj] = 255

                    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(
                        mask_uint8, connectivity=8
                    )

                    # label 0 คือ background ข้ามไป
                    best_label = -1
                    best_area = 0
                    best_bbox = None
                    for label in range(1, num_labels):
                        x, y, w_box, h_box, area = stats[label]
                        if area > best_area:
                            best_area = area
                            best_label = label
                            best_bbox = (x, y, w_box, h_box)

                    if best_label != -1 and best_area >= MIN_OBJ_PIXELS:
                        obj_bbox = best_bbox
                        blob_mask = labels == best_label
                        obj_vals = metric_map[blob_mask]

                        # ใช้ percentile สูงหน่อยเพื่อลดผลจากขอบเอียงของกล่อง
                        metric_height = float(
                            np.nanpercentile(obj_vals, 90)
                        )
                        Z_HISTORY.append(metric_height)
                        height_units_smooth = float(np.median(Z_HISTORY))

                # debug log
                if metric_valid.size > 0:
                    pos_vals = metric_valid[metric_valid > 0]
                    dZ_pos_max = float(np.max(pos_vals)) if pos_vals.size > 0 else 0.0
                else:
                    dZ_pos_max = 0.0

                print(
                    f"[DBG] MIN_DZ={MIN_DZ_UNITS:.1f}, "
                    f"dZ_pos_max={dZ_pos_max:.1f}, obj_pixels={num_obj}"
                )

        LAST_HEIGHT_UNITS = height_units_smooth

        # ---------- 5.2) Text แสดงความสูง ----------
        text = ""
        if Z_PLATE_REF is None or Z_PLATE_REF_MAP is None:
            text = f"Press 's' on EMPTY plate ({PLATE_DISTANCE_MM:.0f}mm)"
        elif SCALE_MM_PER_UNIT is None:
            text = f"Press 'c' with {H_KNOWN_MM:.0f}mm block (optional)"
        elif height_units_smooth is None:
            text = "H ~ 0.0 mm (no object)"
        else:
            height_mm = abs(height_units_smooth) * SCALE_MM_PER_UNIT
            if height_mm < H_MIN_MM:
                text = "H ~ 0.0 mm (no object)"
            else:
                text = f"H ~ {height_mm:.1f} mm"

        if text:
            cv2.putText(
                disp_color,
                text,
                (30, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.0,
                (0, 255, 0),
                2,
                cv2.LINE_AA,
            )

        # ---------- 6) เตรียมภาพสำหรับแสดง ----------
        raw_pair = cv2.hconcat([frameL, frameR])
        rect_pair = cv2.hconcat([rectL_crop, rectR_crop])

        # วาดกรอบ ROI
        cv2.rectangle(rect_pair, (roi_x1, roi_y1), (roi_x2, roi_y2), (0, 0, 255), 2)
        disp_debug = disp_color.copy()
        cv2.rectangle(disp_debug, (roi_x1, roi_y1), (roi_x2, roi_y2), (0, 255, 255), 2)

        # ถ้ามี bounding box ของ object ให้วาดเพิ่ม (ทั้งบน rectified และ disparity)
        if obj_bbox is not None:
            x_b, y_b, w_b, h_b = obj_bbox
            pt1 = (roi_x1 + x_b, roi_y1 + y_b)
            pt2 = (roi_x1 + x_b + w_b, roi_y1 + y_b + h_b)
            cv2.rectangle(rect_pair, pt1, pt2, (0, 255, 0), 2)
            cv2.rectangle(disp_debug, pt1, pt2, (0, 255, 0), 2)

        def resize_to_width(img, target_w):
            h0, w0 = img.shape[:2]
            scale = target_w / float(w0)
            return cv2.resize(img, (target_w, int(h0 * scale)))

        raw_show = resize_to_width(raw_pair, TARGET_SHOW_WIDTH)
        rect_show = resize_to_width(rect_pair, TARGET_SHOW_WIDTH)
        disp_show = resize_to_width(disp_debug, TARGET_SHOW_WIDTH)

        # เส้นแนวนอนช่วยเช็ค rectification
        h_show, w_show, _ = rect_show.shape
        for y in range(100, h_show, 100):
            cv2.line(rect_show, (0, y), (w_show, y), (0, 255, 0), 1)

        # Stereo Debug window
        stage_h = DEBUG_HEIGHT // 3
        raw_dbg = cv2.resize(raw_pair, (DEBUG_WIDTH, stage_h))
        rect_dbg = cv2.resize(rect_pair, (DEBUG_WIDTH, stage_h))
        disp_dbg = cv2.resize(disp_debug, (DEBUG_WIDTH, stage_h))
        debug_all = cv2.vconcat([raw_dbg, rect_dbg, disp_dbg])

        cv2.imshow("Raw stereo (L|R)", raw_show)
        cv2.imshow("Rectified + Cropped (L|R)", rect_show)
        cv2.imshow("Disparity Map", disp_show)
        cv2.imshow("Stereo Debug (Raw | Rectified | Disparity)", debug_all)

        # ---------- 8) Key handling ----------
        key = cv2.waitKey(1) & 0xFF

        if key == 27 or key == ord("q"):
            break

        elif key == ord("s"):
            # กดบน EMPTY plate เพื่อตั้ง depth reference + scale
            if valid_Z_roi.size > 0:
                Z_PLATE_REF = float(np.nanmedian(valid_Z_roi))
                Z_PLATE_REF_MAP = roi_Z_clean.copy()
                Z_HISTORY.clear()

                print(f"[CALIB] plate depth (units) = {Z_PLATE_REF:.3f}")

                if abs(Z_PLATE_REF) > 1e-3:
                    SCALE_MM_PER_UNIT = PLATE_DISTANCE_MM / abs(Z_PLATE_REF)
                    print(f"[CALIB] distance = {PLATE_DISTANCE_MM:.1f} mm")
                    print(f"[CALIB] SCALE_Z = {SCALE_MM_PER_UNIT:.3f} mm / unitZ")
                else:
                    SCALE_MM_PER_UNIT = None
                    print("[CALIB] Plate depth too small, cannot compute scale")
            else:
                print("[CALIB] No valid depth in ROI to save for plate")

        elif key == ord("c"):
            # ใช้ block ความสูง H_KNOWN_MM เพื่อ override scale
            if Z_PLATE_REF is None or Z_PLATE_REF_MAP is None:
                print("[CALIB] Press 's' on EMPTY plate first")
            elif LAST_HEIGHT_UNITS is None:
                print("[CALIB] No valid height in ROI for block")
            else:
                d_units = LAST_HEIGHT_UNITS
                if abs(d_units) < 0.5:
                    print(
                        f"[CALIB] dZ={d_units:.4f} too small, "
                        "move block / check setup"
                    )
                else:
                    SCALE_MM_PER_UNIT = H_KNOWN_MM / abs(d_units)
                    print(
                        f"[CALIB] SCALE override "
                        f"(from {H_KNOWN_MM:.1f}mm block) "
                        f"= {SCALE_MM_PER_UNIT:.6f} mm/unitZ (dZ={d_units:.6f})"
                    )

    capL.release()
    capR.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
