# scripts/list_realsense.py
#!/usr/bin/env python3
"""List connected Intel RealSense devices and their sensors."""

from __future__ import annotations

import sys
from typing import Iterable

try:
    import pyrealsense2 as rs
except ImportError as exc:  # pragma: no cover - runtime guard
    sys.exit(
        "pyrealsense2 is not installed. "
        "Install dependencies with `pip install -r requirements.txt`."
    )


def format_sensor_profiles(sensor: rs.sensor) -> Iterable[str]:
    """Yield human readable stream profile descriptions for the given sensor."""
    for profile in sensor.get_stream_profiles():
        # common fields
        stream_type = profile.stream_type()
        stream_name = str(stream_type).split(".")[-1]
        fmt_name = str(profile.format()).split(".")[-1]

        # บางรุ่น/บางโปรไฟล์เป็นวิดีโอ บางอย่างไม่ใช่ (เช่น motion/pose)
        # ใน Python API ไม่มี is_video_profile(); ต้องลอง cast เป็น video แล้วจับ exception
        try:
            vprof = profile.as_video_stream_profile()  # จะ raise RuntimeError ถ้าไม่ใช่วิดีโอ
            w = vprof.width()
            h = vprof.height()
            fps = vprof.fps()
            yield f"{stream_name}@{fps}fps {w}x{h} ({fmt_name})"
        except RuntimeError:
            # non-video stream profile
            # บางโปรไฟล์ยังเรียก fps ได้ ถ้าเรียกไม่ได้ก็ข้ามเป็น 'n/a'
            try:
                fps = profile.fps()
            except Exception:
                fps = "n/a"
            yield f"{stream_name}@{fps}fps (non-video) ({fmt_name})"


def describe_device(device: rs.device) -> None:
    """Print all useful information for a single RealSense device."""
    name = device.get_info(rs.camera_info.name)
    serial = device.get_info(rs.camera_info.serial_number)
    firmware = device.get_info(rs.camera_info.firmware_version)
    usb_type = device.get_info(rs.camera_info.usb_type_descriptor)

    print(f"Device: {name}")
    print(f"  Serial:   {serial}")
    print(f"  Firmware: {firmware}")
    print(f"  USB Type: {usb_type or 'Unknown'}")

    sensors = list(device.query_sensors())
    if not sensors:
        print("  Sensors: none detected")
        return

    print("  Sensors:")
    for sensor in sensors:
        sensor_name = sensor.get_info(rs.camera_info.name)
        print(f"    - {sensor_name}")
        for idx, profile_desc in enumerate(format_sensor_profiles(sensor), start=1):
            print(f"        [{idx:02d}] {profile_desc}")


def main() -> int:
    ctx = rs.context()
    devices = ctx.query_devices()
    if not devices:
        print("No Intel RealSense devices detected.")
        print("• Check the USB cable/port (USB 3 recommended).")
        print("• Confirm the device appears inside Intel RealSense Viewer.")
        return 1

    print(f"Found {len(devices)} RealSense device(s):\n")
    for device in devices:
        describe_device(device)
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
