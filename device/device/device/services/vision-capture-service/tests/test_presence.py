import unittest
from collections import deque

import numpy as np

from app.services.capture_service import MotionPresence


class MotionPresenceTests(unittest.TestCase):
    def setUp(self):
        self.blank = np.zeros((200, 200, 3), dtype=np.uint8)

    def test_linger_allows_detection_after_brief_motion(self):
        detector = MotionPresence(
            min_area=100,
            min_frames=3,
            roi=None,
            linger_ms=400,
        )

        moving = self.blank.copy()
        moving[60:120, 60:140] = 255
        frames = deque([self.blank.copy() for _ in range(6)] + [moving] + [self.blank.copy() for _ in range(10)])

        def get_frame():
            try:
                return frames.popleft()
            except IndexError:
                return self.blank

        result = detector.wait_for_presence(get_frame, timeout_ms=800)
        self.assertTrue(result, "detector should latch on motion and report presence")

    def test_no_presence_when_scene_static(self):
        detector = MotionPresence(min_area=100, min_frames=2, roi=None, linger_ms=0)

        # warm up background subtractor to avoid initial spikes
        for _ in range(6):
            detector.present_now(self.blank)
        detector._present_until = 0.0  # ensure latch is cleared before checking static scene

        frames = deque([self.blank.copy() for _ in range(10)])

        def get_frame():
            try:
                return frames.popleft()
            except IndexError:
                return self.blank

        result = detector.wait_for_presence(get_frame, timeout_ms=300)
        self.assertFalse(result, "static scene should not trigger presence")


if __name__ == "__main__":
    unittest.main()
