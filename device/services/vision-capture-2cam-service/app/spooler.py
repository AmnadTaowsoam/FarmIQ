from __future__ import annotations

import json
import logging
from dataclasses import asdict
from hashlib import sha256
from pathlib import Path
from typing import Dict

import cv2
import numpy as np

from .stereo_processor import StereoResult

log = logging.getLogger("spooler")


class Spooler:
    def __init__(self, media_dir: Path, spool_dir: Path):
        self.media_dir = media_dir
        self.spool_dir = spool_dir
        self.media_dir.mkdir(parents=True, exist_ok=True)
        self.spool_dir.mkdir(parents=True, exist_ok=True)

    def _write_image(self, path: Path, image: np.ndarray):
        if not cv2.imwrite(str(path), image):
            raise RuntimeError(f"Failed to write image to {path}")

    def _write_depth_png(self, path: Path, depth_mm: np.ndarray):
        depth_16 = np.nan_to_num(depth_mm, nan=0.0).astype(np.uint16)
        if not cv2.imwrite(str(path), depth_16):
            raise RuntimeError(f"Failed to write depth map {path}")

    def _hash_file(self, path: Path) -> str:
        h = sha256()
        with open(path, "rb") as fh:
            for chunk in iter(lambda: fh.read(65536), b""):
                h.update(chunk)
        return h.hexdigest()

    def write(self, result: StereoResult, identity: Dict):
        capture_id = result.capture_id
        base = self.spool_dir / capture_id
        left_path = base.with_suffix(".left.jpg")
        right_path = base.with_suffix(".right.jpg")
        rect_left_path = base.with_suffix(".rect_left.jpg")
        rect_right_path = base.with_suffix(".rect_right.jpg")
        depth_path = base.with_suffix(".depth.png")
        meta_path = base.with_suffix(".json")

        self._write_image(left_path, result.left_frame)
        self._write_image(right_path, result.right_frame)
        self._write_image(rect_left_path, result.rectified_left)
        self._write_image(rect_right_path, result.rectified_right)
        self._write_depth_png(depth_path, result.depth_mm)

        metadata = {
            "capture_id": capture_id,
            "timestamp": result.timestamp,
            "identity": identity,
            "paths": {
                "left": str(left_path),
                "right": str(right_path),
                "rect_left": str(rect_left_path),
                "rect_right": str(rect_right_path),
                "depth": str(depth_path),
            },
            "stats": result.stats,
            "object_metrics": result.object_metrics,
            "hashes": {
                "left": self._hash_file(left_path),
                "right": self._hash_file(right_path),
                "rect_left": self._hash_file(rect_left_path),
                "rect_right": self._hash_file(rect_right_path),
                "depth": self._hash_file(depth_path),
            },
        }

        with open(meta_path, "w", encoding="utf-8") as fh:
            json.dump(metadata, fh, ensure_ascii=False, indent=2)

        log.info("Saved capture %s (object present=%s)", capture_id, metadata["object_metrics"]["present"])


__all__ = ["Spooler"]
