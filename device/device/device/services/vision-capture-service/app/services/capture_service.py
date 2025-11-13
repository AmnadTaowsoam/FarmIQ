# app/services/capture_service.py
from __future__ import annotations
import json
import logging
import threading
import time
import os
from pathlib import Path
from uuid import uuid4
from collections import deque
from typing import Optional, Tuple

import cv2
import numpy as np

from .camera import Camera, CameraCaptureResult
from .ingest_client import IngestClient
from .mqtt_bus import MqttBus
from app.utils.hashing import sha256_of_file
from app.utils.time import utc_now_iso
from app.utils.depth_clusters import compute_depth_clusters, ClusterConfig

log = logging.getLogger("capture")


# ---------- Presence (motion) ----------
class MotionPresence:
    """ตรวจการมีวัตถุแบบเบา ๆ ด้วย background subtraction + area threshold"""
    def __init__(
        self,
        min_area: int,
        min_frames: int,
        roi: Optional[Tuple[int, int, int, int]] = None,
        linger_ms: int = 300,
    ):
        self.sub = cv2.createBackgroundSubtractorMOG2(history=200, varThreshold=16, detectShadows=False)
        self.min_area = int(min_area)
        self.min_frames = int(min_frames)
        self.roi = roi
        self.linger_ms = max(int(linger_ms), 0)
        self._present_until = 0.0

    def _crop(self, frame):
        if not self.roi:
            return frame
        x1, y1, x2, y2 = self.roi
        return frame[max(y1, 0):y2, max(x1, 0):x2]

    def present_now(self, frame) -> bool:
        frame = self._crop(frame)
        fg = self.sub.apply(frame)
        fg = cv2.medianBlur(fg, 5)
        _, th = cv2.threshold(fg, 200, 255, cv2.THRESH_BINARY)
        th = cv2.dilate(th, None, iterations=2)
        cnts, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        area = max((cv2.contourArea(c) for c in cnts), default=0)
        detected = area >= self.min_area

        now = time.monotonic()
        if detected:
            # latch detection to tolerate brief pauses between motion frames
            self._present_until = now + (self.linger_ms / 1000.0)
            return True

        if self._present_until and now < self._present_until:
            return True

        self._present_until = 0.0
        return False

    def wait_for_presence(self, get_frame, timeout_ms: int, need: Optional[int] = None) -> bool:
        need = int(need or self.min_frames)
        hit = 0
        t0 = time.time()
        while (time.time() - t0) * 1000 < timeout_ms:
            frame = get_frame()
            if self.present_now(frame):
                hit += 1
                if hit >= need:
                    return True
            else:
                hit = 0
            time.sleep(0.03)  # ~30 FPS
        return False


# ---------- Scale (optional via pyserial) ----------
try:
    import serial  # type: ignore
except Exception:
    serial = None  # ถ้าไม่มี pyserial จะปิดฟีเจอร์ชั่งให้อัตโนมัติ


