## D:\FarmIQ\device\services\vision-capture-2cam-service\calib\calibrate_stereo_charuco.py
import cv2
import numpy as np
import glob
import os
from typing import List, Tuple

aruco = cv2.aruco

# =============================
# Config พื้นฐาน
# =============================
SQUARES_X = 10          # จำนวนช่องในแกน X (cols)
SQUARES_Y = 7           # จำนวนช่องในแกน Y (rows)
SQUARE_LEN = 30.0       # mm (scale ไม่สำคัญ แค่สัดส่วนถูก)
MARKER_LEN = 18.0       # mm

# แก้ path ตรงนี้ให้ตรงกับโฟลเดอร์ของคุณ
LEFT_DIR  = r"D:\\FarmIQ\\device\\services\\vision-capture-2cam-service\\calib\\samples\\left"
RIGHT_DIR = r"D:\\FarmIQ\\device\\services\\vision-capture-2cam-service\\calib\\samples\\right"
OUTPUT_DIR = r"D:\\FarmIQ\\device\\services\\vision-capture-2cam-service\\calib"

INTRINSICS_PATH = os.path.join(OUTPUT_DIR, "intrinsics_stereo.yml")
STEREO_CHARUCO_PATH = os.path.join(OUTPUT_DIR, "stereo_charuco.yml")
RECTIFY_MAP_PATH = os.path.join(OUTPUT_DIR, "stereo_rectify_maps.yml")

# alpha สำหรับ stereoRectify (0 = crop เยอะ, 1 = เก็บ FOV เยอะ)
RECTIFY_ALPHA = 0.25


# =============================
# Utils
# =============================

def list_images(folder: str) -> List[str]:
    exts = ("*.png", "*.jpg", "*.jpeg", "*.bmp")
    files: List[str] = []
    for e in exts:
        files.extend(glob.glob(os.path.join(folder, e)))
    return sorted(files)


def create_charuco_board() -> Tuple[aruco_CharucoBoard, np.ndarray]:  # type: ignore[name-defined]
    """สร้าง CharucoBoard และคืนทั้ง board + chessboard corners (3D)"""
    dictionary = aruco.getPredefinedDictionary(aruco.DICT_6X6_250)
    board = aruco.CharucoBoard(
        (SQUARES_X, SQUARES_Y),
        SQUARE_LEN,
        MARKER_LEN,
        dictionary,
    )
    board_obj_points = board.getChessboardCorners()
    return board, board_obj_points


def detect_charuco_in_pair(
    imgL: np.ndarray,
    imgR: np.ndarray,
    board: "aruco_CharucoBoard",  # type: ignore[name-defined]
    detector: "aruco_ArucoDetector",  # type: ignore[name-defined]
):
    """ตรวจ Charuco corners ในภาพซ้าย/ขวา 1 คู่
    คืนค่า:
        charucoCornersL, charucoIdsL,
        charucoCornersR, charucoIdsR
    ถ้าไม่เจอจะได้ (None, None, None, None)
    """

    grayL = cv2.cvtColor(imgL, cv2.COLOR_BGR2GRAY)
    grayR = cv2.cvtColor(imgR, cv2.COLOR_BGR2GRAY)

    # detect markers left
    cornersL, idsL, _ = detector.detectMarkers(grayL)
    if idsL is None or len(idsL) == 0:
        charucoCornersL, charucoIdsL = None, None
    else:
        _, charucoCornersL, charucoIdsL = aruco.interpolateCornersCharuco(
            markerCorners=cornersL,
            markerIds=idsL,
            image=grayL,
            board=board,
        )

    # detect markers right
    cornersR, idsR, _ = detector.detectMarkers(grayR)
    if idsR is None or len(idsR) == 0:
        charucoCornersR, charucoIdsR = None, None
    else:
        _, charucoCornersR, charucoIdsR = aruco.interpolateCornersCharuco(
            markerCorners=cornersR,
            markerIds=idsR,
            image=grayR,
            board=board,
        )

    return charucoCornersL, charucoIdsL, charucoCornersR, charucoIdsR


# =============================
# 1) รวบรวมจุด Charuco จากรูปทั้งหมด
# =============================

