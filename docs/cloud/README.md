# FarmIQ Cloud Layer Documentation

## ภาพรวมระบบ (System Overview)

FarmIQ Cloud Layer ประกอบด้วย microservices ที่ออกแบบตามแนวคิด Event-Driven Architecture ใช้ Apache Kafka เป็น message broker และใช้ TimescaleDB เป็น time-series database รองรับการทำ migration ได้สะดวก มี master-service สำหรับควบคุม ประสานงาน และให้บริการกลางสำหรับการตรวจสุขภาพระบบ (health), การกำหนดค่า (configuration) และการจัดการเวิร์กโฟลว์

### แผนภาพสถาปัตยกรรม

```
┌───────────────────────┐    ┌───────────────────────┐    ┌───────────────────────┐
│       Edge Layer      │    │      Cloud Layer      │    │   Application Layer    │
│                       │    │                       │    │                       │
│ • MQTT Broker         │    │ • Kafka               │    │ • React Apps          │
│ • Edge Services       │    │ • Microservices       │    │ • Dashboards          │
│ • Local Storage       │    │ • TimescaleDB         │    │ • Management UI       │
└───────────────────────┘    └───────────────────────┘    └───────────────────────┘

```

## สารบัญเอกสารหลัก

### 📘 เอกสารภาพรวม
- [System Architecture](./System-Architecture.md) - ภาพรวมสถาปัตยกรรมและองค์ประกอบ
- [Service Overview](./Service-Overview.md) - ภาพรวม microservices ที่ให้บริการ
- [Technology Stack](./Technology-Stack.md) - เทคโนโลยีและเครื่องมือที่ใช้
- [Deployment Guide](./Deployment-Guide.md) - ขั้นตอนและแนวทางสำหรับการ deploy
- [API Documentation](./API-Documentation.md) - เอกสารอธิบาย API ที่เปิดให้ใช้งาน

### 🧰 แนวทางการพัฒนา
- [Developer Onboarding](./Developer-Onboarding.md) - คู่มือเริ่มต้นสำหรับนักพัฒนา
- [Development Patterns](./Development-Patterns.md) - รูปแบบและแนวปฏิบัติการพัฒนา
- [API Integration Patterns](./API-Integration-Patterns.md) - รูปแบบการเชื่อมต่อและใช้งาน API
- [Kafka Event Patterns](./Kafka-Event-Patterns.md) - รูปแบบเหตุการณ์และสัญญา (contracts) บน Kafka
- [Microservice Templates](./Microservice-Templates.md) - แม่แบบเริ่มต้นสำหรับ microservice

### 🧩 บริการ (Services)
- [Authentication Service](./services/Auth-Service.md) - บริการยืนยันตัวตนและอนุญาตการเข้าถึง
- [Customer Service](./services/Customer-Service.md) - บริการจัดการข้อมูลลูกค้า
- [Sensor Streamer Service](./services/Sensor-Streamer-Service.md) - บริการรับ/สตรีมข้อมูลจาก sensor
- [Analytics Platform](./services/Analytics-Platform.md) - แพลตฟอร์มวิเคราะห์ข้อมูล
- [Device Management Service](./services/Device-Management-Service.md) - บริการจัดการอุปกรณ์
- [Farm Management Services](./services/Farm-Management-Services.md) - บริการจัดการข้อมูลฟาร์ม
- [Feed & Formula Services](./services/Feed-Formula-Services.md) - บริการสูตร/อาหารสัตว์
- [Economic Service](./services/Economic-Service.md) - บริการด้านเศรษฐศาสตร์/ต้นทุน
- [External Factor Service](./services/External-Factor-Service.md) - บริการปัจจัยภายนอกที่กระทบ
- [Monitoring Service](./services/Monitoring-Service.md) - บริการมอนิเตอร์และแจ้งเตือน

### 🛠️ การแก้ปัญหาและบำรุงรักษา
- [Troubleshooting Guide](./Troubleshooting-Guide.md) - แนวทางแก้ปัญหาทั่วไป
- [Maintenance Guide](./Maintenance-Guide.md) - แนวทางบำรุงรักษาระบบ
- [Performance Optimization](./Performance-Optimization.md) - ปรับจูนประสิทธิภาพ

## เทคโนโลยีที่ใช้

### Backend Technologies
- **Node.js 18.18.0+** - Runtime ฝั่งเซิร์ฟเวอร์
- **TypeScript 5.4.5+** - Type safety
- **Express.js 4.19.2+** - Web framework (บริการทั่วไป)
- **Fastify 4.24.3+** - High-performance framework (Sensor Streamer)
- **Python 3.11+** - Analytics services
- **FastAPI 0.104.1+** - Modern Python web framework
- **Yarn 1.22+** - Package manager

### Database & ORM
- **PostgreSQL 15+** - ฐานข้อมูลเชิงสัมพันธ์
- **TimescaleDB 2.11+** - Time-series extension
- **Redis 7.0+** - Caching & session storage
- **TypeORM 0.3.20+** - Node.js ORM
- **Prisma 5.7.0+** - Modern database toolkit (Sensor Streamer)
- **SQLAlchemy 2.0.23+** - Python ORM

### Message Queue & Streaming
- **Apache Kafka 3.5+** - Message broker
- **KafkaJS 2.2.4+** - Node.js Kafka client
- **confluent-kafka 2.0.2+** - Python Kafka client