class ScaleReader:
    """อ่านค่าจากเครื่องชั่งผ่าน serial แล้วรอให้นิ่งตามเกณฑ์"""
    def __init__(self, port: str, baud: int, default_unit: str = "g"):
        if serial is None:
            raise RuntimeError("pyserial is not installed")
        self.port = port
        self.baud = baud
        default = (default_unit or "g").strip().lower()
        self.default_unit = default if default in ("g", "kg") else "g"

    def _open(self):
        return serial.Serial(self.port, self.baud, timeout=0.2)

    def _parse_weight(self, line: str) -> Optional[float]:
        # ครอบจักรวาลเบื้องต้น: เลข + หน่วย g|kg
        import re
        m = re.search(r"([-+]?\d+(?:\.\d+)?)\s*(kg|g)?", line.lower())
        if not m:
            return None
        val = float(m.group(1))
        unit = m.group(2) or "g"
        if not m.group(2):
            unit = self.default_unit
            log.debug("scale: no unit found; using default_unit=%s line=%r", unit, line)
        return val * 1000.0 if unit == "kg" else val

    def wait_stable(self, min_grams: float, delta: float, stable_ms: int, timeout_ms: int) -> Optional[float]:
        t0 = time.time()
        buf = []
        stable_t0 = None
        with self._open() as ser:
            while (time.time() - t0) * 1000 < timeout_ms:
                line = ser.readline().decode("utf-8", errors="ignore").strip()
                if not line:
                    continue
                w = self._parse_weight(line)
                if w is None:
                    log.debug("scale: ignored line=%r", line)
                    continue
                log.debug("scale: reading %.2f g", w)
                if w < min_grams:
                    buf.clear()
                    stable_t0 = None
                    log.debug(
                        "scale: below min_grams %.2f < %.2f (buffer cleared)",
                        w,
                        min_grams,
                    )
                    continue
                buf.append(w)
                buf = buf[-10:]  # keep last 10
                log.debug("scale: buffer=%s (delta=%.2f)", buf, max(buf) - min(buf))
                if max(buf) - min(buf) <= delta:
                    if stable_t0 is None:
                        stable_t0 = time.time()
                        log.debug("scale: buffer within delta %.2f, start stability timer", delta)
                    if (time.time() - stable_t0) * 1000 >= stable_ms:
                        weight = sum(buf) / len(buf)
                        log.info("scale: stable weight detected %.2f g", weight)
                        return sum(buf) / len(buf)
                else:
                    stable_t0 = None
                    log.debug("scale: buffer exceeded delta %.2f, reset stability timer", delta)
        return None