def collect_charuco_points():
    dictionary = aruco.getPredefinedDictionary(aruco.DICT_6X6_250)
    board, board_obj_points = create_charuco_board()

    detector_params = aruco.DetectorParameters()
    detector = aruco.ArucoDetector(dictionary, detector_params)

    left_images = list_images(LEFT_DIR)
    right_images = list_images(RIGHT_DIR)

    assert len(left_images) == len(right_images), "จำนวนรูปซ้าย/ขวาไม่เท่ากัน"
    print("จำนวนคู่ภาพ:", len(left_images))

    all_charuco_corners_left: List[np.ndarray] = []
    all_charuco_ids_left: List[np.ndarray] = []
    all_charuco_corners_right: List[np.ndarray] = []
    all_charuco_ids_right: List[np.ndarray] = []

    st_objpoints: List[np.ndarray] = []   # 3D
    st_imgpointsL: List[np.ndarray] = []  # 2D left
    st_imgpointsR: List[np.ndarray] = []  # 2D right

    image_size = None

    for fL, fR in zip(left_images, right_images):
        imgL = cv2.imread(fL)
        imgR = cv2.imread(fR)

        if imgL is None or imgR is None:
            print(f"[WARN] อ่านรูปไม่ได้: {fL} หรือ {fR}")
            continue

        grayL = cv2.cvtColor(imgL, cv2.COLOR_BGR2GRAY)
        grayR = cv2.cvtColor(imgR, cv2.COLOR_BGR2GRAY)

        if image_size is None:
            image_size = grayL.shape[::-1]  # (w, h)

        charucoCornersL, charucoIdsL, charucoCornersR, charucoIdsR = detect_charuco_in_pair(
            imgL, imgR, board, detector
        )

        # เก็บ single-camera
        if charucoIdsL is not None and len(charucoIdsL) > 10:
            all_charuco_corners_left.append(charucoCornersL)
            all_charuco_ids_left.append(charucoIdsL)

        if charucoIdsR is not None and len(charucoIdsR) > 10:
            all_charuco_corners_right.append(charucoCornersR)
            all_charuco_ids_right.append(charucoIdsR)

        # เตรียมข้อมูล stereo
        if charucoIdsL is None or charucoIdsR is None:
            continue

        idsL_f = charucoIdsL.flatten()
        idsR_f = charucoIdsR.flatten()
        common_ids = np.intersect1d(idsL_f, idsR_f)
        if len(common_ids) < 10:
            continue

        objp = []
        imgpL = []
        imgpR = []

        for cid in common_ids:
            idxL = np.where(idsL_f == cid)[0][0]
            idxR = np.where(idsR_f == cid)[0][0]

            objp.append(board_obj_points[cid])
            imgpL.append(charucoCornersL[idxL][0])
            imgpR.append(charucoCornersR[idxR][0])

        objp = np.array(objp, dtype=np.float32)
        imgpL = np.array(imgpL, dtype=np.float32)
        imgpR = np.array(imgpR, dtype=np.float32)

        st_objpoints.append(objp)
        st_imgpointsL.append(imgpL)
        st_imgpointsR.append(imgpR)

    print("เฟรมที่ใช้ calibrate กล้องซ้าย:", len(all_charuco_corners_left))
    print("เฟรมที่ใช้ calibrate กล้องขวา:", len(all_charuco_corners_right))
    print("เฟรมที่ใช้ stereo:", len(st_objpoints))

    if image_size is None:
        raise RuntimeError("ไม่พบภาพสำหรับ calibration")

    return (
        image_size,
        board,
        all_charuco_corners_left,
        all_charuco_ids_left,
        all_charuco_corners_right,
        all_charuco_ids_right,
        st_objpoints,
        st_imgpointsL,
        st_imgpointsR,
    )


# =============================
# 2) Calibrate single cameras
# =============================

def calibrate_single_cameras(
    image_size,
    board,
    all_charuco_corners_left,
    all_charuco_ids_left,
    all_charuco_corners_right,
    all_charuco_ids_right,
):
    print("\nCalibrating LEFT camera ...")
    retL, K_L, dist_L, rvecs_L, tvecs_L, stdInt_L, stdExt_L, perViewErr_L = (
        aruco.calibrateCameraCharucoExtended(
            charucoCorners=all_charuco_corners_left,
            charucoIds=all_charuco_ids_left,
            board=board,
            imageSize=image_size,
            cameraMatrix=None,
            distCoeffs=None,
        )
    )
    print("RMS error LEFT:", retL)
    print("K_L:\n", K_L)
    print("dist_L:", dist_L.ravel())

    print("\nCalibrating RIGHT camera ...")
    retR, K_R, dist_R, rvecs_R, tvecs_R, stdInt_R, stdExt_R, perViewErr_R = (
        aruco.calibrateCameraCharucoExtended(
            charucoCorners=all_charuco_corners_right,
            charucoIds=all_charuco_ids_right,
            board=board,
            imageSize=image_size,
            cameraMatrix=None,
            distCoeffs=None,
        )
    )
    print("RMS error RIGHT:", retR)
    print("K_R:\n", K_R)
    print("dist_R:", dist_R.ravel())

    # save intrinsics (optional)
    fs = cv2.FileStorage(INTRINSICS_PATH, cv2.FILE_STORAGE_WRITE)
    fs.write("image_width", int(image_size[0]))
    fs.write("image_height", int(image_size[1]))
    fs.write("K_left", K_L)
    fs.write("dist_left", dist_L)
    fs.write("K_right", K_R)
    fs.write("dist_right", dist_R)
    fs.release()
    print(f"Saved intrinsics to {INTRINSICS_PATH}")

    return K_L, dist_L, K_R, dist_R


