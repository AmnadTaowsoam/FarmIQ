from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Tuple

import cv2
import numpy as np
import yaml

log = logging.getLogger("stereo_proc")


def _load_yaml(path: Path) -> Dict:
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def _fit_plane(points: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Fit plane using SVD on centered points.
    Returns normal vector (unit) and d parameter in plane eq: n·p + d = 0.
    """
    centroid = points.mean(axis=0)
    residual = points - centroid
    _, _, vh = np.linalg.svd(residual, full_matrices=False)
    normal = vh[-1, :]
    normal /= np.linalg.norm(normal) + 1e-9
    # ensure normal roughly points upward (positive Z)
    if normal[2] < 0:
        normal = -normal
    d = -np.dot(normal, centroid)
    return normal, d


@dataclass
class StereoResult:
    capture_id: str
    timestamp: float
    left_frame: np.ndarray
    right_frame: np.ndarray
    depth_mm: np.ndarray
    disparity: np.ndarray
    rectified_left: np.ndarray
    rectified_right: np.ndarray
    stats: Dict
    object_metrics: Dict


class StereoProcessor:
    def __init__(
        self,
        *,
        calibration_path: Path,
        roi_fraction: float,
        focal_px: float,
        baseline_m: float,
        height_threshold_mm: float,
        plane_sample_size: int,
        median_blur_ksize: int,
        num_disparities: int,
        block_size: int,
        uniqueness_ratio: int,
        speckle_window: int,
        speckle_range: int,
        disp12_max_diff: int,
    ):
        self.roi_fraction = roi_fraction
        self.focal_px = focal_px
        self.baseline_m = baseline_m
        self.height_threshold_mm = height_threshold_mm
        self.plane_sample_size = plane_sample_size
        self.median_blur_ksize = median_blur_ksize if median_blur_ksize % 2 == 1 else max(median_blur_ksize - 1, 1)
        self.stereo_conf = dict(
            numDisparities=self._force_multiple(num_disparities, 16),
            blockSize=max(block_size | 1, 3),
            uniquenessRatio=uniqueness_ratio,
            speckleWindowSize=speckle_window,
            speckleRange=speckle_range,
            disp12MaxDiff=disp12_max_diff,
        )
        if not calibration_path.exists():
            raise FileNotFoundError(f"Stereo calibration file not found: {calibration_path}")
        self.calib = _load_yaml(calibration_path)
        self._prepare_rectification()
        self.sgbm = cv2.StereoSGBM_create(
            minDisparity=0,
            **self.stereo_conf,
            P1=8 * 3 * self.stereo_conf["blockSize"] ** 2,
            P2=32 * 3 * self.stereo_conf["blockSize"] ** 2,
        )

    @staticmethod
    def _force_multiple(value: int, base: int) -> int:
        return (value // base) * base or base

    def _prepare_rectification(self):
        left = self.calib["left"]
        right = self.calib["right"]
        stereo = self.calib["stereo"]
        size = (self.calib.get("image_width", 1280), self.calib.get("image_height", 720))

        K1 = np.array(left["camera_matrix"], dtype=np.float64).reshape(3, 3)
        D1 = np.array(left["dist_coeffs"], dtype=np.float64).reshape(-1, 1)
        K2 = np.array(right["camera_matrix"], dtype=np.float64).reshape(3, 3)
        D2 = np.array(right["dist_coeffs"], dtype=np.float64).reshape(-1, 1)
        R = np.array(stereo["rotation"], dtype=np.float64).reshape(3, 3)
        T = np.array(stereo["translation"], dtype=np.float64).reshape(3, 1)

        R1, R2, P1, P2, Q, _, _ = cv2.stereoRectify(
            K1, D1, K2, D2, size, R, T, flags=cv2.CALIB_ZERO_DISPARITY, alpha=0
        )
        self.Q = Q
        self.P1 = P1
        self.rect_size = size
        self.left_map = cv2.initUndistortRectifyMap(K1, D1, R1, P1, size, cv2.CV_32FC1)
        self.right_map = cv2.initUndistortRectifyMap(K2, D2, R2, P2, size, cv2.CV_32FC1)

    def _apply_roi(self, img: np.ndarray):
        frac = np.clip(self.roi_fraction, 0.1, 1.0)
        if frac >= 0.999:
            return img, (0, 0)
        h, w = img.shape[:2]
        dw = int((1 - frac) * w / 2)
        dh = int((1 - frac) * h / 2)
        return img[dh : h - dh, dw : w - dw], (dw, dh)

    def process(self, capture_id: str, timestamp: float, left_frame, right_frame) -> StereoResult:
        rect_left = cv2.remap(left_frame, self.left_map[0], self.left_map[1], cv2.INTER_LINEAR)
        rect_right = cv2.remap(right_frame, self.right_map[0], self.right_map[1], cv2.INTER_LINEAR)
        gray_left = cv2.cvtColor(rect_left, cv2.COLOR_BGR2GRAY)
        gray_right = cv2.cvtColor(rect_right, cv2.COLOR_BGR2GRAY)

        roi_left, (offset_x, offset_y) = self._apply_roi(gray_left)
        roi_right, _ = self._apply_roi(gray_right)

        disparity = self.sgbm.compute(roi_left, roi_right).astype(np.float32) / 16.0
        disparity[disparity <= 0.1] = np.nan
        if self.median_blur_ksize >= 3:
            disparity = cv2.medianBlur(disparity, self.median_blur_ksize)

        depth_m = (self.focal_px * self.baseline_m) / (disparity + 1e-9)
        depth_mm = depth_m * 1000.0
        valid_mask = np.isfinite(depth_mm)

        # Build point cloud in rectified coordinates
        fx = self.P1[0, 0]
        fy = self.P1[1, 1]
        cx = self.P1[0, 2]
        cy = self.P1[1, 2]

        yy, xx = np.indices(depth_mm.shape)
        xx_full = xx + offset_x
        yy_full = yy + offset_y

        Z = depth_m
        X = (xx_full - cx) * Z / fx
        Y = (yy_full - cy) * Z / fy

        xyz = np.stack([X, Y, Z], axis=-1)
        xyz_valid = xyz[valid_mask]
        depth_valid = depth_mm[valid_mask]

        if xyz_valid.shape[0] < 1000:
            raise RuntimeError("Not enough valid depth points; check lighting or calibration")

        sample_idx = np.random.choice(xyz_valid.shape[0], min(self.plane_sample_size, xyz_valid.shape[0]), replace=False)
        sample_points = xyz_valid[sample_idx]
        normal, d = _fit_plane(sample_points)
        plane_height = (np.dot(xyz, normal) + d) * 1000.0  # mm signed distance

        object_mask = np.logical_and(valid_mask, plane_height > self.height_threshold_mm)
        object_points = xyz[object_mask]

        metrics = self._measure_object(object_points, plane_height[object_mask])

        disparity_stats = {
            "min": float(np.nanmin(disparity)),
            "max": float(np.nanmax(disparity)),
            "mean": float(np.nanmean(disparity)),
            "std": float(np.nanstd(disparity)),
        }
        depth_stats = {
            "min_mm": float(np.nanmin(depth_mm)),
            "max_mm": float(np.nanmax(depth_mm)),
            "mean_mm": float(np.nanmean(depth_mm)),
            "median_mm": float(np.nanmedian(depth_mm)),
            "std_mm": float(np.nanstd(depth_mm)),
            "valid_points": int(np.sum(valid_mask)),
        }

        stats = {
            "disparity": disparity_stats,
            "depth": depth_stats,
            "plane_normal": normal.tolist(),
            "plane_d": float(d),
            "height_threshold_mm": self.height_threshold_mm,
            "roi_offset": {"x": offset_x, "y": offset_y},
        }

        return StereoResult(
            capture_id=capture_id,
            timestamp=timestamp,
            left_frame=left_frame,
            right_frame=right_frame,
            rectified_left=rect_left,
            rectified_right=rect_right,
            depth_mm=depth_mm.astype(np.float32),
            disparity=disparity,
            stats=stats,
            object_metrics=metrics,
        )

    def _measure_object(self, object_points: np.ndarray, heights_mm: np.ndarray) -> Dict:
        if object_points.size == 0:
            return {
                "present": False,
                "volume_mm3": 0.0,
                "max_height_mm": 0.0,
                "width_mm": 0.0,
                "length_mm": 0.0,
            }
        fx = self.P1[0, 0]
        fy = self.P1[1, 1]
        z_m = object_points[:, 2]
        height_m = heights_mm / 1000.0
        pixel_area_m2 = (z_m / fx) * (z_m / fy)
        volume_m3 = np.sum(height_m * pixel_area_m2)
        volume_mm3 = float(volume_m3 * 1e9)

        width_mm = float((object_points[:, 0].max() - object_points[:, 0].min()) * 1000.0)
        length_mm = float((object_points[:, 1].max() - object_points[:, 1].min()) * 1000.0)
        max_height_mm = float(np.max(heights_mm))

        centroid = object_points.mean(axis=0) * 1000.0
        bbox = {
            "width_mm": width_mm,
            "length_mm": length_mm,
            "height_mm": max_height_mm,
        }

        return {
            "present": True,
            "volume_mm3": volume_mm3,
            "max_height_mm": max_height_mm,
            "bbox_mm": bbox,
            "centroid_mm": {
                "x": float(centroid[0]),
                "y": float(centroid[1]),
                "z": float(centroid[2]),
            },
            "point_count": int(object_points.shape[0]),
        }


__all__ = ["StereoProcessor", "StereoResult"]
