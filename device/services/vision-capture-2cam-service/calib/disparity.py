# -*- coding: utf-8 -*-
import cv2
import numpy as np
from urllib.parse import quote
import sys
from collections import deque  # [Step 1] ใช้สำหรับ temporal smoothing

# ให้ Python เห็น package app
sys.path.append(r"D:\FarmIQ\device\services\vision-capture-2cam-service")
from app.stereo_calib_utils import StereoRectifier

CALIB_YML = r"D:\FarmIQ\device\services\vision-capture-2cam-service\calib\stereo_rectify_maps.yml"

# ---------- ตัวแปร Global สำหรับ Calibration ----------
Z_PLATE_REF = None          # จะเซ็ตตอนกดปุ่ม 's' (depth ของพื้น plate)
SCALE_MM_PER_UNIT = None    # scale แปลงหน่วย Z → mm
H_KNOWN_MM = 217.0          # ความสูงบล็อกที่ใช้ calibrate (เช่น 217 mm)

# ใช้ระยะจริงจากกล้องถึง plate (วัดจริง ~ 1020 mm)
PLATE_DISTANCE_MM = 1020.0

# [Step 1] ประวัติ Z สำหรับทำ temporal smoothing
Z_HISTORY = deque(maxlen=5)

# [Step 3] World-plane calibration (สำหรับ metrology)
PLATE_PLANE_NORMAL = None   # normal vector ของ plane พื้น plate
PLATE_PLANE_D = None        # d ในสมการ plane: n·X + d = 0
Z_PLATE_NOISE_UNITS = None

# ---------- ฟังก์ชัน crop โซน plate (ใช้ค่าสำหรับทั้ง L/R เหมือนกัน) ----------
def crop_plate_roi(img,top_ratio=0.12,bottom_ratio=0.00,side_ratio=0.18):
    """ตัดขอบภาพออกให้เหลือเน้นบริเวณ plate"""
    h, w = img.shape[:2]
    top    = int(h * top_ratio)
    bottom = int(h * (1.0 - bottom_ratio))
    left   = int(w * side_ratio)
    right  = int(w * (1.0 - side_ratio))

    top    = max(0, min(top, h - 1))
    bottom = max(top + 1, min(bottom, h))
    left   = max(0, min(left, w - 1))
    right  = max(left + 1, min(right, w))

    return img[top:bottom, left:right]

def load_Q_from_yml(calib_path: str):
    fs = cv2.FileStorage(calib_path, cv2.FILE_STORAGE_READ)
    if not fs.isOpened():
        raise RuntimeError(f"Cannot open calib file: {calib_path}")
    Q = fs.getNode("Q").mat()
    fs.release()
    if Q is None:
        raise RuntimeError("Q matrix not found in calib file")
    print("Loaded Q from calib, shape:", Q.shape)
    return Q

# [Step 1] ฟังก์ชัน clean depth ใน ROI (ตัด outlier)
def clean_depth_roi(roi_Z: np.ndarray):
    """
    รับ depth_Z ใน ROI (2D) แล้ว:
    - ตัดค่า NaN / inf ทิ้ง
    - ใช้ 3σ จาก median ตัด outlier
    คืนค่า:
      roi_Z_clean : depth ที่ outlier ถูกแทนด้วย NaN
      valid_vals  : ค่า depth ที่ยัง valid หลัง clean
    """
    finite_mask = np.isfinite(roi_Z)
    if not np.any(finite_mask):
        return roi_Z, np.array([])

    vals = roi_Z[finite_mask]
    med = np.median(vals)
    std = np.std(vals)

    if std < 1e-6:
        # depth ค่อนข้างนิ่ง ไม่ต้องตัด outlier เพิ่ม
        return roi_Z, vals

    z_low = med - 3.0 * std
    z_high = med + 3.0 * std

    roi_clean = roi_Z.copy()
    outlier_mask = (roi_Z < z_low) | (roi_Z > z_high)
    roi_clean[outlier_mask] = np.nan

    valid_vals = roi_clean[np.isfinite(roi_clean)]
    return roi_clean, valid_vals


