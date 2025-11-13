import cv2
import numpy as np
from urllib.parse import quote
import sys

# ให้ Python เห็น package app
sys.path.append(r"D:\FarmIQ\device\services\vision-capture-2cam-service")
from app.stereo_calib_utils import StereoRectifier
CALIB_YML = r"D:\FarmIQ\device\services\vision-capture-2cam-service\calib\stereo_rectify_maps.yml"
Z_PLATE_REF = None  # จะเซ็ตตอนกดปุ่ม 's'
SCALE_MM_PER_UNIT = None
H_KNOWN_MM = 50.0

# ---------- ฟังก์ชัน crop โซน plate (ใช้ค่าสำหรับทั้ง L/R ให้เหมือนกัน) ----------
def crop_plate_roi(img,
                   top_ratio=0.12,
                   bottom_ratio=0.00,
                   side_ratio=0.18):
    """ตัดขอบภาพออกให้เหลือเน้นบริเวณ plate

    - top_ratio    : ตัดจากขอบบนลงมา เป็นสัดส่วนของความสูง
    - bottom_ratio : ตัดจากขอบล่างขึ้นไป เป็นสัดส่วนของความสูง
    - side_ratio   : ตัดจากซ้าย/ขวาเข้ามา เป็นสัดส่วนของความกว้าง

    *สำคัญ: ใช้ค่าเดียวกันทั้งซ้ายและขวาเวลาเอาไปคำนวณ disparity*
    """
    h, w = img.shape[:2]

    top    = int(h * top_ratio)
    bottom = int(h * (1.0 - bottom_ratio))
    left   = int(w * side_ratio)
    right  = int(w * (1.0 - side_ratio))

    top    = max(0, min(top, h-1))
    bottom = max(top+1, min(bottom, h))
    left   = max(0, min(left, w-1))
    right  = max(left+1, min(right, w))

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

