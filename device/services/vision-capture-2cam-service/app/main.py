from __future__ import annotations

import argparse
import logging
import time
import uuid

import cv2

from .config import Config
from .spooler import Spooler
from .stereo_processor import StereoProcessor
from .stereo_rig import StereoRig


def build_arg_parser():
    parser = argparse.ArgumentParser(description="Stereo capture service for dual Hikvision cameras")
    parser.add_argument("--env", help="Path to .env file", default=None)
    parser.add_argument("--run-once", action="store_true", help="Override RUN_ONCE and capture only one frame")
    return parser


def create_logger(level: str):
    logging.basicConfig(
        level=getattr(logging, level, logging.INFO),
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )


def run(cfg: Config, run_once_override: bool = False):
    rig = StereoRig(
        cfg.left_camera_url,
        cfg.right_camera_url,
        cfg.resolution,
        cfg.fps,
        wait_ms_between_frames=cfg.wait_ms_between_frames,
    )
    processor = StereoProcessor(
        calibration_path=cfg.stereo_calib_path,
        roi_fraction=cfg.roi_fraction,
        focal_px=cfg.focal_px,
        baseline_m=cfg.baseline_m,
        height_threshold_mm=cfg.height_threshold_mm,
        plane_sample_size=cfg.plane_sample_size,
        median_blur_ksize=cfg.median_blur_ksize,
        num_disparities=cfg.num_disparities,
        block_size=cfg.block_size,
        uniqueness_ratio=cfg.uniqueness_ratio,
        speckle_window=cfg.speckle_window,
        speckle_range=cfg.speckle_range,
        disp12_max_diff=cfg.disp12_max_diff,
    )
    spooler = Spooler(cfg.media_dir, cfg.spool_dir)
    identity = {
        "tenant": cfg.tenant,
        "house": cfg.house,
        "station": cfg.station,
        "rig_id": cfg.rig_id,
        "left_camera_url": cfg.left_camera_url,
        "right_camera_url": cfg.right_camera_url,
    }

    try:
        while True:
            capture_id = uuid.uuid4().hex
            frame_pair = rig.capture_pair(cfg.max_retries, cfg.retry_delay_sec)
            result = processor.process(
                capture_id=capture_id,
                timestamp=frame_pair.timestamp,
                left_frame=frame_pair.left,
                right_frame=frame_pair.right,
            )
            spooler.write(result, identity)
            if cfg.run_once or run_once_override:
                break
            time.sleep(cfg.capture_interval_sec)
    finally:
        rig.close()


def main():
    args = build_arg_parser().parse_args()
    cfg = Config.load(args.env)
    create_logger(cfg.log_level)
    run(cfg, run_once_override=args.run_once)


if __name__ == "__main__":
    main()
