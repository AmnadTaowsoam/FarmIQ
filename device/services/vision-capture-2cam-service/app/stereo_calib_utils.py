import cv2
import numpy as np

INTRINSICS_PATH = r"D:\FarmIQ\device\services\vision-capture-2cam-service\calib\intrinsics_stereo.yml"
RECTIFY_PATH    = r"D:\FarmIQ\device\services\vision-capture-2cam-service\calib\stereo_rectify_maps.yml"


def load_intrinsics(path=INTRINSICS_PATH):
    fs = cv2.FileStorage(path, cv2.FILE_STORAGE_READ)
    if not fs.isOpened():
        raise RuntimeError(f"Cannot open intrinsics file: {path}")

    image_width  = int(fs.getNode("image_width").real())
    image_height = int(fs.getNode("image_height").real())

    K_left     = fs.getNode("K_left").mat()
    dist_left  = fs.getNode("dist_left").mat()
    K_right    = fs.getNode("K_right").mat()
    dist_right = fs.getNode("dist_right").mat()
    R          = fs.getNode("R").mat()
    T          = fs.getNode("T").mat()
    E          = fs.getNode("E").mat()
    F          = fs.getNode("F").mat()

    fs.release()

    image_size = (image_width, image_height)
    return image_size, K_left, dist_left, K_right, dist_right, R, T, E, F


def load_rectify_maps(path=RECTIFY_PATH):
    fs = cv2.FileStorage(path, cv2.FILE_STORAGE_READ)
    if not fs.isOpened():
        raise RuntimeError(f"Cannot open rectify file: {path}")

    mapLx = fs.getNode("mapLx").mat()
    mapLy = fs.getNode("mapLy").mat()
    mapRx = fs.getNode("mapRx").mat()
    mapRy = fs.getNode("mapRy").mat()
    Q     = fs.getNode("Q").mat()

    fs.release()
    return mapLx, mapLy, mapRx, mapRy, Q


class StereoRectifier:
    def __init__(self,
                 intrinsics_path=INTRINSICS_PATH,
                 rectify_path=RECTIFY_PATH):

        (self.image_size,
         self.K_left, self.dist_left,
         self.K_right, self.dist_right,
         self.R, self.T, self.E, self.F) = load_intrinsics(intrinsics_path)

        (self.mapLx, self.mapLy,
         self.mapRx, self.mapRy,
         self.Q) = load_rectify_maps(rectify_path)

    def rectify(self, frameL, frameR):
        rectL = cv2.remap(frameL, self.mapLx, self.mapLy, cv2.INTER_LINEAR)
        rectR = cv2.remap(frameR, self.mapRx, self.mapRy, cv2.INTER_LINEAR)
        return rectL, rectR