# =============================
# 3) Stereo calibration
# =============================

def calibrate_stereo(
    image_size,
    K_L,
    dist_L,
    K_R,
    dist_R,
    st_objpoints,
    st_imgpointsL,
    st_imgpointsR,
):
    criteria = (
        cv2.TERM_CRITERIA_MAX_ITER + cv2.TERM_CRITERIA_EPS,
        100,
        1e-5,
    )
    flags = cv2.CALIB_FIX_INTRINSIC

    print("\nStereo calibrate ...")
    retStereo, K_L2, dist_L2, K_R2, dist_R2, R, T, E, F = cv2.stereoCalibrate(
        objectPoints=st_objpoints,
        imagePoints1=st_imgpointsL,
        imagePoints2=st_imgpointsR,
        cameraMatrix1=K_L,
        distCoeffs1=dist_L,
        cameraMatrix2=K_R,
        distCoeffs2=dist_R,
        imageSize=image_size,
        criteria=criteria,
        flags=flags,
    )

    print("RMS stereo:", retStereo)
    print("R:\n", R)
    print("T:\n", T)
    print("Baseline length (mm):", np.linalg.norm(T))

    # save stereo params รวมกับ intrinsics อีกไฟล์ (เผื่อใช้งาน)
    fs = cv2.FileStorage(STEREO_CHARUCO_PATH, cv2.FILE_STORAGE_WRITE)
    fs.write("image_width", image_size[0])
    fs.write("image_height", image_size[1])
    fs.write("K_left", K_L)
    fs.write("dist_left", dist_L)
    fs.write("K_right", K_R)
    fs.write("dist_right", dist_R)
    fs.write("R", R)
    fs.write("T", T)
    fs.write("E", E)
    fs.write("F", F)
    fs.release()
    print(f"Saved stereo params to {STEREO_CHARUCO_PATH}")

    return R, T, E, F


# =============================
# 4) สร้าง Rectification maps
# =============================

def create_rectify_maps(image_size, K_L, dist_L, K_R, dist_R, R, T):
    print("\n=== Stereo Rectify & Rectify Maps ===")
    alpha = RECTIFY_ALPHA

    R1, R2, P1, P2, Q, roi1, roi2 = cv2.stereoRectify(
        K_L,
        dist_L,
        K_R,
        dist_R,
        image_size,
        R,
        T,
        flags=cv2.CALIB_ZERO_DISPARITY,
        alpha=alpha,
    )

    mapLx, mapLy = cv2.initUndistortRectifyMap(
        K_L, dist_L, R1, P1, image_size, cv2.CV_32FC1
    )
    mapRx, mapRy = cv2.initUndistortRectifyMap(
        K_R, dist_R, R2, P2, image_size, cv2.CV_32FC1
    )

    print("mapLx shape:", mapLx.shape, "mapLy shape:", mapLy.shape)
    print("mapRx shape:", mapRx.shape, "mapRy shape:", mapRy.shape)

    fs = cv2.FileStorage(RECTIFY_MAP_PATH, cv2.FILE_STORAGE_WRITE)
    fs.write("mapLx", mapLx)
    fs.write("mapLy", mapLy)
    fs.write("mapRx", mapRx)
    fs.write("mapRy", mapRy)
    fs.write("Q", Q)
    fs.release()

    print(f"Saved rectify maps to {RECTIFY_MAP_PATH}")


# =============================
# main
# =============================

def main():
    # 1) collect points
    (
        image_size,
        board,
        all_charuco_corners_left,
        all_charuco_ids_left,
        all_charuco_corners_right,
        all_charuco_ids_right,
        st_objpoints,
        st_imgpointsL,
        st_imgpointsR,
    ) = collect_charuco_points()

    # 2) single camera calibration
    K_L, dist_L, K_R, dist_R = calibrate_single_cameras(
        image_size,
        board,
        all_charuco_corners_left,
        all_charuco_ids_left,
        all_charuco_corners_right,
        all_charuco_ids_right,
    )

    # 3) stereo calibration
    R, T, E, F = calibrate_stereo(
        image_size,
        K_L,
        dist_L,
        K_R,
        dist_R,
        st_objpoints,
        st_imgpointsL,
        st_imgpointsR,
    )

    # 4) create rectify maps
    create_rectify_maps(image_size, K_L, dist_L, K_R, dist_R, R, T)


if __name__ == "__main__":
    main()
