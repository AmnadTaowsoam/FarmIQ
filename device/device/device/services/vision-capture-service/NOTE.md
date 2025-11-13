# ทดสอบ vision-capture-service แบบ Lab-Scale

## สรุปการแก้ไข
- เพิ่มค่า `PRESENCE_LINGER_MS` และปรับ `MotionPresence` ให้หน่วงสถานะ "พบวัตถุ" ชั่วคราว หลังตรวจเจอ motion เพื่อป้องกันกรณีวัตถุหยุดนิ่งเร็วกว่า `PRESENCE_MIN_FRAMES` แล้วทำให้การถ่ายรูปถูกข้ามไป
- เพิ่มชุดทดสอบ `tests/test_presence.py` เพื่อยืนยันพฤติกรรมทั้งกรณีมีวัตถุสั้น ๆ และกรณีฉากนิ่ง

## ผลการทดสอบ
- 2025-02-14: `PYTHONPATH=app .venv/bin/python -m unittest tests/test_presence.py` ✅

## หมายเหตุ
- ไม่สามารถทดสอบกับอุปกรณ์จริง (RealSense D435 และ Scale-TCS-SW31) ในสภาพแวดล้อมนี้ได้ จึงยืนยันด้วยการจำลองเฟรมภาพ/การตรวจจับแทน
