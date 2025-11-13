# app/services/camera.py
from __future__ import annotations
import logging
from pathlib import Path
from uuid import uuid4
from typing import Optional, Dict, Any, Tuple, NamedTuple

import cv2
import numpy as np

log = logging.getLogger("camera")

# พยายามรองรับ Intel RealSense ถ้ามี
try:
    import pyrealsense2 as rs  # type: ignore
except Exception:
    rs = None


class CameraCaptureResult(NamedTuple):
    path: Path
    extras: Dict[str, Any]


class Camera:
    """
    Unified camera wrapper.

    source:
      - "realsense" | "d4xx family (d435/d415/d455/d457)" | "rs:" -> ใช้ Intel RealSense (พยายามเปิด color; ถ้าไม่มีจะ fallback เป็น infrared)
      - "rs:ir"                        -> บังคับโหมด infrared
      - "0","1",...                    -> OpenCV VideoCapture จาก index
      - "rtsp://..." / "http(s)://..." -> OpenCV ผ่าน URL

    read_frame() -> ndarray (BGR, uint8)
    capture_still(out_dir, img_format="jpg") -> Path
    """

    def __init__(
        self,
        source: str,
        resolution: str,
        fps: int,
        *,
        depth_mm_scale: float = 1.0,
        depth_mm_offset: float = 0.0,
        capture_roi: Optional[Tuple[int, int, int, int]] = None,
    ):
        self.source_raw = (source or "0").strip()
        self.w, self.h = [int(x) for x in resolution.lower().split("x")]
        self.fps = int(fps)
        self.depth_mm_scale = float(depth_mm_scale or 1.0)
        self.depth_mm_offset = float(depth_mm_offset or 0.0)
        self.capture_roi = capture_roi

        s = self.source_raw.lower()
        rs_aliases = {
            "realsense",
            "d435",
            "d415",
            "d455",
            "d457",
            "d4xx",
        }
        self.use_rs = (
            s in rs_aliases
            or s.startswith("rs:")
            or (s.startswith("d4") and s[2:].isdigit())
        )
        self.force_ir = s.startswith("rs:ir")

        # OpenCV state
        self.cap: Optional[cv2.VideoCapture] = None
        self.cv_source: int | str = int(self.source_raw) if self.source_raw.isdigit() else self.source_raw

        # RealSense state
        self.pipeline: Optional["rs.pipeline"] = None
        self.stream_is_color: bool = True  # ถ้า false = infrared
        self.depth_enabled: bool = False
        self.depth_scale: float = 0.001
        self.depth_resolution: Tuple[int, int] = (self.w, self.h)
        self._rs_align: Optional["rs.align"] = None

    # ---------- open/close ----------
    def _open(self):
        log.debug("Opening camera source='%s' (RealSense=%s)", self.source_raw, self.use_rs)
        if self.use_rs:
            self._open_rs()
        else:
            self._open_cv()

    def _configure_depth_stream(self, cfg: "rs.config") -> bool:
        """
        Enable depth stream with a list of fallback resolutions.
        Returns True if depth stream successfully configured.
        """
        if rs is None:
            return False
        depth_candidates = [
            (self.w, self.h),
            (848, 480),
            (640, 480),
        ]
        for dw, dh in depth_candidates:
            try:
                cfg.enable_stream(rs.stream.depth, dw, dh, rs.format.z16, self.fps)
                self.depth_resolution = (dw, dh)
                log.debug("RealSense depth stream enabled at %dx%d@%d", dw, dh, self.fps)
                return True
            except Exception as e:
                log.debug("RealSense depth stream %dx%d unsupported: %s", dw, dh, e)
        log.warning("RealSense depth stream unavailable; continuing without depth data")
        return False

    def _setup_depth_parameters(self, profile: "rs.pipeline_profile") -> None:
        """
        Extract depth scale and cache for later conversions.
        """
        if rs is None:
            self.depth_scale = 0.001
            return
        try:
            depth_sensor = profile.get_device().first_depth_sensor()
            self.depth_scale = float(depth_sensor.get_depth_scale())
            log.debug("RealSense depth scale set to %.6f m/unit", self.depth_scale)
        except Exception as e:
            self.depth_scale = 0.001
            log.warning("Failed to read RealSense depth scale, using default 0.001 m/unit: %s", e)

    def _grab_frames(self) -> Tuple[np.ndarray, Optional[np.ndarray], Optional["rs.intrinsics"]]:
        """
        Retrieve the latest frame.

        Returns tuple of:
            - BGR frame (numpy array)
            - depth frame data (raw units) or None
            - depth intrinsics (rs.intrinsics) or None
        """
        self._open()
        depth_data: Optional[np.ndarray] = None
        depth_intrinsics: Optional["rs.intrinsics"] = None

        if self.use_rs:
            assert self.pipeline is not None
            frames = self.pipeline.wait_for_frames()
            if self.depth_enabled and self._rs_align is not None:
                try:
                    frames = self._rs_align.process(frames)
                except Exception as e:
                    log.debug("RealSense align failed, using unaligned frames: %s", e)

            if self.stream_is_color:
                color = frames.get_color_frame()
                if not color:
                    raise RuntimeError("No color frame from RealSense")
                frame = np.asanyarray(color.get_data())  # already BGR
            else:
                ir = frames.get_infrared_frame()
                if not ir:
                    raise RuntimeError("No infrared frame from RealSense")
                gray = np.asanyarray(ir.get_data())
                frame = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

            if self.depth_enabled:
                depth_frame = frames.get_depth_frame()
                if depth_frame:
                    depth_data = np.asanyarray(depth_frame.get_data())
                    try:
                        depth_intrinsics = depth_frame.profile.as_video_stream_profile().get_intrinsics()
                    except Exception:
                        depth_intrinsics = None
                else:
                    log.debug("RealSense depth frame missing in current capture")
            frame_np = frame
            depth_np = depth_data
            if self.capture_roi:
                x1, y1, x2, y2 = self.capture_roi
                x1, y1 = max(x1, 0), max(y1, 0)
                x2, y2 = min(x2, frame.shape[1]), min(y2, frame.shape[0])
                y1 = max(y1, 0)
                x1 = max(x1, 0)
                y2 = min(y2, frame.shape[0])
                x2 = min(x2, frame.shape[1])
                frame_np = frame_np[y1:y2, x1:x2]
                if depth_np is not None:
                    depth_np = depth_np[y1:y2, x1:x2]
                    if depth_intrinsics is not None:
                        depth_intrinsics = self._adjust_intrinsics(
                            depth_intrinsics,
                            x1,
                            y1,
                            x2 - x1,
                            y2 - y1,
                        )

            return frame_np, depth_np, depth_intrinsics

        # OpenCV / generic camera path
        assert self.cap is not None
        ok, frame = self.cap.read()
        if not ok or frame is None:
            log.warning("Frame read failed (source=%s); reopening VideoCapture...", self.cv_source)
            try:
                self.cap.release()
            except Exception:
                pass
            self.cap = None
            self._open_cv()
            assert self.cap is not None
            ok, frame = self.cap.read()
            if not ok or frame is None:
                raise RuntimeError(f"Failed to read frame from camera source={self.cv_source} (is the device busy?)")
        if self.capture_roi:
            x1, y1, x2, y2 = self.capture_roi
            x1, y1 = max(x1, 0), max(y1, 0)
            x2, y2 = min(x2, frame.shape[1]), min(y2, frame.shape[0])
            frame = frame[y1:y2, x1:x2]

        return frame, depth_data, depth_intrinsics

    def _prepare_depth_payload(
        self,
        depth_raw: np.ndarray,
        intrinsics: Optional["rs.intrinsics"],
    ) -> Optional[Dict[str, Any]]:
        if depth_raw is None or depth_raw.size == 0:
            return None

        valid_mask = depth_raw > 0
        if not np.any(valid_mask):
            return {
                "frame_px": {"width": int(depth_raw.shape[1]), "height": int(depth_raw.shape[0])},
                "valid_points": 0,
                "scale_m_per_unit": float(self.depth_scale),
                "stats_mm": None,
                "dimensions_mm": None,
                "dimensions_method": None,
                "image_mm": np.zeros_like(depth_raw, dtype=np.uint16),
            }

        depth_scale_m = float(self.depth_scale or 0.001)
        depth_m = depth_raw.astype(np.float32) * depth_scale_m
        if self.depth_mm_scale != 1.0:
            depth_m *= self.depth_mm_scale
        depth_mm = depth_m * 1000.0 + self.depth_mm_offset
        depth_mm_uint16 = np.clip(np.round(depth_mm), 0, np.iinfo(np.uint16).max).astype(np.uint16)

        valid_mm = depth_mm[valid_mask]
        stats_mm = {
            "min": float(np.min(valid_mm)),
            "max": float(np.max(valid_mm)),
            "mean": float(np.mean(valid_mm)),
            "median": float(np.median(valid_mm)),
            "std": float(np.std(valid_mm)),
        }

        dimensions_mm: Optional[Dict[str, float]] = None
        centroid_mm: Optional[Dict[str, float]] = None
        if intrinsics is not None and getattr(intrinsics, "fx", 0.0):
            try:
                ys, xs = np.nonzero(valid_mask)
                depth_m_valid = depth_m[valid_mask]
                x_coords_m = (xs - intrinsics.ppx) / intrinsics.fx * depth_m_valid
                y_coords_m = (ys - intrinsics.ppy) / intrinsics.fy * depth_m_valid
                z_coords_m = depth_m_valid

                def _prange(arr: np.ndarray) -> float:
                    return float(np.percentile(arr, 95) - np.percentile(arr, 5))

                dimensions_mm = {
                    "width": _prange(x_coords_m) * 1000.0,   # X axis span
                    "length": _prange(y_coords_m) * 1000.0,  # Y axis span
                    "height": _prange(z_coords_m) * 1000.0,  # Z axis span
                }
                centroid_mm = {
                    "x": float(np.median(x_coords_m) * 1000.0),
                    "y": float(np.median(y_coords_m) * 1000.0),
                    "z": float(np.median(z_coords_m) * 1000.0),
                }
            except Exception as e:
                log.debug("Failed to compute depth dimensions: %s", e)
                dimensions_mm = None
                centroid_mm = None

        intrinsics_dict = None
        if intrinsics is not None:
            intrinsics_dict = {
                "width": int(intrinsics.width),
                "height": int(intrinsics.height),
                "fx": float(intrinsics.fx),
                "fy": float(intrinsics.fy),
                "ppx": float(intrinsics.ppx),
                "ppy": float(intrinsics.ppy),
                "model": int(getattr(intrinsics, "model", 0)),
                "coeffs": [float(c) for c in getattr(intrinsics, "coeffs", [0, 0, 0, 0, 0])],
            }

        return {
            "frame_px": {"width": int(depth_raw.shape[1]), "height": int(depth_raw.shape[0])},
            "valid_points": int(valid_mask.sum()),
            "scale_m_per_unit": depth_scale_m,
            "stats_mm": stats_mm,
            "dimensions_mm": dimensions_mm,
            "dimensions_method": "percentile_5_95" if dimensions_mm else None,
            "centroid_mm": centroid_mm,
            "image_mm": depth_mm_uint16,
            "intrinsics": intrinsics_dict,
            "calibration": {
                "mm_scale": self.depth_mm_scale,
                "mm_offset": self.depth_mm_offset,
            },
        }

    def _open_cv(self):
        if self.cap is not None:
            return
        self.cap = cv2.VideoCapture(self.cv_source)
        if not self.cap or not self.cap.isOpened():
            log.error("OpenCV cannot open source %s", self.cv_source)
        # ตั้งค่าพื้นฐาน (บางไดรเวอร์อาจไม่รับ แต่ลอง set ไว้ก่อน)
        try:
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.w)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.h)
            self.cap.set(cv2.CAP_PROP_FPS, self.fps)
        except Exception:
            pass
        log.info("OpenCV camera opened: %s", self.cv_source)

    def _open_rs(self):
        if rs is None:
            raise RuntimeError("pyrealsense2 not installed but CAMERA_SOURCE requires RealSense. Install with `pip install pyrealsense2` or disable RealSense mode.")
        if self.pipeline is not None:
            return
        self.pipeline = rs.pipeline()
        cfg = rs.config()
        log.info(
            "Initializing RealSense camera source='%s' resolution=%sx%s fps=%s",
            self.source_raw,
            self.w,
            self.h,
            self.fps,
        )

        # โหมดสีปกติ (bgr8); ถ้าไม่มีหรือบังคับ IR -> fallback
        if self.force_ir:
            self.stream_is_color = False
        else:
            self.stream_is_color = True

        def _enable_rgb_or_ir(config: "rs.config") -> None:
            if self.stream_is_color:
                log.debug("Enabling RealSense color stream")
                config.enable_stream(rs.stream.color, self.w, self.h, rs.format.bgr8, self.fps)
            else:
                log.debug("Enabling RealSense infrared stream")
                config.enable_stream(rs.stream.infrared, 1, self.w, self.h, rs.format.y8, self.fps)

        # พยายามเปิด depth stream เสมอ
        self.depth_enabled = self._configure_depth_stream(cfg)

        try:
            _enable_rgb_or_ir(cfg)
            profile = self.pipeline.start(cfg)
        except Exception as e:
            if not self.force_ir:
                log.warning("Color stream not available, falling back to infrared: %s", e)
                self.stream_is_color = False
                cfg.disable_all_streams()
                self.depth_enabled = self._configure_depth_stream(cfg)
                _enable_rgb_or_ir(cfg)
                profile = self.pipeline.start(cfg)
            else:
                self.pipeline = None
                raise

        if self.depth_enabled:
            self._rs_align = rs.align(rs.stream.color if self.stream_is_color else rs.stream.infrared)
            self._setup_depth_parameters(profile)
        else:
            self._rs_align = None
            self.depth_scale = 0.001

        log.info(
            "RealSense pipeline started (color=%s, depth=%s, depth_scale=%.4f m/unit)",
            self.stream_is_color,
            self.depth_enabled,
            self.depth_scale,
        )

    def close(self):
        if self.use_rs and self.pipeline is not None:
            try:
                self.pipeline.stop()
            except Exception:
                pass
            self.pipeline = None
            log.info("RealSense pipeline stopped")
        if not self.use_rs and self.cap is not None:
            try:
                self.cap.release()
            except Exception:
                pass
            self.cap = None
            log.info("OpenCV camera released")

    # ---------- frame capture ----------
    def read_frame(self) -> np.ndarray:
        """
        Return a BGR image (uint8).
        For infrared frames (grayscale), it converts to BGR for consistency.
        """
        frame, _, _ = self._grab_frames()
        return frame

    def capture_still(self, out_dir: Path, img_format: str = "jpg") -> CameraCaptureResult:
        """
        Capture single frame and save to disk.
        Returns saved file path.
        """
        frame, depth_raw, depth_intr = self._grab_frames()
        extras: Dict[str, Any] = {
            "frame": {
                "width_px": int(frame.shape[1]),
                "height_px": int(frame.shape[0]),
                "format": img_format.lower(),
                "source": self.source_raw,
            }
        }

        depth_payload = (
            self._prepare_depth_payload(depth_raw, depth_intr)
            if depth_raw is not None
            else None
        )

        out_dir.mkdir(parents=True, exist_ok=True)
        fname = f"{uuid4()}.{img_format.lower()}"
        out_path = out_dir / fname

        ext = img_format.lower()
        if ext in ("jpg", "jpeg"):
            cv2.imwrite(str(out_path), frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
        elif ext == "png":
            cv2.imwrite(str(out_path), frame, [cv2.IMWRITE_PNG_COMPRESSION, 3])
        else:
            # default to PNG ifไม่รู้จัก
            cv2.imwrite(str(out_path.with_suffix(".png")), frame, [cv2.IMWRITE_PNG_COMPRESSION, 3])
            out_path = out_path.with_suffix(".png")

        if depth_payload:
            depth_image = depth_payload.pop("image_mm")
            depth_path = out_dir / f"{out_path.stem}.depth.png"
            try:
                cv2.imwrite(str(depth_path), depth_image)
            except Exception as e:
                log.warning("Failed to write depth map to %s: %s", depth_path, e)
            else:
                depth_payload["path"] = str(depth_path)
                depth_payload["units"] = "millimeter"
            extras["depth"] = depth_payload

        return CameraCaptureResult(out_path, extras)
    def _adjust_intrinsics(
        self,
        intr: "rs.intrinsics",
        x_offset: int,
        y_offset: int,
        new_width: int,
        new_height: int,
    ) -> "rs.intrinsics":
        intr_copy = rs.intrinsics()
        intr_copy.width = new_width
        intr_copy.height = new_height
        intr_copy.fx = intr.fx
        intr_copy.fy = intr.fy
        intr_copy.ppx = intr.ppx - x_offset
        intr_copy.ppy = intr.ppy - y_offset
        intr_copy.coeffs = intr.coeffs
        intr_copy.model = intr.model
        return intr_copy