# ---------- Capture Service ----------
class CaptureService:
    def __init__(
        self,
        *,
        camera: Camera,
        ingest: IngestClient,
        mqtt: MqttBus,
        topic_evt_captured: str,
        spool_dir: Path,
        identity: dict,
        cfg=None,  # ส่ง app.config.Config เข้ามาได้ เพื่อใช้ค่าพวก PRESENCE/ SCALE/ COOLDOWN
    ):
        self.camera = camera
        self.ingest = ingest
        self.mqtt = mqtt
        self.topic_evt_captured = topic_evt_captured
        self.spool_dir = spool_dir
        self.identity = identity
        self.cfg = cfg
        self.upload_enabled = bool(getattr(cfg, "UPLOAD_ENABLED", True)) if cfg else True
        self._uploader_thread = None
        if self.upload_enabled:
            self._uploader_thread = threading.Thread(target=self._uploader_loop, daemon=True)
        self._stop = threading.Event()
        self._seen_events = deque(maxlen=256)
        self._cooldown_until = 0.0
        self._last_weight_g: Optional[float] = None
        self._last_weight_ts: float = 0.0
        self._weight_session_delta = float(getattr(cfg, "WEIGHT_SESSION_DELTA_G", 0.0) if cfg else 0.0)
        self._weight_session_cooldown = float(getattr(cfg, "WEIGHT_SESSION_COOLDOWN_SEC", 0.0) if cfg else 0.0)
        self._cluster_cfg: Optional[ClusterConfig] = None
        if cfg:
            self._cluster_cfg = ClusterConfig(
                height_min_mm=float(getattr(cfg, "DEPTH_CLUSTER_HEIGHT_MIN_MM", 30.0)),
                min_area_px=int(getattr(cfg, "DEPTH_CLUSTER_MIN_AREA_PX", 500)),
                dilate_iter=int(getattr(cfg, "DEPTH_CLUSTER_DILATE_ITER", 1)),
            )

        # Presence setup
        self.presence: Optional[MotionPresence] = None
        if cfg and getattr(cfg, "PRESENCE_MODE", "none") == "motion":
            roi = None
            if getattr(cfg, "PRESENCE_ROI", ""):
                try:
                    x1, y1, x2, y2 = [int(x) for x in cfg.PRESENCE_ROI.split(",")]
                    roi = (x1, y1, x2, y2)
                except Exception:
                    log.warning("Invalid PRESENCE_ROI, use full frame")
            self.presence = MotionPresence(
                cfg.PRESENCE_MIN_AREA,
                cfg.PRESENCE_MIN_FRAMES,
                roi,
                getattr(cfg, "PRESENCE_LINGER_MS", 300),
            )

        # Scale setup
        self.scale: Optional[ScaleReader] = None
        if cfg and getattr(cfg, "SCALE_ENABLED", False):
            if serial is None:
                log.warning("SCALE_ENABLED=true but pyserial not installed; scale will be disabled")
            else:
                try:
                    default_unit = getattr(cfg, "SCALE_DEFAULT_UNIT", "g")
                    self.scale = ScaleReader(cfg.SCALE_PORT, cfg.SCALE_BAUD, default_unit=default_unit)
                    log.info("Scale enabled on port=%s baud=%s (default_unit=%s)", cfg.SCALE_PORT, cfg.SCALE_BAUD, default_unit or "g")
                except Exception as e:
                    log.warning("Scale init failed: %s", e)

    # ===== helper =====
    @staticmethod
    def _blur_variance(img_path: Path) -> float:
        data = np.fromfile(str(img_path), dtype=np.uint8)  # รองรับ path unicode
        img = cv2.imdecode(data, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 0.0
        return float(cv2.Laplacian(img, cv2.CV_64F).var())

    def _get_frame(self):
        if hasattr(self.camera, "read_frame"):
            return self.camera.read_frame()
        raise RuntimeError("Camera.read_frame() is required for presence detection")

    def _wait_presence_if_needed(self, only_if_present: bool) -> bool:
        if not only_if_present:
            return True
        if not self.presence:
            log.info("only_if_present requested but presence detector is not configured; skip capture")
            return False
        timeout_ms = int(getattr(self.cfg, "PRESENCE_TIMEOUT_MS", 5000) if self.cfg else 5000)
        return self.presence.wait_for_presence(self._get_frame, timeout_ms)

    def _wait_weight_if_needed(self, wait_weight: bool) -> Optional[float]:
        if not wait_weight:
            return None
        if not self.scale:
            log.info("wait_weight requested but scale is not configured; skip capture")
            return None
        cfg = self.cfg
        log.info(
            "scale: waiting for stable weight (min=%.1f g, delta=%.1f g, stable=%d ms, timeout=%d ms)",
            getattr(cfg, "SCALE_MIN_GRAMS", 50),
            getattr(cfg, "SCALE_STABLE_DELTA", 2),
            getattr(cfg, "SCALE_STABLE_MS", 800),
            getattr(cfg, "SCALE_TIMEOUT_MS", 6000),
        )
        weight = self.scale.wait_stable(
            getattr(cfg, "SCALE_MIN_GRAMS", 50),
            getattr(cfg, "SCALE_STABLE_DELTA", 2),
            getattr(cfg, "SCALE_STABLE_MS", 800),
            getattr(cfg, "SCALE_TIMEOUT_MS", 6000),
        )
        if weight is not None:
            log.info("scale: capture will use weight %.2f g", weight)
        else:
            log.info("scale: no stable weight within timeout")
        return weight

    def _reset_weight_session(self):
        self._last_weight_g = None
        self._last_weight_ts = 0.0

    def _should_capture_weight_session(self, weight_g: float, now: float) -> bool:
        if self._last_weight_g is None:
            return True
        delta = abs(weight_g - self._last_weight_g)
        if self._weight_session_delta > 0 and delta >= self._weight_session_delta:
            return True
        if self._weight_session_cooldown > 0 and (now - self._last_weight_ts) >= self._weight_session_cooldown:
            return True
        if self._weight_session_delta <= 0 and self._weight_session_cooldown <= 0:
            return True
        return False

    def _mark_weight_session(self, weight_g: float, ts: float):
        self._last_weight_g = weight_g
        self._last_weight_ts = ts

    # === public ===
    def start(self):
        self.spool_dir.mkdir(parents=True, exist_ok=True)
        if self.upload_enabled and self._uploader_thread:
            self._uploader_thread.start()
        else:
            log.info("Uploader disabled; images will remain in spool_dir=%s", self.spool_dir)

    def stop(self):
        self._stop.set()

    # รองรับ payload v1/v2
    def handle_mqtt_cmd(self, payload: dict):
        event_id = payload.get("event_id")
        if event_id and event_id in self._seen_events:
            log.info("Duplicate event_id=%s ignored", event_id)
            return
        if event_id:
            self._seen_events.append(event_id)

        # ACK
        try:
            self.mqtt.publish_json(self.topic_evt_captured.replace("/captured", "/ack"), {
                "schema": "capture_ack@1",
                "event_id": event_id,
                "accepted": True,
                "reason": None,
                "ts": utc_now_iso(),
            })
        except Exception:
            log.exception("Failed to publish ACK")

        opts = {
            "settle_ms": int(payload.get("settle_ms") or 0),
            "burst_count": int(payload.get("burst", {}).get("count") or 1),
            "burst_interval_ms": int(payload.get("burst", {}).get("interval_ms") or 100),
            "deadline_ms": int(payload.get("deadline_ms") or 0),
            "only_if_present": bool(payload.get("only_if_present", False)),
            "wait_weight": bool(payload.get("wait_weight", False)),
        }
        extra_meta = {
            "event_id": event_id,
            "robot_id": payload.get("robot_id"),
            "job_id": payload.get("job_id"),
            "waypoint_id": payload.get("waypoint_id"),
            "pose": payload.get("pose"),
        }
        self.capture_once(reason="mqtt_cmd", options=opts, extra_meta=extra_meta)

    # รองรับ burst + quality + presence/scale
    def capture_once(
        self,
        session_id: str | None = None,
        reason: str = "manual",
        options: dict | None = None,
        extra_meta: dict | None = None,
    ) -> dict:
        session_id = session_id or str(uuid4())
        now_iso = utc_now_iso()
        options = options or {}
        extra_meta = extra_meta or {}

        settle_ms = int(options.get("settle_ms") or 0)
        burst_count = max(1, int(options.get("burst_count") or 1))
        burst_interval_ms = int(options.get("burst_interval_ms") or 100)
        # deadline_ms = int(options.get("deadline_ms") or 0)  # (ยังไม่ได้ enforce ในโค้ดนี้)

        only_if_present = bool(options.get("only_if_present", False))
        wait_weight_opt = options.get("wait_weight")
        if wait_weight_opt is None:
            cfg_default_wait = getattr(self.cfg, "WAIT_WEIGHT_DEFAULT", None) if self.cfg else None
            if cfg_default_wait is not None:
                wait_weight = bool(cfg_default_wait) and bool(self.scale)
            else:
                wait_weight = bool(self.scale)
        else:
            wait_weight = bool(wait_weight_opt)
        if wait_weight and not self.scale:
            log.info("wait_weight requested but scale is not configured; proceeding without weight capture")
            wait_weight = False

        # cooldown กันรัว
        now = time.time()
        cooldown = float(getattr(self.cfg, "COOLDOWN_SEC", 2) if self.cfg else 2)
        if now < self._cooldown_until:
            log.info("Cooldown active until %.2f, skip capture", self._cooldown_until)
            return {"local_path": "", "session_id": session_id, "sha256": ""}

        # 1) presence
        if not self._wait_presence_if_needed(only_if_present):
            log.info("No presence within timeout, skip capture")
            return {"local_path": "", "session_id": session_id, "sha256": ""}

        # 2) weight stable
        weight_g = None
        if wait_weight:
            weight_g = self._wait_weight_if_needed(True)
            if weight_g is None:
                log.info("Weight not stable within timeout, skip capture")
                self._reset_weight_session()
                return {"local_path": "", "session_id": session_id, "sha256": ""}

        # 3) ตรวจน้ำหนักซ้ำเพื่อไม่ถ่ายภาพซ้ำเมื่อยังเป็น session เดิม
        now = time.time()
        if weight_g is not None and not self._should_capture_weight_session(weight_g, now):
            delta = abs(weight_g - (self._last_weight_g or 0.0))
            dt = now - self._last_weight_ts
            log.info(
                "Weight %.2f g unchanged (Δ=%.2f g, dt=%.1fs < cooldown %.1fs); skip capture",
                weight_g,
                delta,
                dt,
                self._weight_session_cooldown,
            )
            return {"local_path": "", "session_id": session_id, "sha256": ""}

        if settle_ms > 0:
            time.sleep(settle_ms / 1000.0)

        best = None
        attempts = 0
        total_to_try = burst_count + max(0, int(os.getenv("MAX_RETRIES", "0")))
        for i in range(total_to_try):
            capture_output = self.camera.capture_still(out_dir=self.spool_dir)
            cam_extras: dict = {}
            if isinstance(capture_output, CameraCaptureResult):
                out_path = capture_output.path
                cam_extras = capture_output.extras or {}
            elif isinstance(capture_output, tuple) and len(capture_output) == 2:
                out_path, cam_extras = capture_output
                cam_extras = cam_extras or {}
            else:
                out_path = capture_output

            out_path = Path(out_path)
            sha = sha256_of_file(out_path)
            try:
                blurv = self._blur_variance(out_path)
            except Exception:
                blurv = 0.0

            frame_meta = cam_extras.get("frame") or {}
            depth_meta = cam_extras.get("depth")
            depth_meta_for_event = None
            depth_clusters = None
            if depth_meta:
                if self._cluster_cfg and depth_meta.get("path"):
                    try:
                        depth_image = cv2.imread(depth_meta["path"], cv2.IMREAD_UNCHANGED)
                        if depth_image is not None and depth_image.size:
                            depth_clusters = compute_depth_clusters(
                                depth_image,
                                depth_meta.get("intrinsics"),
                                self._cluster_cfg,
                            )
                            if depth_clusters:
                                depth_meta["clusters"] = depth_clusters
                    except Exception:
                        log.exception("Depth cluster analysis failed")
                depth_meta_for_event = {k: v for k, v in depth_meta.items() if k != "path" and v is not None}

            # publish image event (+ weight_g ติดไปด้วย)
            meta_evt = {
                "schema": "image_captured@2",
                "ts": now_iso,
                "session_id": session_id,
                **self.identity,
                "filename": out_path.name,
                "event_id": extra_meta.get("event_id"),
                "robot_id": extra_meta.get("robot_id"),
                "job_id": extra_meta.get("job_id"),
                "waypoint_id": extra_meta.get("waypoint_id"),
                "quality": {"blur_var": blurv, "attempt": i + 1},
                "weight_g": weight_g,
                "reason": reason,
            }
            if frame_meta:
                meta_evt["frame"] = frame_meta
            if depth_meta_for_event:
                meta_evt["depth"] = depth_meta_for_event
                dims_evt = depth_meta_for_event.get("dimensions_mm")
                if dims_evt:
                    meta_evt["depth_dimensions_mm"] = dims_evt
            self.mqtt.publish_json(self.topic_evt_captured, meta_evt)

            # sidecar for uploader
            sidecar = out_path.with_suffix(out_path.suffix + ".json")
            depth_meta_for_sidecar = None
            if depth_meta:
                depth_meta_for_sidecar = {k: v for k, v in depth_meta.items() if v is not None}

            payload = {
                "sha256": sha,
                "ts": now_iso,
                "session_id": session_id,
                **self.identity,
                "local_path": str(out_path),
                **{k: v for k, v in extra_meta.items() if v is not None},
                "quality_blur_var": blurv,
                "attempt": i + 1,
                "weight_g": weight_g,
                "reason": reason,
            }
            if frame_meta:
                payload["frame"] = frame_meta
            if depth_meta_for_sidecar:
                payload["depth"] = depth_meta_for_sidecar
                dims_sidecar = depth_meta_for_sidecar.get("dimensions_mm")
                if isinstance(dims_sidecar, dict):
                    payload["depth_width_mm"] = dims_sidecar.get("width")
                    payload["depth_length_mm"] = dims_sidecar.get("length")
                    payload["depth_height_mm"] = dims_sidecar.get("height")
            sidecar.write_text(json.dumps(payload), encoding="utf-8")

            # pick the best by blur var
            if not best or blurv > best["blur"]:
                best = {"path": out_path, "sha": sha, "blur": blurv, "extras": cam_extras}

            attempts += 1
            if i < total_to_try - 1:
                time.sleep(burst_interval_ms / 1000.0)

        if weight_g is not None and self.cfg:
            topic_weight = getattr(self.cfg, "topic_evt_weight", None)
            if not topic_weight:
                scale_id = getattr(self.cfg, "SCALE_ID", "sc01")
                topic_weight = f"edge/evt/{self.identity['tenant']}/{self.identity['house']}/lab/{self.identity['station']}/scale/{scale_id}/weight"
            self.mqtt.publish_json(
                topic_weight,
                {
                    "schema": "scale_weight@1",
                    "ts": now_iso,
                    **self.identity,
                    "session_id": session_id,
                    "event_id": extra_meta.get("event_id"),
                    "weight_g": weight_g,
                    "reason": reason,
                },
                retain=False,
            )

        weight_info = ""
        if weight_g is not None:
            weight_info = f" weight={weight_g:.2f}g"
        log.info(
            "Captured %d frames; best blur_var=%.2f%s",
            attempts,
            best["blur"] if best else -1.0,
            weight_info,
        )
        self._cooldown_until = time.time() + cooldown
        if weight_g is not None:
            self._mark_weight_session(weight_g, time.time())
        result = {"local_path": str(best["path"]), "session_id": session_id, "sha256": best["sha"]}
        if best and best.get("extras"):
            extras_best = best["extras"]
            if extras_best.get("frame"):
                result["frame"] = extras_best["frame"]
            if extras_best.get("depth"):
                depth_best = {k: v for k, v in extras_best["depth"].items() if v is not None}
                result["depth"] = depth_best
                dims_best = depth_best.get("dimensions_mm")
                if isinstance(dims_best, dict):
                    result["depth_dimensions_mm"] = dims_best
        return result

    # === background uploader ===
    def _uploader_loop(self):
        if not self.upload_enabled:
            log.debug("Uploader loop exited: upload disabled")
            return
        while not self._stop.is_set():
            try:
                files = list(self.spool_dir.glob("*.jpg.json")) + list(self.spool_dir.glob("*.png.json"))
                for sidecar in files:
                    with sidecar.open("r", encoding="utf-8") as f:
                        s = json.load(f)
                    p = Path(s["local_path"])
                    depth_path = None
                    depth_meta = s.get("depth")
                    if isinstance(depth_meta, dict):
                        depth_path = depth_meta.get("path")
                    meta = {
                        "tenant": s["tenant"],
                        "house": s["house"],
                        "station": s["station"],
                        "cam_id": s["cam_id"],
                        "ts": s["ts"],
                        "session_id": s.get("session_id"),
                        "sha256": s["sha256"],
                    }
                    # แนบข้อมูลเสริมถ้ามี
                    for k in (
                        "event_id",
                        "robot_id",
                        "job_id",
                        "waypoint_id",
                        "quality_blur_var",
                        "attempt",
                        "pose",
                        "weight_g",
                        "reason",
                        "frame",
                        "depth",
                        "depth_dimensions_mm",
                        "depth_width_mm",
                        "depth_length_mm",
                        "depth_height_mm",
                        "depth_clusters",
                    ):
                        if k in s:
                            meta[k] = s[k]

                    try:
                        resp = self.ingest.upload(p, meta)
                        log.info("Uploaded → ingestion: %s", resp)
                        try:
                            p.unlink(missing_ok=True)
                            if depth_path:
                                Path(depth_path).unlink(missing_ok=True)
                        finally:
                            sidecar.unlink(missing_ok=True)
                    except Exception as e:
                        log.warning("Upload failed, will retry later: %s", e)
                time.sleep(2.0)
            except Exception:
                log.exception("Uploader loop error")
                time.sleep(3.0)
