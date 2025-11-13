from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple

from dotenv import load_dotenv


def _str2bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_resolution(value: str, fallback: Tuple[int, int]) -> Tuple[int, int]:
    try:
        w, h = value.lower().split("x")
        return int(w), int(h)
    except Exception:
        return fallback


@dataclass(frozen=True)
class Config:
    tenant: str
    house: str
    station: str
    rig_id: str
    left_camera_url: str
    right_camera_url: str
    resolution: Tuple[int, int]
    fps: int
    focal_px: float
    baseline_m: float
    roi_fraction: float
    stereo_calib_path: Path
    num_disparities: int
    block_size: int
    uniqueness_ratio: int
    speckle_window: int
    speckle_range: int
    disp12_max_diff: int
    height_threshold_mm: float
    plane_sample_size: int
    median_blur_ksize: int
    media_dir: Path
    spool_dir: Path
    upload_enabled: bool
    capture_interval_sec: float
    run_once: bool
    log_level: str
    max_retries: int
    retry_delay_sec: float
    wait_ms_between_frames: int

    @classmethod
    def load(cls, env_path: str | None = None) -> "Config":
        env_file = env_path or Path(__file__).resolve().parent.parent / ".env"
        if Path(env_file).exists():
            load_dotenv(env_file)

        tenant = os.getenv("TENANT", "t1")
        house = os.getenv("HOUSE", "h01")
        station = os.getenv("STATION", "st01")
        rig_id = os.getenv("RIG_ID", "rig01")
        left_camera_url = os.getenv("LEFT_CAMERA_URL", "")
        right_camera_url = os.getenv("RIGHT_CAMERA_URL", "")

        resolution = _parse_resolution(os.getenv("RESOLUTION", "1280x720"), (1280, 720))
        fps = int(os.getenv("FPS", "30"))
        focal_px = float(os.getenv("FOCAL_PX", "1500.0"))
        baseline_m = float(os.getenv("BASELINE_M", "0.12"))
        roi_fraction = float(os.getenv("ROI_FRACTION", "0.65"))

        stereo_calib_path = Path(
            os.getenv(
                "STEREO_CALIB_PATH",
                str(Path(__file__).resolve().parent.parent / "calib" / "stereo.example.yml"),
            )
        )

        num_disparities = int(os.getenv("NUM_DISPARITIES", "256"))
        block_size = int(os.getenv("BLOCK_SIZE", "5"))
        uniqueness_ratio = int(os.getenv("UNIQUENESS_RATIO", "10"))
        speckle_window = int(os.getenv("SPECKLE_WINDOW", "50"))
        speckle_range = int(os.getenv("SPECKLE_RANGE", "2"))
        disp12_max_diff = int(os.getenv("DISP12_MAX_DIFF", "1"))
        height_threshold_mm = float(os.getenv("HEIGHT_THRESHOLD_MM", "30"))
        plane_sample_size = int(os.getenv("PLANE_SAMPLE_SIZE", "6000"))
        median_blur_ksize = int(os.getenv("MEDIAN_BLUR_KSIZE", "3"))

        media_dir = Path(os.getenv("MEDIA_DIR", "./media")).expanduser().resolve()
        spool_dir = Path(os.getenv("SPOOL_DIR", "./spool")).expanduser().resolve()
        upload_enabled = _str2bool(os.getenv("UPLOAD_ENABLED", "false"))

        capture_interval_sec = float(os.getenv("CAPTURE_INTERVAL_SEC", "15"))
        run_once = _str2bool(os.getenv("RUN_ONCE", "false"))
        log_level = os.getenv("LOG_LEVEL", "INFO").upper()
        max_retries = int(os.getenv("MAX_RETRIES", "3"))
        retry_delay_sec = float(os.getenv("RETRY_DELAY_SEC", "2"))
        wait_ms_between_frames = int(os.getenv("WAIT_MS_BETWEEN_FRAMES", "100"))

        return cls(
            tenant=tenant,
            house=house,
            station=station,
            rig_id=rig_id,
            left_camera_url=left_camera_url,
            right_camera_url=right_camera_url,
            resolution=resolution,
            fps=fps,
            focal_px=focal_px,
            baseline_m=baseline_m,
            roi_fraction=roi_fraction,
            stereo_calib_path=stereo_calib_path,
            num_disparities=num_disparities,
            block_size=block_size,
            uniqueness_ratio=uniqueness_ratio,
            speckle_window=speckle_window,
            speckle_range=speckle_range,
            disp12_max_diff=disp12_max_diff,
            height_threshold_mm=height_threshold_mm,
            plane_sample_size=plane_sample_size,
            median_blur_ksize=median_blur_ksize,
            media_dir=media_dir,
            spool_dir=spool_dir,
            upload_enabled=upload_enabled,
            capture_interval_sec=capture_interval_sec,
            run_once=run_once,
            log_level=log_level,
            max_retries=max_retries,
            retry_delay_sec=retry_delay_sec,
            wait_ms_between_frames=wait_ms_between_frames,
        )


__all__ = ["Config"]
