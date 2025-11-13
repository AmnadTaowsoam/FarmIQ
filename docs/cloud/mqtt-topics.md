# MQTT Topics โ€” FarmIQ Edge

ออกแบบกำหนดกลยุทธ์การจัดการ MQTT topics, การกำหนด payload, การควบคุม QoS/retain, และการกำหนด ACL สำหรับระบบ IoT → Edge → AI ของ FarmIQ

TL;DR — ใช้ prefix เช่น edge/ และ suffix เช่น tele|evt|cmd|stat|cfg|dlq สำหรับแยกตาม Lab และ Robot/Run ได้ชัดเจน

---

## 0) โครงสร้างการตั้งชื่อ

* **Prefix**: `edge/`
* **ประเภทหัวข้อ**

  * `tele` เทเลเมทรี (ค่าที่ส่งต่อเนื่อง เช่น weight, env, pose)
  * `evt` เหตุการณ์ (เช่น image stored, weigh finalized)
  * `cmd` คำสั่งควบคุม/สั่งงาน
  * `stat` สถานะ/Heartbeat/LWT (Last Will)
  * `cfg` การกำหนดค่า (Retained)
  * `dlq` Dead-letter ข้อความตกค้าง
* **โครงแบบเส้นทาง (path)**

  * `{tenant}` ผู้เช่า/ลูกค้า, `{house}` โรงเรือน/หน่วยงาน
  * `lab/{station}` สถานี Lab (แยกจาก run/robot)
  * `robot/{robot_id}/run/{run_id}` งานภาคสนาม/Commercial
  * `{sensor_id}`, `{metric}`, `{cam_id}` ระบุชื่อเซ็นเซอร์/ตัวชี้วัด/กล้อง
* **QoS**: แนะนำใช้ **QoS 1** สำหรับข้อมูลที่ต้องการยืนยันการส่ง
* **Retain**: ใช้เฉพาะ `cfg` และ LWT ใน `stat` (ไม่ควร retain อื่น ๆ)
* **การกำหนดเวลา**: `ts` ใช้ ISO-8601 (UTC), เช่น `2025-08-14T10:30:00Z`
* **โครงสร้าง payload**: ควรมีฟิลด์ `schema` เพื่อระบุเวอร์ชัน เช่น `"image_stored@1"`
* **การเชื่อมโยง**: `session_id` เพื่อผูกเหตุการณ์/คำสั่ง และเป็น fallback
* **รูปภาพ**: **ไม่ส่ง binary ผ่าน MQTT** — ให้ส่งผ่าน HTTP → image-ingestion-service → MinIO แล้วค่อย publish เหตุการณ์ใน MQTT

---

## 1) Telemetry Topics (publish อุปกรณ์/บริการ)

### 1.1 Lab Sensors

```
edge/tele/{tenant}/{house}/lab/{station}/scale/{scale_id}/weight
edge/tele/{tenant}/{house}/lab/{station}/env/{sensor_id}/{metric}
```

**ตัวอย่าง**

```json
{
  "schema":"scale_weight@1",
  "tenant":"t1","house":"h01","station":"st01","device":"scale01",
  "ts":"2025-08-14T10:30:01Z",
  "value":87.5,
  "unit":"kg",
  "stable":true,
  "session_id":"b3f9-..."
}
```

### 1.2 Robot / Run-based

```
edge/tele/{tenant}/{house}/robot/{robot_id}/run/{run_id}/{sensor_id}/{metric}
edge/tele/{tenant}/{house}/robot/{robot_id}/pose
```

**ตัวอย่าง payload pose**

```json
{"schema":"pose@1","ts":"2025-08-14T10:30:01Z","x":1.23,"y":4.56,"heading":90.0,"speed_mps":0.35}
```

### 1.3 Device Status / LWT (retained)

```
edge/stat/{tenant}/{house}/{device_type}/{device_id}
```

**ตัวอย่าง**

```json
{"schema":"device_status@1","ts":"2025-08-14T10:30:01Z","online":true,"rssi":-58,"uptime_s":12345,"meta":{"fw":"1.2.3"}}
```

