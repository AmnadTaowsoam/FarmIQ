from __future__ import annotations

import math
from dataclasses import dataclass
from typing import List, Optional, Dict, Any

import cv2
import numpy as np


@dataclass
class ClusterConfig:
    height_min_mm: float = 30.0
    min_area_px: int = 500
    dilate_iter: int = 1


def _estimate_floor(depth_mm: np.ndarray) -> float:
    valid = depth_mm[depth_mm > 0]
    if valid.size == 0:
        return 0.0
    return float(np.percentile(valid, 90))


def _mask_objects(
    depth_mm: np.ndarray,
    floor_mm: float,
    height_min_mm: float,
    dilate_iter: int,
) -> np.ndarray:
    height_map = floor_mm - depth_mm.astype(np.float32)
    mask = (height_map >= height_min_mm) & (depth_mm > 0)
    mask = mask.astype(np.uint8)
    if dilate_iter > 0:
        kernel = np.ones((3, 3), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=dilate_iter)
    return mask, height_map


def _cluster_dimensions_mm(
    xs: np.ndarray,
    ys: np.ndarray,
    depth_mm: np.ndarray,
    intrinsics: Optional[Dict[str, Any]],
) -> Dict[str, float]:
    depth_m = depth_mm.astype(np.float32) / 1000.0
    if intrinsics and all(k in intrinsics for k in ("fx", "fy", "ppx", "ppy")):
        fx = float(intrinsics["fx"])
        fy = float(intrinsics["fy"])
        ppx = float(intrinsics["ppx"])
        ppy = float(intrinsics["ppy"])

        x_coords_m = (xs - ppx) / fx * depth_m
        y_coords_m = (ys - ppy) / fy * depth_m
    else:
        # fallback: use pixel units assuming square pixels and average depth scale
        avg_depth_m = float(np.mean(depth_m)) if depth_m.size > 0 else 0.0
        if avg_depth_m <= 0:
            return {"width": 0.0, "length": 0.0}
        x_coords_m = (xs - xs.mean()) * avg_depth_m / 1000.0
        y_coords_m = (ys - ys.mean()) * avg_depth_m / 1000.0

    def perc_range(coords: np.ndarray) -> float:
        if coords.size == 0:
            return 0.0
        return float(np.percentile(coords, 95) - np.percentile(coords, 5))

    width_mm = perc_range(x_coords_m) * 1000.0
    length_mm = perc_range(y_coords_m) * 1000.0
    return {
        "width": width_mm,
        "length": length_mm,
    }


def compute_depth_clusters(
    depth_mm: np.ndarray,
    intrinsics: Optional[Dict[str, Any]],
    cfg: ClusterConfig,
) -> List[Dict[str, Any]]:
    if depth_mm.size == 0:
        return []

    floor_mm = _estimate_floor(depth_mm)
    mask, height_map = _mask_objects(depth_mm, floor_mm, cfg.height_min_mm, cfg.dilate_iter)

    if not mask.any():
        return []

    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask, connectivity=8)
    clusters: List[Dict[str, Any]] = []

    for label in range(1, num_labels):
        area = stats[label, cv2.CC_STAT_AREA]
        if area < cfg.min_area_px:
            continue

        x = stats[label, cv2.CC_STAT_LEFT]
        y = stats[label, cv2.CC_STAT_TOP]
        w = stats[label, cv2.CC_STAT_WIDTH]
        h = stats[label, cv2.CC_STAT_HEIGHT]

        region = labels == label
        region_depth = depth_mm[region]
        region_height = height_map[region]
        ys, xs = np.nonzero(region)

        dims = _cluster_dimensions_mm(xs, ys, region_depth, intrinsics)
        max_height = float(np.max(region_height))
        mean_height = float(np.mean(region_height))
        centroid_px = {"x": float(centroids[label][0]), "y": float(centroids[label][1])}
        centroid_depth_mm = float(np.median(region_depth))
        centroid_height_mm = float(np.median(region_height))

        cluster = {
            "id": label,
            "pixel_area": int(area),
            "bbox_px": {"x": int(x), "y": int(y), "w": int(w), "h": int(h)},
            "centroid_px": centroid_px,
            "centroid_mm": {
                "z": centroid_depth_mm,
                "height": centroid_height_mm,
            },
            "height_mm": {
                "max": max_height,
                "mean": mean_height,
            },
            "dimensions_mm": {
                "width": dims["width"],
                "length": dims["length"],
                "height": max_height,
            },
        }
        clusters.append(cluster)

    clusters.sort(key=lambda c: c["pixel_area"], reverse=True)
    return clusters
