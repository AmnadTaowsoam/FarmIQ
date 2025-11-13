from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from typing import Tuple

import cv2

log = logging.getLogger("stereo_rig")


@dataclass
class FramePair:
    left: any
    right: any
    timestamp: float


class StereoRig:
    """เปิดและดึงเฟรมจากกล้องซ้าย/ขวาให้ได้เฟรมที่ synchronous ใกล้เคียงกัน"""

    def __init__(
        self,
        left_url: str,
        right_url: str,
        resolution: Tuple[int, int],
        fps: int,
        wait_ms_between_frames: int = 100,
    ):
        self.left_url = left_url
        self.right_url = right_url
        self.resolution = resolution
        self.fps = fps
        self.wait_ms_between_frames = wait_ms_between_frames
        self.left_cap = None
        self.right_cap = None
        self._open_cameras()

    def _open_cameras(self):
        w, h = self.resolution
        self.left_cap = cv2.VideoCapture(self.left_url)
        self.right_cap = cv2.VideoCapture(self.right_url)
        for cap, label in ((self.left_cap, "left"), (self.right_cap, "right")):
            if not cap.isOpened():
                raise RuntimeError(f"cannot open {label} camera stream")
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, float(w))
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, float(h))
            cap.set(cv2.CAP_PROP_FPS, float(self.fps))
        log.info("Stereo rig ready: %s <-> %s", self.left_url, self.right_url)

    def _capture_single(self, cap, label: str):
        ok, frame = cap.read()
        if not ok or frame is None:
            log.warning("Failed to read frame from %s camera", label)
            return None
        return frame

    def capture_pair(self, retries: int = 3, delay_sec: float = 0.2) -> FramePair:
        for attempt in range(1, retries + 1):
            left = self._capture_single(self.left_cap, "left")
            right = self._capture_single(self.right_cap, "right")
            if left is not None and right is not None:
                ts = time.time()
                return FramePair(left=left, right=right, timestamp=ts)
            log.warning("Stereo capture attempt %d/%d failed; retrying...", attempt, retries)
            time.sleep(delay_sec)
            self.reinitialize()
        raise RuntimeError("unable to capture stereo frame pair after retries")

    def reinitialize(self):
        try:
            self.close()
        except Exception:
            pass
        time.sleep(self.wait_ms_between_frames / 1000.0)
        self._open_cameras()

    def close(self):
        if self.left_cap is not None:
            self.left_cap.release()
        if self.right_cap is not None:
            self.right_cap.release()
        log.info("Stereo rig closed")


__all__ = ["StereoRig", "FramePair"]