> ตั้งค่า LWT ให้ publish `online:false` แบบ retained เพื่อแจ้งออฟไลน์อัตโนมัติ

### 1.4 Device Health Metrics

```
edge/tele/{tenant}/{house}/device/{device_id}/health
```

**ตัวอย่าง**

```json
{
  "schema":"device_health@1",
  "tenant":"t1","house":"h01","device":"scale01",
  "ts":"2025-08-14T10:30:01Z",
  "batteryLevel":85,
  "signalStrength":-45,
  "temperature":25.5,
  "errors":[],
  "warnings":["low_battery"],
  "session_id":"b3f9-..."
}
```

---

## 2) Event Topics (publish โดย services ฝั่ง Edge)

### 2.1 การถ่ายภาพ (metadata จาก Pi — optional)

```
edge/evt/{tenant}/{house}/lab/{station}/camera/{cam_id}/captured
edge/evt/{tenant}/{house}/robot/{robot_id}/camera/{cam_id}/captured
```

```json
{"schema":"image_captured@1","tenant":"t1","house":"h01","station":"st01","device":"cam01","ts":"2025-08-14T10:30:00Z","filename":"cam01_20250814T103000.jpg","session_id":"b3f9-..."}
```

### 2.2 บันทึกภาพลงสตอเรจ (publish จาก image-ingestion-service)

```
edge/evt/{tenant}/{house}/lab/{station}/camera/{cam_id}/stored
edge/evt/{tenant}/{house}/robot/{robot_id}/camera/{cam_id}/stored
```

```json
{
  "schema":"image_stored@1",
  "tenant":"t1","house":"h01","station":"st01","device":"cam01",
  "ts":"2025-08-14T10:30:00Z",
  "media_id":123456,
  "bucket":"edge-media",
  "object_key":"tenant=t1/house=h01/station=st01/cam=cam01/date=2025/08/14/uuid.jpg",
  "sha256":"...",
  "session_id":"b3f9-..."
}
```

### 2.3 การแมปภาพ-น้ำหนักเสร็จสมบูรณ์ (publish จาก weigh-associator-service)

```
edge/evt/{tenant}/{house}/lab/{station}/weigh/finalized
edge/evt/{tenant}/{house}/robot/{robot_id}/run/{run_id}/weigh/finalized
```

```json
{
  "schema":"weigh_finalized@1",
  "tenant":"t1","house":"h01","station":"st01",
  "session_id":"b3f9-...",
  "media_id":123456,
  "weight_kg":87.5,
  "t_weight":"2025-08-14T10:30:01Z",
  "strategy":"session_id",
  "match_window_ms":0
}
```

### 2.4 แจ้งเตือน/เหตุผิดปกติ (publish จาก data-guard-service)

```
edge/evt/{tenant}/{house}/alert/{alert_type}
```

```json
{"schema":"alert@1","ts":"2025-08-14T10:30:05Z","alert_type":"weight_outlier","level":2,"context":{"value":999}}
```

### 2.5 Data Ingestion Status (publish จาก sensor-streamer-service)

```
edge/evt/{tenant}/{house}/data/ingestion/{data_type}
```

```json
{
  "schema":"data_ingestion@1",
  "tenant":"t1","house":"h01",
  "ts":"2025-08-14T10:30:05Z",
  "dataType":"sensor_readings",
  "recordCount":150,
  "status":"success",
  "session_id":"b3f9-...",
  "metadata":{"batch_size":150,"processing_time_ms":45}
}
```

---

## 3) Command Topics (publish จาก orchestrator/associator)

### 3.1 สั่งงานกล้อง (Pi subscribe)
```
edge/cmd/{tenant}/{house}/lab/{station}/camera/{cam_id}/start_capture
edge/cmd/{tenant}/{house}/lab/{station}/camera/{cam_id}/stop_capture
```

```json
{"schema":"cmd_start_capture@1","session_id":"b3f9-...","duration_ms":2500,"fps":15}
```