# [Step 3] ฟังก์ชัน fit plane สำหรับ world coordinate (metrology)
def fit_plane_from_points(points3d: np.ndarray):
    """
    รับจุด 3D (N,3) แล้ว fit plane แบบ least squares:
        n·X + d = 0
    คืนค่า:
        normal (3,), d (scalar)
    """
    if points3d.shape[0] < 3:
        raise ValueError("Need at least 3 points to fit a plane")

    centroid = points3d.mean(axis=0)
    uu, ss, vv = np.linalg.svd(points3d - centroid)
    normal = vv[-1, :]
    normal = normal / np.linalg.norm(normal)
    d = -np.dot(normal, centroid)
    return normal, d


def main():
    global Z_PLATE_REF, SCALE_MM_PER_UNIT, PLATE_PLANE_NORMAL, PLATE_PLANE_D
    global Z_PLATE_NOISE_UNITS

    # ---------- โหลด calibration + rectify maps ----------
    rectifier = StereoRectifier()
    Q = load_Q_from_yml(CALIB_YML)

    # ---------- เปิดกล้องผ่าน RTSP ----------
    pwd = quote('P@ssw0rd', safe='')  # encode @
    urlL = f"rtsp://admin:{pwd}@192.168.1.199:554/Streaming/Channels/101"
    urlR = f"rtsp://admin:{pwd}@192.168.1.200:554/Streaming/Channels/101"

    capL = cv2.VideoCapture(urlL, cv2.CAP_FFMPEG)
    capR = cv2.VideoCapture(urlR, cv2.CAP_FFMPEG)

    if not capL.isOpened() or not capR.isOpened():
        print("เปิดสตรีม RTSP ไม่ได้ ตรวจสอบ IP/รหัสผ่าน/สาย LAN")
        return

    print("Camera L size:", capL.get(cv2.CAP_PROP_FRAME_WIDTH), capL.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print("Camera R size:",capR.get(cv2.CAP_PROP_FRAME_WIDTH), capR.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # ---------- สร้าง StereoSGBM (ตัวคำนวณ disparity) ----------
    stereo = cv2.StereoSGBM_create(
        minDisparity=0,
        numDisparities=16 * 48,  # 768 px (ต้องหาร 16 ลงตัว และ < ความกว้างภาพ)
        blockSize=9,
        P1=8 * 3 * 9 ** 2,
        P2=32 * 3 * 9 ** 2,
        disp12MaxDiff=1,
        uniquenessRatio=5,
        speckleWindowSize=50,
        speckleRange=2,
        preFilterCap=63,
        mode=cv2.STEREO_SGBM_MODE_SGBM_3WAY
    )

    TARGET_SHOW_WIDTH = 1920      # ไว้ใช้กับแต่ละ window แยก
    DEBUG_WIDTH = 1280            # ขนาด window รวม 3 รูป
    DEBUG_HEIGHT = 980
    printed_stats = False
    printed_z_stats = False

    while True:
        retL, frameL = capL.read()
        retR, frameR = capR.read()

        if not retL or not retR:
            print("ไม่สามารถอ่านภาพจากสตรีมได้")
            break

        # ---------- 1) Rectify ----------
        rectL, rectR = rectifier.rectify(frameL, frameR)

        # ---------- 2) Crop เฉพาะโซน plate ----------
        rectL_crop = crop_plate_roi(rectL, top_ratio=0.12,bottom_ratio=0.00, side_ratio=0.18)
        rectR_crop = crop_plate_roi(rectR, top_ratio=0.12,bottom_ratio=0.00, side_ratio=0.18)

        # ---------- 3) Gray ----------
        grayL = cv2.cvtColor(rectL_crop, cv2.COLOR_BGR2GRAY)
        grayR = cv2.cvtColor(rectR_crop, cv2.COLOR_BGR2GRAY)

        # ---------- 4) Disparity ----------
        disp_raw = stereo.compute(grayL, grayR).astype(np.float32) / 16.0

        if not printed_stats:
            valid_all = disp_raw[disp_raw > 0]
            if valid_all.size > 0:
                p5, p50, p95 = np.percentile(valid_all, [5, 50, 95])
                print("disp_raw min/max:", np.min(valid_all), np.max(valid_all))
                print("disp_raw p5/p50/p95:", p5, p50, p95)
            else:
                print("no valid disparity")
            printed_stats = True

        # เตรียม disparity สำหรับ visualization + depth
        disp = disp_raw.copy()
        disp[disp <= 0] = np.nan  # invalid -> NaN

        disp_for_depth = disp_raw.copy()
        disp_for_depth[disp_for_depth <= 0] = 0

        # ---------- 4.1) Disparity -> 3D ----------
        points_3d = cv2.reprojectImageTo3D(disp_for_depth, Q)  # (H, W, 3)
        depth_Z = points_3d[:, :, 2]

        # ---------- 5) ROI รอบจาน ----------
        h, w = disp.shape

        # ---- ปรับตำแหน่ง / ขนาด ROI ด้วยสัดส่วน ----
        ROI_CENTER_X_RATIO = 0.30   # center plate ~30% จากซ้าย
        ROI_CENTER_Y_RATIO = 0.54   # กลางภาพแนวตั้ง
        ROI_WIDTH_RATIO  = 0.60     # กว้าง ~60% ของภาพ
        ROI_HEIGHT_RATIO = 0.90     # สูง ~90% ของภาพ

        # คำนวณ center ของ ROI ด้วย ratio
        cx = int(w * ROI_CENTER_X_RATIO)
        cy = int(h * ROI_CENTER_Y_RATIO)

        half_w = int(w * ROI_WIDTH_RATIO  / 2.0)
        half_h = int(h * ROI_HEIGHT_RATIO / 2.0)

        roi_x1 = cx - half_w
        roi_x2 = cx + half_w
        roi_y1 = cy - half_h
        roi_y2 = cy + half_h

        # บังคับไม่ให้หลุดขอบภาพ
        roi_x1 = max(0, roi_x1)
        roi_y1 = max(0, roi_y1)
        roi_x2 = min(w, roi_x2)
        roi_y2 = min(h, roi_y2)

        # ---------- 5.0) สร้าง mask disparity ภายใน ROI ----------
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

        # ---------- 5.1) Clean Depth + Temporal smoothing ----------
        roi_Z = depth_Z[roi_y1:roi_y2, roi_x1:roi_x2]
        roi_Z_clean, valid_Z_roi = clean_depth_roi(roi_Z)

        if not printed_z_stats and valid_Z_roi.size > 0:
            print("ROI Z min/max:", np.min(valid_Z_roi), np.max(valid_Z_roi))
            printed_z_stats = True

        Z_obj_smooth = None

        if valid_Z_roi.size > 0:
            if Z_PLATE_REF is None:
                # ยังไม่ได้ตั้ง reference → ใช้ median ทั้ง ROI ให้นิ่งเฉย ๆ
                Z_med = np.median(valid_Z_roi)
                Z_HISTORY.append(Z_med)
                Z_obj_smooth = np.median(Z_HISTORY)
            else:
                # หลังมี reference แล้ว → วัตถุ = จุดที่เบี่ยงจากพื้นมากกว่า noise
                dZ_map = Z_PLATE_REF - roi_Z_clean  # หน่วยเดียวกับ depth

                # กำหนด threshold ตาม noise ของพื้น
                if Z_PLATE_NOISE_UNITS is not None:
                    MIN_DZ_UNITS = 3.0 * Z_PLATE_NOISE_UNITS  # วัตถุต้องสูงกว่า 3*noise
                else:
                    MIN_DZ_UNITS = 1500.0  # fallback ~170mm (0.112mm/unit)
                MAX_DZ_UNITS = 50000.0

                mask_obj = (
                    np.isfinite(dZ_map) &
                    (np.abs(dZ_map) > MIN_DZ_UNITS) &
                    (np.abs(dZ_map) < MAX_DZ_UNITS)
                )

                # ต้องมี pixel วัตถุเยอะพอ ไม่งั้นถือว่าไม่มีวัตถุ
                MIN_OBJ_PIXELS = 500  # ปรับได้ตามขนาดกล่องที่ใช้จริง
                num_obj = np.count_nonzero(mask_obj)

                if num_obj >= MIN_OBJ_PIXELS:
                    obj_Z_vals = roi_Z_clean[mask_obj]
                    Z_med = np.median(obj_Z_vals)
                    Z_HISTORY.append(Z_med)
                    Z_obj_smooth = np.median(Z_HISTORY)
                else:
                    Z_obj_smooth = None

        # ---------- 5.2) Depth + RGB พร้อมใช้งาน ----------
        roi_rgb = rectL_crop[roi_y1:roi_y2, roi_x1:roi_x2]
        roi_points_3d = points_3d[roi_y1:roi_y2, roi_x1:roi_x2, :]
        # (hook ไปใช้ต่อในระบบจริง เช่น วัด H/Volume)

        # ---------- 5.3) แสดงผลความสูง ----------
        text = ""
        if Z_PLATE_REF is None:
            text = f"Press 's' on EMPTY plate ({PLATE_DISTANCE_MM:.0f}mm)"
        elif SCALE_MM_PER_UNIT is None:
            text = f"Press 'c' with {H_KNOWN_MM:.0f}mm block (optional)"
        elif Z_obj_smooth is None:
            # มี reference แล้ว แต่ไม่เจอวัตถุที่สูงกว่าพื้น
            text = "H ~ 0.0 mm (no object)"
        else:
            dZ = Z_PLATE_REF - Z_obj_smooth
            height_mm = abs(dZ) * SCALE_MM_PER_UNIT
            text = f"H ~ {height_mm:.1f} mm"

        if text:
            cv2.putText(disp_color,text,(30, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2, cv2.LINE_AA,)

        # ---------- 6) เตรียมภาพไว้ดูเทียบ ----------
        raw_pair = cv2.hconcat([frameL, frameR])
        rect_pair = cv2.hconcat([rectL_crop, rectR_crop])

        # วาดกรอบ ROI บนภาพ Rectified
        cv2.rectangle(rect_pair, (roi_x1, roi_y1), (roi_x2, roi_y2), (0, 0, 255), 2,)

        def resize_to_width(img, target_w):
            h0, w0 = img.shape[:2]
            scale = target_w / float(w0)
            return cv2.resize(img, (target_w, int(h0 * scale)))

        # window แยกแต่ละตัว (ยังใช้ 1920 ได้ตามเดิม)
        raw_show  = resize_to_width(raw_pair,  TARGET_SHOW_WIDTH)
        rect_show = resize_to_width(rect_pair, TARGET_SHOW_WIDTH)

        disp_debug = disp_color.copy()
        cv2.rectangle(disp_debug, (roi_x1, roi_y1), (roi_x2, roi_y2), (0, 255, 255), 2,)
        disp_show = resize_to_width(disp_debug, TARGET_SHOW_WIDTH)

        # เส้นเขียวบน rectified
        h_show, w_show, _ = rect_show.shape
        for y in range(100, h_show, 100):
            cv2.line(rect_show, (0, y), (w_show, y), (0, 255, 0), 1)

        # ---------- 6.1) สร้าง Stereo Debug (3 รูปในเฟรมเดียว) ----------
        stage_h = DEBUG_HEIGHT // 3  # สูงของแต่ละแถวใน debug window

        raw_dbg  = cv2.resize(raw_pair,  (DEBUG_WIDTH, stage_h))
        rect_dbg = cv2.resize(rect_pair, (DEBUG_WIDTH, stage_h))
        disp_dbg = cv2.resize(disp_debug, (DEBUG_WIDTH, stage_h))

        debug_all = cv2.vconcat([raw_dbg, rect_dbg, disp_dbg])


        # ---------- 7) แสดงผล ----------
        cv2.imshow("Raw stereo (L|R)", raw_show)
        cv2.imshow("Rectified + Cropped (L|R)", rect_show)
        cv2.imshow("Disparity Map", disp_show)
        cv2.imshow("Stereo Debug (Raw | Rectified | Disparity)", debug_all)

        # ---------- 8) Key handling ----------
        key = cv2.waitKey(1) & 0xFF
        if key == 27 or key == ord('q'):
            break

        elif key == ord('s'):
            # คาลิเบรต Z ของพื้น plate (ตอน plate ว่าง)
            if valid_Z_roi.size > 0:
                Z_PLATE_REF = np.median(valid_Z_roi)

                # เคลียร์ history
                Z_HISTORY.clear()
                Z_HISTORY.append(Z_PLATE_REF)

                # ประเมิน noise ของพื้นจากความต่างรอบ ๆ median
                diff = roi_Z_clean - Z_PLATE_REF
                Z_PLATE_NOISE_UNITS = np.nanpercentile(np.abs(diff), 99)
                print(f"[CALIB] plate depth (units) = {Z_PLATE_REF:.3f}")
                print(f"[CALIB] plate noise (units, p99) = {Z_PLATE_NOISE_UNITS:.1f}")

                if abs(Z_PLATE_REF) > 1e-3:
                    SCALE_MM_PER_UNIT = PLATE_DISTANCE_MM / abs(Z_PLATE_REF)
                    print(f"[CALIB] distance = {PLATE_DISTANCE_MM:.1f} mm")
                    print(f"[CALIB] SCALE_Z = {SCALE_MM_PER_UNIT:.3f} mm / unitZ")
                else:
                    SCALE_MM_PER_UNIT = None
                    print("[CALIB] Plate depth too small, cannot compute scale")
            else:
                print("[CALIB] No valid depth in ROI to save for plate")


        elif key == ord('c'):
            # OPTIONAL: override scale ด้วยบล็อกที่รู้ความสูง H_KNOWN_MM
            if Z_PLATE_REF is None:
                print("[CALIB] Press 's' on EMPTY plate first")
            elif Z_obj_smooth is None:
                print("[CALIB] No valid depth in ROI for block")
            else:
                Z_block = Z_obj_smooth
                dZ = Z_PLATE_REF - Z_block
                if abs(dZ) < 0.5:
                    print(
                        f"[CALIB] dZ={dZ:.4f} too small, "
                        "move block / check setup"
                    )
                else:
                    SCALE_MM_PER_UNIT = H_KNOWN_MM / abs(dZ)
                    print(
                        f"[CALIB] SCALE override "
                        f"(from {H_KNOWN_MM:.1f}mm block) "
                        f"= {SCALE_MM_PER_UNIT:.6f} mm/unitZ (dZ={dZ:.6f})"
                    )

        elif key == ord('w'):
            # [Step 3] คาลิเบรต World Coordinate (fit plane ของ plate)
            roi_pts = roi_points_3d[np.isfinite(roi_Z_clean)]
            if roi_pts.shape[0] < 50:
                print("[WORLD] Not enough 3D points in ROI to fit plane")
            else:
                try:
                    n, d = fit_plane_from_points(roi_pts)
                    PLATE_PLANE_NORMAL = n
                    PLATE_PLANE_D = d
                    print(f"[WORLD] Plate plane: n={n}, d={d}")
                    print(
                        "[WORLD] Use distance = n·X + d "
                        "as world-height above plate"
                    )
                except Exception as e:
                    print("[WORLD] Plane fit error:", e)

        # ---------- 9) (Optional - AI Depth Refinement hook) ----------
        # ตรงนี้เตรียมไว้ต่อโมเดล AI ได้ในอนาคต

    capL.release()
    capR.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
