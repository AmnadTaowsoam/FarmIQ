# ทดสอบกล้อง Intel RealSense D435 (Linux Ubuntu 24.04.2 LTS)

เอกสารนี้อธิบายวิธีรันสคริปต์ทดสอบที่อยู่ในโปรเจ็กต์นี้ เพื่อเช็คการเชื่อมต่อและสตรีมภาพ/ระยะลึกจาก D435 ได้จริง

## เตรียมสภาพแวดล้อม

- ติดตั้ง Python 3.12.2
- เสียบกล้องเข้าพอร์ต USB 3.x (สัญลักษณ์ SS) ด้วยสายที่เชื่อถือได้ และรัน `lsusb` ต้องพบบรรทัด `Bus 002 Device 002: ID 8086:0b07 Intel Corp. RealSense D435`
- ติดตั้ง Intel RealSense SDK/Viewer และอัปเดตเฟิร์มแวร์กล้องให้เป็นเวอร์ชันล่าสุด
- (ครั้งแรก) ติดตั้ง udev rules ของ RealSense ตามคู่มือ Intel แล้วรีโหลด `udev` เพื่อให้ผู้ใช้ในกลุ่ม `plugdev` เข้าถึงอุปกรณ์ได้
- ยืนยันว่าผู้ใช้ที่รันสคริปต์อยู่ในกลุ่ม `plugdev` (`groups | grep plugdev`)

## ตั้งค่าไลบรารี (ครั้งแรก)

- เปิดเทอร์มินัลที่โฟลเดอร์โปรเจ็กต์และรัน
  ```shell
  python -m venv .venv
  source .venv/bin/activate
  pip install -U pip
  pip install -r requirements.txt
  ```
- ถ้าติดตั้ง `pyrealsense2` ไม่สำเร็จ ให้ตรวจสอบว่าเป็น Linux Ubuntu 24.04.2 LTS ที่ติดตั้ง RealSense SDK/Driver และเข้าถึงอินเทอร์เน็ตได้ หรือเตรียมไฟล์ wheel สำหรับติดตั้งแบบออฟไลน์

## วิธีรันทดสอบ

ก่อนรันทุกครั้งให้เปิดใช้งาน virtualenv:
```shell
source .venv/bin/activate
```

### 1) ตรวจสอบการมองเห็นอุปกรณ์

- สคริปต์: `scripts/list_realsense.py`
- คำสั่ง:
  ```shell
  python scripts/list_realsense.py
  ```
- สิ่งที่คาดหวัง: รายชื่อกล้อง ชื่อรุ่น Serial Firmware USB Type รายการเซนเซอร์และโปรไฟล์ที่รองรับ หากไม่พบอุปกรณ์ให้ตรวจสอบสาย/พอร์ต หรือเปิด RealSense Viewer เพื่อตรวจสอบสถานะ

### 2) ทดสอบสตรีม Color + Depth

- สคริปต์: `scripts/test_realsense_stream.py`
- คำสั่ง:
  ```shell
  python scripts/test_realsense_stream.py
  ```
- สิ่งที่คาดหวัง: หน้าต่างแสดงภาพสองฝั่ง (ซ้าย Color, ขวา Depth สีเทียม) พร้อมค่า FPS และระยะที่จุดกึ่งกลางเฟรม กด `q` หรือ `Esc` เพื่อออก

## ข้อควรทราบ/แก้ปัญหา

ถ้าภาพกระตุก ให้ปิดซอฟต์แวร์อื่นที่ใช้กล้อง/USB และลองลดความละเอียด หรือทดสอบพอร์ต USB อื่น
ถ้า Depth ไม่ขึ้นหรือระยะผิดปกติ ลองอัปเดตเฟิร์มแวร์ผ่าน RealSense Viewer
หากไม่พบน้ำหนักการติดตั้ง OpenCV/pyrealsense2 ให้ตรวจสอบเวอร์ชัน Python และสิทธิ์การติดตั้ง
