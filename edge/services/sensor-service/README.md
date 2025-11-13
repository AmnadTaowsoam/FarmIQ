# Sensor Service

Edge service สำหรับรับและประมวลผลข้อมูลจาก sensors ต่างๆ ในระบบ FarmIQ

## ฟีเจอร์หลัก

- รับข้อมูล sensor แบบ real-time ผ่าน MQTT
- ประมวลผลและทำความสะอาดข้อมูล (data cleaning)
- ตรวจจับข้อมูลผิดปกติ (anomaly detection)
- บันทึกข้อมูลลง TimescaleDB
- รองรับ device health monitoring

## การติดตั้ง

### Prerequisites

- Node.js 20+
- Yarn
- TimescaleDB
- MQTT Broker (Mosquitto)

### Environment Variables

คัดลอกไฟล์ `.env.example` เป็น `.env` และแก้ไขค่าต่างๆ:

```bash
cp .env.example .env
```

### การรัน

```bash
# ติดตั้ง dependencies
yarn install

# Generate Prisma client
npx prisma generate

# รันในโหมด development
yarn dev

# รันในโหมด production
yarn build
yarn start
```

### Docker

```bash
# Build image
docker build -t farmiq-sensor-service .

# Run container
docker run -d --name sensor-service \
  --env-file .env \
  -p 6300:6300 \
  farmiq-sensor-service
```

## API Endpoints

### Health Check
- `GET /health` - ตรวจสอบสถานะ service

### Sensor Data
- `GET /sensor/readings` - ดึงข้อมูล sensor readings
- `POST /sensor/readings` - สร้าง sensor reading ใหม่

## MQTT Topics

### Subscribe
- `sensor.raw/{tenant}/{metric}/{deviceId}` - รับข้อมูล sensor แบบ raw

### Publish
- `sensor.clean/{tenant}/{metric}/{deviceId}` - ส่งข้อมูลที่ทำความสะอาดแล้ว
- `sensor.anomaly/{tenant}/{metric}/{deviceId}` - ส่งข้อมูลที่ผิดปกติ
- `sensor.dlq/{tenant}/{metric}/{deviceId}` - ส่งข้อมูลที่ประมวลผลไม่ได้

### Device Management
- `dm/{tenant}/{deviceId}/health` - สถานะสุขภาพของ device
- `dm/{tenant}/{deviceId}/lwt` - Last Will Testament ของ device

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 6300 | Port ของ service |
| `DB_HOST` | timescaledb | Host ของ database |
| `DB_NAME` | sensors_db | ชื่อ database |
| `MQTT_BROKER_URL` | mqtt://edge-mqtt:1883 | URL ของ MQTT broker |
| `SENSOR_RAW_SUB` | sensor.raw/+ | Topic pattern สำหรับรับข้อมูล raw |
| `SENSOR_CLEAN_PUB` | sensor.clean | Topic สำหรับส่งข้อมูลที่ clean แล้ว |

## Database Schema

Service ใช้ TimescaleDB กับ schema `sensors`:

- `sensors.sensor_readings` - ข้อมูล sensor readings
- `sensors.sweep_readings` - ข้อมูล readings จาก robot sweeps
- `sensors.device_health` - สถานะสุขภาพของ devices

## Development

### Prisma Commands

```bash
# Generate client
npx prisma generate

# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

### Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test:coverage
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - ตรวจสอบ `DATABASE_URL` ในไฟล์ `.env`
   - ตรวจสอบว่า TimescaleDB ทำงานอยู่

2. **MQTT Connection Error**
   - ตรวจสอบ `MQTT_BROKER_URL` และ credentials
   - ตรวจสอบว่า MQTT broker ทำงานอยู่

3. **Prisma Client Error**
   - รัน `npx prisma generate` ใหม่
   - ตรวจสอบ database schema

### Logs

```bash
# ดู logs ของ container
docker logs sensor-service

# ดู logs แบบ real-time
docker logs -f sensor-service
```

## License

MIT