> แนะนำให้สั่งจาก associator โดยกำหนด **เนเธเธ `session_id`** เพื่อให้ผูกเหตุการณ์ได้

### 3.2 สั่งงานหุ่นยนต์/การนำทาง

```
edge/cmd/{tenant}/{house}/robot/{robot_id}/run/start
edge/cmd/{tenant}/{house}/robot/{robot_id}/run/abort
edge/cmd/{tenant}/{house}/robot/{robot_id}/goto/{zone_id}
```

```json
{"schema":"run_start@1","plan":{"zones":["A1","A2"]},"cadence_sec":60}
```

### 3.3 สั่งงาน Sync Service

```
edge/cmd/{tenant}/{house}/sync/trigger
edge/cmd/{tenant}/{house}/sync/pause
edge/cmd/{tenant}/{house}/sync/resume
```

```json
{
  "schema":"sync_trigger@1",
  "tenant":"t1","house":"h01",
  "ts":"2025-08-14T10:30:00Z",
  "dataTypes":["sensor_readings","sweep_readings","lab_readings"],
  "batchSize":1000,
  "session_id":"b3f9-..."
}
```

---

## 4) Config Topics (Retained)

```
edge/cfg/{tenant}/{house}/lab/{station}/camera/{cam_id}
edge/cfg/{tenant}/{house}/robot/{robot_id}/{component}
```

```json
{"schema":"camera_cfg@1","fps":15,"resolution":"1280x720","exposure":"auto","white_balance":"daylight"}
```

> ใช้ QoS 1 + **retain = true** เพื่อให้ device ที่เพิ่งเชื่อมต่อได้รับค่าล่าสุดทันที

---

## 5) Dead-letter Topics (DLQ)

```
edge/dlq/{service_name}
```

**ตัวอย่าง payload**

```json
{"schema":"ingest_failed@1","reason":"minio_upload_error","context":{"filename":"cam01_...jpg"}}
```

> ให้ consumer MQTT ที่อ่านไม่ผ่าน/parse ไม่ได้/ไม่ตรง schema ส่งเข้า DLQ เพื่อวิเคราะห์ภายหลัง

---

## 6) ภาพรวมบริการ: ช่องทาง Sub/Pub โดยย่อ

| Service                         | Subscribe                                                      | Publish                                                                                 |
| ------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **vision-capture-service (Pi)** | `edge/cmd/.../camera/{cam_id}/#`                               | `edge/evt/.../camera/{cam_id}/captured` *(metadata)* → **ส่งต่อด้วย HTTP ไป ingestion** |
| **image-ingestion-service**     | –                                                              | `edge/evt/.../camera/{cam_id}/stored`, `edge/dlq/image-ingestion-service`               |
| **sensor-service**              | `edge/tele/.../scale/+/weight`, `edge/tele/.../env/+/+`        | – *(เขียนค่าเข้า DB)*                                                                   |
| **weigh-associator-service**    | `edge/evt/.../camera/+/stored`, `edge/tele/.../scale/+/weight` | `edge/evt/.../weigh/finalized`, `edge/cmd/.../camera/{cam_id}/start_capture`            |
| **pose-tracker-service**        | `edge/tele/.../robot/*/pose`                                   | –                                                                                       |
| **device-health-service**       | `edge/stat/#`, `edge/tele/.../device/+/health`                 | – *(บันทึก/อัปเดตเข้า DB)*                                                              |
| **data-guard-service**          | `edge/tele/#`                                                  | `edge/evt/.../alert/{type}`                                                             |
| **robot-orchestrator**          | –                                                              | `edge/cmd/.../robot/*/run/*`, `edge/cmd/.../camera/*/start_capture`                     |
| **config-cache-service**        | –                                                              | `edge/cfg/#` *(retained)*                                                               |
| **sync-service**                | `edge/cmd/.../sync/trigger`                                    | `edge/evt/.../data/ingestion/{data_type}`, `edge/dlq/sync-service`                      |
| **sensor-streamer-service**     | –                                                              | `edge/evt/.../data/ingestion/{data_type}`, `edge/dlq/sensor-streamer-service`           |


