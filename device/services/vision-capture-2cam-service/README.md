# vision-capture-2cam-service

บริการนี้ออกแบบสำหรับ **rig กล้อง 2 ตัว** (เช่น HIKVISION DS-2CD2043G2-I) ที่ติดตั้งแบบขนานเหนือถาดชั่งเพื่อคำนวณความลึก/ปริมาตรด้วย stereo vision ตามขั้นตอนที่อธิบายไว้ในเอกสารประกอบการติดตั้ง

## คุณสมบัติ
- รองรับกล้อง IP ผ่าน RTSP พร้อมจับคู่ตาม timestamp
- โหลดพารามิเตอร์คาลิเบรต (intrinsics/extrinsics) จากไฟล์ YAML เพื่อทำ **stereoRectify**
- ใช้ **StereoSGBM** คำนวณ disparity แล้วแปลงเป็นความลึก (มิลลิเมตร)
- ประเมินระนาบถาดด้วย least-squares plane fitting และหาความสูงเหนือถาด
- คำนวณปริมาตร/มิติของวัตถุใน mask แล้วบันทึก metadata + depth map ลง `spool/`

## โครงสร้าง
```
vision-capture-2cam-service/
├─ app/
│  ├─ __init__.py
│  ├─ config.py          # โหลด .env + แปลงตัวแปร
│  ├─ stereo_rig.py      # จัดการ stream กล้องซ้าย/ขวา
│  ├─ stereo_processor.py# rectify + disparity + depth + volume
│  ├─ spooler.py         # เซฟไฟล์ภาพ/depth/metadata
│  └─ main.py            # entrypoint (loop capture → process → spool)
├─ calib/
│  └─ stereo.example.yml # โครง YAML สำหรับ intrinsics/extrinsics
├─ env.example
├─ requirements.txt
└─ README.md
```

## การใช้งานเร็ว
1. คัดลอก `env.example` → `.env` แล้วกรอก:
   - `LEFT_CAMERA_URL` / `RIGHT_CAMERA_URL`
   - `STEREO_CALIB_PATH` ชี้ไปยังไฟล์ YAML ที่ได้จาก `stereoCalibrate`
   - อัปเดต baseline / focal length ให้ตรงสเปก (4 mm → `FOCAL_PX≈1500`)
2. ติดตั้ง dependencies:
   ```bash
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. รันบริการ:
   ```bash
   python -m app.main
   ```
   ผลลัพธ์จะบันทึกอยู่ใน `MEDIA_DIR` และ `SPOOL_DIR` (ตั้งใน `.env`)

### RTSP ตัวอย่าง (HIKVISION DS-2CD2043G2-I)
```
rtsp://admin:<password>@192.168.1.30:554/Streaming/Channels/101?transportmode=unicast
rtsp://admin:<password>@192.168.1.31:554/Streaming/Channels/101?transportmode=unicast
```

## โครงสร้าง YAML พารามิเตอร์
ดูตัวอย่างใน `calib/stereo.example.yml`:
```yaml
image_width: 1280
image_height: 720
left:
  camera_matrix: [fx, 0, cx, 0, fy, cy, 0, 0, 1]
  dist_coeffs: [k1, k2, p1, p2, k3]
right:
  camera_matrix: [...]
  dist_coeffs: [...]
stereo:
  rotation: [r11, r12, ..., r33]
  translation: [tx, ty, tz]  # หน่วย: เมตร
```

## พารามิเตอร์ disparity เริ่มต้น
- `NUM_DISPARITIES=256`
- `BLOCK_SIZE=5`
- `UNIQUENESS_RATIO=10`
- `SPECKLE_WINDOW=50`
- `SPECKLE_RANGE=2`

ปรับตาม baseline / Z ระยะกล้องจริงได้ เช่น baseline 15 ซม. หรือ Z=0.9 ม. ให้เพิ่ม `NUM_DISPARITIES` เป็น 320 หากต้องการจับวัตถุใกล้ขึ้น

## Output
ต่อการจับ 1 ครั้งจะได้ไฟล์:
- `spool/<uuid>.left.jpg` / `.right.jpg`
- `spool/<uuid>.depth.png` (16-bit, หน่วยมม.)
- `spool/<uuid>.json` (metadata เช่น disparity params, depth stats, volume, centroid)

ค่า `UPLOAD_ENABLED` เป็น `false` ตามดีฟอลต์ (ยังไม่ผูก ingestion); หากต้องการส่งต่อให้สร้าง client เพิ่มในภายหลัง

## ทิปสำหรับ rig 2 กล้อง
- baseline เริ่ม 12 ซม. (เพิ่มได้ถึง 15 ซม. สำหรับความละเอียดลึกที่ดีขึ้น)
- ซูมเลนส์ 4 มม., Z=1 ม. → FOV ~1.79 × 0.83 ม. ใช้เฉพาะโซนกลาง 60–70% ในการคำนวณ disparity
- ยึดกล้องขนาน, tilt เท่ากัน (~25–30°), โฟกัสแมนวลที่ถาด
- แสงนุ่ม, ใส่แผ่น polarizer เพื่อลดแสงสะท้อนถาดสแตนเลส
- ตั้งค่ากล้อง: ปิด auto ทั้งหมด, shutter ≥ 1/250 s, sub-stream MJPEG 1280×720 @ 30 fps
- เปิด NTP บน PoE switch เพื่อให้ timestamp ต่างกันไม่เกิน 5–10 ms

## การทดสอบ
1. วางวัตถุมาตรฐาน (กล่องโฟม) บนถาด
2. รัน `python -m app.main --run-once` เพื่อเก็บ 1 ชุด
3. เปรียบเทียบ volume / height จากไฟล์ `.json` กับค่าจริง (เป้า ±5–8%)
4. ปรับ baseline, ความสูง, หรือ params StereoSGBM หาก error สูง

---

> บริการนี้ยังไม่เชื่อมต่อ ingestion/mqtt อัตโนมัติ เพื่อโฟกัสที่ pipeline stereo ก่อน สามารถต่อยอดเพิ่ม REST/MQTT ได้ในอนาคต