def main():
    # ---------- โหลด calibration + rectify maps ----------
    global Z_PLATE_REF, SCALE_MM_PER_UNIT
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

    print("Camera L size:", capL.get(cv2.CAP_PROP_FRAME_WIDTH),
          capL.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print("Camera R size:", capR.get(cv2.CAP_PROP_FRAME_WIDTH),
          capR.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # ---------- สร้าง StereoSGBM (ตัวคำนวณ disparity) ----------
    stereo = cv2.StereoSGBM_create(
        minDisparity=0,
        numDisparities=16 * 48,  # = 768 px (ต้องหารด้วย 16 ลงตัว, และ < ความกว้างภาพ)
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

    TARGET_SHOW_WIDTH = 1920
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

        # ---------- 2) Crop เฉพาะโซน plate (เหมือนกันทั้ง L/R) ----------
        rectL_crop = crop_plate_roi(
            rectL,
            top_ratio=0.12,
            bottom_ratio=0.00,
            side_ratio=0.18
        )
        rectR_crop = crop_plate_roi(
            rectR,
            top_ratio=0.12,
            bottom_ratio=0.00,
            side_ratio=0.18
        )

        # ---------- 3) แปลงเป็น Gray ----------
        grayL = cv2.cvtColor(rectL_crop, cv2.COLOR_BGR2GRAY)
        grayR = cv2.cvtColor(rectR_crop, cv2.COLOR_BGR2GRAY)

        # ---------- 4) คำนวณ Disparity ----------
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

        # ทำสำเนาไว้ 2 ชุด: ชุดหนึ่งใช้แสดงผล (มี NaN), อีกชุดไว้ reproject
        disp = disp_raw.copy()
        disp[disp <= 0] = np.nan  # invalid -> NaN

        disp_for_depth = disp_raw.copy()
        disp_for_depth[disp_for_depth <= 0] = 0

        # ---------- 4.1) แปลง Disparity -> 3D (X,Y,Z) ด้วย Q ----------
        points_3d = cv2.reprojectImageTo3D(disp_for_depth, Q)  # (H, W, 3)
        depth_Z = points_3d[:, :, 2]

        # ---------- 5) ROI รอบจาน (ใช้ทั้ง disparity + depth) ----------
        h, w = disp.shape
        cx, cy = w // 2, h // 2

        # ใช้ ROI กลาง crop (ตรงจานพอดี)
        roi_x1, roi_x2 = cx - 150, cx + 150
        roi_y1, roi_y2 = cy - 150, cy + 150

        # กันเลยขอบภาพ
        roi_x1 = max(0, roi_x1)
        roi_y1 = max(0, roi_y1)
        roi_x2 = min(w, roi_x2)
        roi_y2 = min(h, roi_y2)

        roi_disp = disp[roi_y1:roi_y2, roi_x1:roi_x2]
        valid_disp_roi = roi_disp[~np.isnan(roi_disp) & (roi_disp > 0)]

        if valid_disp_roi.size > 0:
            vmin, vmax = np.percentile(valid_disp_roi, [5, 95])
            # debug ถ้าต้องการ
            # r5, r50, r95 = np.percentile(valid_disp_roi, [5, 50, 95])
            # print("ROI disparity p5/p50/p95:", r5, r50, r95)
        else:
            vmin, vmax = 0.0, 1.0

        # เตรียมภาพ disparity สำหรับแสดงผล
        disp_vis = np.nan_to_num(disp, nan=vmin)

        if vmax - vmin < 1e-6:
            disp_norm = np.zeros_like(disp_vis, dtype=np.float32)
        else:
            disp_norm = (disp_vis - vmin) / (vmax - vmin)
            disp_norm = np.clip(disp_norm, 0, 1)

        disp_uint8 = (disp_norm * 255).astype(np.uint8)
        disp_color = cv2.applyColorMap(disp_uint8, cv2.COLORMAP_JET)

        # ---------- 5.1) คำนวณความสูงจาก depth_Z ----------
        roi_Z = depth_Z[roi_y1:roi_y2, roi_x1:roi_y2]
        valid_Z_roi = roi_Z[np.isfinite(roi_Z)]

        # debug ดูช่วง Z แค่รอบแรก
        if not printed_z_stats and valid_Z_roi.size > 0:
            print("ROI Z min/max:", np.min(valid_Z_roi), np.max(valid_Z_roi))
            printed_z_stats = True

        height_mm = None
        text = ""
        if Z_PLATE_REF is None:
            text = "Press 's' on EMPTY plate"
        elif SCALE_MM_PER_UNIT is None:
            text = f"Press 'c' with {H_KNOWN_MM:.0f}mm block"
        elif valid_Z_roi.size > 0:
            Z_obj = np.median(valid_Z_roi)
            dZ = Z_PLATE_REF - Z_obj
            height_mm = dZ * SCALE_MM_PER_UNIT
            text = f"H ~ {height_mm:.1f} mm"
        else:
            text = "No valid depth"

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

        # ---------- 6) เตรียมภาพไว้ดูเทียบ ----------
        raw_pair = cv2.hconcat([frameL, frameR])
        rect_pair = cv2.hconcat([rectL_crop, rectR_crop])

        # วาดกรอบ ROI บนภาพ rectified ด้วย จะได้เห็นว่าเราใช้โซนไหน
        cv2.rectangle(
            rect_pair,
            (roi_x1, roi_y1),
            (roi_x2, roi_y2),
            (0, 0, 255),
            2,
        )

        def resize_to_width(img, target_w):
            h0, w0 = img.shape[:2]
            scale = target_w / float(w0)
            return cv2.resize(img, (target_w, int(h0 * scale)))

        raw_show  = resize_to_width(raw_pair,  TARGET_SHOW_WIDTH)
        rect_show = resize_to_width(rect_pair, TARGET_SHOW_WIDTH)
        disp_show = resize_to_width(disp_color, TARGET_SHOW_WIDTH)

        # วาดเส้น epipolar บน rectified ไว้เช็ค
        h_show, w_show, _ = rect_show.shape
        for y in range(100, h_show, 100):
            cv2.line(rect_show, (0, y), (w_show, y), (0, 255, 0), 1)

        # ---------- 7) แสดงผล 3 หน้าต่าง ----------
        cv2.imshow("Raw stereo (L|R)", raw_show)
        cv2.imshow("Rectified + Cropped (L|R)", rect_show)
        cv2.imshow("Disparity Map", disp_show)

        key = cv2.waitKey(1) & 0xFF
        if key == 27 or key == ord('q'):
            break
        elif key == ord('s'):
            # คาลิเบรต Z ของพื้น plate (EMPTY)
            if valid_Z_roi.size > 0:
                Z_PLATE_REF = np.median(valid_Z_roi)
                SCALE_MM_PER_UNIT = None  # reset scale ทุกครั้งที่เปลี่ยน plate ref
                print(f"[CALIB] Plate depth = {Z_PLATE_REF:.6f} (unitZ)")
            else:
                print("[CALIB] No valid depth in ROI to save")
        elif key == ord('c'):
            # คาลิเบรต scale ด้วยบล็อกที่รู้ความสูง
            if Z_PLATE_REF is None:
                print("[CALIB] Press 's' on EMPTY plate first")
            elif valid_Z_roi.size == 0:
                print("[CALIB] No valid depth in ROI for block")
            else:
                Z_block = np.median(valid_Z_roi)
                dZ = Z_PLATE_REF - Z_block
                if abs(dZ) < 1e-6:
                    print("[CALIB] dZ too small, cannot compute scale")
                else:
                    SCALE_MM_PER_UNIT = H_KNOWN_MM / dZ
                    print(f"[CALIB] SCALE = {SCALE_MM_PER_UNIT:.6f} mm/unitZ (dZ={dZ:.6f})")

    capL.release()
    capR.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