>หมายเหตุ: ในเชิง Commercial จะออกแบบ path เช่น robot/{robot_id}/run/{run_id} เพื่อให้เรียกใช้งานได้สื่อความชัดเจน
---

## 7) ACL ตัวอย่าง (Mosquitto)

### 7.1 กล้อง `cam01` ประจำสถานี `st01`

```
user cam01
pattern write edge/evt/%/%/lab/st01/camera/cam01/captured
pattern read  edge/cmd/%/%/lab/st01/camera/cam01/#
```

### 7.2 เครื่องชั่ง `scale01`

```
user scale01
pattern write edge/tele/%/%/lab/st01/scale/scale01/weight
```

### 7.3 image-ingestion-service

```
user image-ingestion
pattern write edge/evt/%/%/lab/+/camera/+/stored
pattern write edge/dlq/image-ingestion-service
```

### 7.4 weigh-associator-service

```
user weigh-associator
pattern read  edge/evt/%/%/lab/+/camera/+/stored
pattern read  edge/tele/%/%/lab/+/scale/+/weight
pattern write edge/evt/%/%/lab/+/weigh/finalized
pattern write edge/cmd/%/%/lab/+/camera/+/start_capture
```

> หมายเหตุ `%` แทน `{tenant}/{house}` เพื่อย่นรูปแบบสิทธิ์และครอบคลุมหลายผู้เช่า/โรงเรือน

---

## 8) ข้อแนะนำด้าน Broker/Client

* ตั้งค่า **NTP** บน Pi และ Edge ลดปัญหา clock skew
* พิจารณา `max_payload_size` ของ Broker หากจำเป็น (แต่ไม่แนะนำส่งไฟล์ภาพผ่าน MQTT)
* ใช้ **QoS 1** ควบคู่ idempotency ฝั่ง consumer ป้องกันข้อมูลซ้ำ
* ใช้ **persistent session** และกำหนด **LWT** ให้ client

---

## 9) โครงสร้าง object\_key ใน MinIO (แนะนำ)

```
tenant={tenant}/house={house}/station={station}/cam={cam_id}/date=YYYY/MM/DD/{uuid}.jpg
```

> ตั้งชื่อให้ค้น/จัดกลุ่มง่าย และ map กลับสู่ context ได้ชัดเจน

---

## 10) Testing Quick-Refs

**Subscribe น้ำหนัก (Lab)**

```
mosquitto_sub -t 'edge/tele/t1/h01/lab/+/scale/+/weight' -q 1 -v
```

**Subscribe ภาพ stored**

```
mosquitto_sub -t 'edge/evt/t1/h01/lab/+/camera/+/stored' -q 1 -v
```

**สั่งถ่ายภาพ**

```
mosquitto_pub -t 'edge/cmd/t1/h01/lab/st01/camera/cam01/start_capture' -q 1 -m '{"schema":"cmd_start_capture@1","session_id":"demo-123","duration_ms":1500,"fps":10}'
```

**Subscribe Device Health**

```
mosquitto_sub -t 'edge/tele/t1/h01/device/+/health' -q 1 -v
```

**Subscribe Data Ingestion Status**

```
mosquitto_sub -t 'edge/evt/t1/h01/data/ingestion/+' -q 1 -v
```

**สั่ง Sync Trigger**

```
mosquitto_pub -t 'edge/cmd/t1/h01/sync/trigger' -q 1 -m '{"schema":"sync_trigger@1","tenant":"t1","house":"h01","ts":"2025-08-14T10:30:00Z","dataTypes":["sensor_readings","sweep_readings"],"batchSize":1000,"session_id":"demo-123"}'
```

---

## 11) เวอร์ชันและการเปลี่ยนแปลง

* v1.0 — ระบุแนวทางโดยรวม, กำหนด payload/ACL, แนะนำ QoS/retain
