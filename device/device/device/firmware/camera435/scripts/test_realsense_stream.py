#scripts/test_realsense_stream.py
#!/usr/bin/env python3
"""Stream color and depth frames from an Intel RealSense device."""

from __future__ import annotations

import sys
import time
from typing import Tuple

import numpy as np

try:
    import cv2
except ImportError as exc:  # pragma: no cover - runtime guard
    sys.exit(
        "OpenCV (cv2) is not installed. "
        "Install dependencies with `pip install -r requirements.txt`."
    )

try:
    import pyrealsense2 as rs
except ImportError as exc:  # pragma: no cover - runtime guard
    sys.exit(
        "pyrealsense2 is not installed. "
        "Install dependencies with `pip install -r requirements.txt`."
    )


WINDOW_TITLE = "RealSense Color + Depth"
FRAME_SIZE: Tuple[int, int] = (640, 480)
FPS_TARGET = 30


def main() -> int:
    pipeline = rs.pipeline()
    config = rs.config()
    width, height = FRAME_SIZE
    config.enable_stream(rs.stream.depth, width, height, rs.format.z16, FPS_TARGET)
    config.enable_stream(rs.stream.color, width, height, rs.format.bgr8, FPS_TARGET)

    align = rs.align(rs.stream.color)

    try:
        profile = pipeline.start(config)
    except RuntimeError as exc:
        sys.exit(f"Unable to start RealSense pipeline: {exc}")

    depth_scale = profile.get_device().first_depth_sensor().get_depth_scale()
    print(f"Depth sensor scale: {depth_scale:.6f} meters per unit")

    cv2.namedWindow(WINDOW_TITLE, cv2.WINDOW_AUTOSIZE)

    frame_counter = 0
    fps = 0.0
    fps_timer = time.perf_counter()

    try:
        while True:
            frames = pipeline.wait_for_frames()
            frames = align.process(frames)

            depth_frame = frames.get_depth_frame()
            color_frame = frames.get_color_frame()
            if not depth_frame or not color_frame:
                continue

            depth_image = np.asanyarray(depth_frame.get_data())
            color_image = np.asanyarray(color_frame.get_data())

            depth_colormap = cv2.convertScaleAbs(depth_image, alpha=0.03)
            depth_colormap = cv2.applyColorMap(depth_colormap, cv2.COLORMAP_JET)

            center_distance = depth_frame.get_distance(width // 2, height // 2)

            frame_counter += 1
            if frame_counter >= 10:
                now = time.perf_counter()
                elapsed = now - fps_timer
                if elapsed > 0:
                    fps = frame_counter / elapsed
                fps_timer = now
                frame_counter = 0

            combined = np.hstack((color_image, depth_colormap))

            overlay = f"FPS: {fps:4.1f} | Center distance: {center_distance:.3f} m"
            cv2.putText(
                combined,
                overlay,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
                cv2.LINE_AA,
            )

            cv2.imshow(WINDOW_TITLE, combined)

            key = cv2.waitKey(1) & 0xFF
            if key in (ord("q"), ord("Q"), 27):  # 27 == ESC
                break
    except KeyboardInterrupt:
        print("\nInterrupted by user.")
    finally:
        pipeline.stop()
        cv2.destroyAllWindows()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