### Authentication & Security
- **JWT 9.0.2+** - Authentication
- **bcrypt 5.1.1+** - Password hashing
- **Zod 3.23.8+** - Schema validation
- **Helmet 7.0.0+** - Security middleware

### Frontend Technologies
- **React 19.1.0+** - UI library
- **TypeScript 5.8.3+** - Type safety
- **Material-UI 7.2.0+** - Component library
- **Vite 7.0.0+** - Build tool
- **Axios 1.10.0+** - HTTP client
- **React Router 7.6.3+** - Routing

### Infrastructure & DevOps
- **Docker 20.10+** - Containerization
- **Docker Compose 2.0+** - Multi-container orchestration
- **Nginx 1.24+** - Reverse proxy
- **Prometheus 2.45+** - Metrics collection
- **Grafana 10.0+** - Visualization

### API Documentation
- **Swagger UI 5.0.1+** - API documentation
- **OpenAPI 3.0** - API specification
- **@asteasolutions/zod-to-openapi 6.2.0+** - Schema to OpenAPI

### Monitoring & Logging
- **Pino 8.16.0+** - Structured logging
- **prom-client 15.0.0+** - Prometheus metrics
- **Python logging** - Python services logging

> **🔗 ดูรายละเอียดสแตกทั้งหมด**: [Technology Stack Documentation](./Technology-Stack.md)

## การเริ่มต้นใช้งานอย่างรวดเร็ว

### Prerequisites
- Node.js 18.18.0+
- Docker & Docker Compose
- PostgreSQL 13+ with TimescaleDB
- Git

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd FarmIQ

# Start infrastructure
docker-compose -f cloud/docker-compose.infra.yml up -d

# Start services
docker-compose -f cloud/docker-compose.yml up -d

# Check health
curl http://localhost:7300/health  # Auth Service
curl http://localhost:7301/health  # Customer Service
curl http://localhost:7302/health  # Sensor Streamer
```

## พอร์ตการให้บริการ
| Service                 | Port | URL                                            | Description                          |
| ----------------------- | ---- | ---------------------------------------------- | ------------------------------------ |
| Auth Service            | 7300 | [http://localhost:7300](http://localhost:7300) | บริการยืนยันตัวตนและอนุญาตการเข้าถึง |
| Customer Service        | 7301 | [http://localhost:7301](http://localhost:7301) | บริการจัดการข้อมูลลูกค้า             |
| Sensor Streamer         | 7302 | [http://localhost:7302](http://localhost:7302) | รับ/สตรีมข้อมูลจาก sensor            |
| Analytics Stream        | 7303 | [http://localhost:7303](http://localhost:7303) | สตรีมข้อมูลสำหรับ analytics          |
| Analytics Worker        | 7304 | [http://localhost:7304](http://localhost:7304) | งานประมวลผล analytics                |
| Analytics API           | 7305 | [http://localhost:7305](http://localhost:7305) | API สำหรับ analytics                 |
| Analytics Alerts        | 7306 | [http://localhost:7306](http://localhost:7306) | ระบบแจ้งเตือน                        |
| Device Service          | 7307 | [http://localhost:7307](http://localhost:7307) | จัดการอุปกรณ์                        |
| Farm Service            | 7308 | [http://localhost:7308](http://localhost:7308) | จัดการข้อมูลฟาร์ม                    |
| Feed Service            | 7309 | [http://localhost:7309](http://localhost:7309) | จัดการข้อมูลอาหารสัตว์               |
| Formula Service         | 7310 | [http://localhost:7310](http://localhost:7310) | จัดการสูตรอาหาร                      |
| Economic Service        | 7311 | [http://localhost:7311](http://localhost:7311) | วิเคราะห์ต้นทุน/เศรษฐศาสตร์          |
| External Factor Service | 7312 | [http://localhost:7312](http://localhost:7312) | ปัจจัยภายนอกที่กระทบระบบ             |
| Monitoring Service      | 7313 | [http://localhost:7313](http://localhost:7313) | มอนิเตอร์และเฝ้าระวังระบบ            |

## แนวทางการทำงานร่วมกัน

### การติดตามบั๊กและปัญหา
- ใช้ GitHub Issues สำหรับรายงาน bug และงาน
- ตรวจสอบสถานะของแต่ละ service ผ่านหน้า health/metrics
- ตรวจ log ของ service ที่เกี่ยวข้องเพื่อหาสาเหตุ

### เวิร์กโฟลว์การพัฒนา (Development Workflow)
- พัฒนาบน branch แยกจาก `main`
- ตั้งชื่อ branch ตามรูปแบบ: `feature/description`
- เขียน test cases ครอบคลุมส่วนที่เปลี่ยนแปลง
- เปิด Pull Request พร้อมคำอธิบายที่ชัดเจน

### Code Style
- เปิดใช้ TypeScript strict mode
- ใช้ Prettier สำหรับจัดรูปแบบโค้ด
- เขียนคอมเมนต์สั้น กระชับ และอธิบายเหตุผล
- ใช้ ESLint สำหรับ linting

## ช่องทางการติดต่อ

ติดต่อทีมพัฒนาได้ที่:
- 📧 Email: dev-team@farmiq.com
- 💬 Slack: #farmiq-dev
- 📚 Wiki: [Internal Wiki](https://wiki.farmiq.com)
- 🐛 Issues: [GitHub Issues](https://github.com/farmiq/issues)

## License

© 2024 FarmIQ. All rights reserved.

---

เวอร์ชันของเอกสารฉบับนี้: 2024-01-15
