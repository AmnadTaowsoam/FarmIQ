# FarmIQ Cloud Layer - Documentation Summary

## เอกสารสำคัญของระบบ 🔖

### 1. เอกสารหลัก (Core Documentation)
- 📄 README.md - เอกสารหลักของระบบ อธิบาย tech stack ที่ใช้งาน
- 📄 System-Architecture.md - แสดงภาพรวมโครงสร้างระบบ พร้อม tech stack details
- 📄 Service-Overview.md - สรุปภาพรวม microservices แต่ละตัว และ tech stack
- 📄 Technology-Stack.md - เอกสารเทคโนโลยีที่ใช้งานในระบบ รายละเอียด tech stack
- 📄 Deployment-Guide.md - คู่มือการติดตั้งและการ deploy ทั้ง dev และ production

### 2. คู่มือสำหรับนักพัฒนา (Developer Guides)
- 📄 Developer-Onboarding.md - คู่มือสำหรับนักพัฒนาใหม่ พร้อม tech stack requirements
- 📄 API-Integration-Patterns.md - แนวทางการเชื่อมต่อ API (พร้อมตัวอย่างโค้ด)
- 📄 Kafka-Event-Patterns.md - แนวทางการใช้งาน Event บน Kafka (พร้อมตัวอย่างโค้ด)
- 📄 Microservice-Templates.md - เทมเพลตการสร้าง microservice (พร้อมตัวอย่างโค้ด)

### 3. เอกสารบริการ (Service Documentation)
- 📄 Auth-Service.md - เอกสารบริการสำหรับระบบยืนยันตัวตน และการจัดการสิทธิ์ผู้ใช้งาน
- 📄 Master-Service.md - เอกสารบริการหลักสำหรับการจัดการข้อมูลและการประสานงาน
- 📄 Analytics-Platform.md - เอกสารแพลตฟอร์มสำหรับการวิเคราะห์ข้อมูล

### 4. คู่มือการบำรุงรักษา (Maintenance Guides)
- 📄 Troubleshooting-Guide.md - คู่มือแก้ไขปัญหาที่พบบ่อย

### 5. เอกสาร Migration (Migration Documentation)
- 📄 Migration-Summary.md - สรุปการทำ migration และการย้าย services ที่เกี่ยวข้องฃเธฅเธ” services เธเธฃเธเธ–เนเธงเธ

## Tech Stack ที่ใช้ในระบบ FarmIQ Cloud Layer

### Backend Technologies
- **Node.js 18.18.0+** - Runtime
- **TypeScript 5.4.5+** - Type safety
- **Express.js 4.19.2+** - Web framework (บริการ API)
- **Fastify 4.24.3+** - High-performance framework (Sensor Streamer)
- **Python 3.11+** - Analytics services
- **FastAPI 0.104.1+** - Modern Python web framework
- **Yarn 1.22+** - Package manager

### Database & ORM
- **PostgreSQL 15+** - ฐานข้อมูลหลัก
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

## เอกสารเชิงลึกของระบบ

### 1. เอกสารบริการเชิงลึกแต่ละ service
- 📄 Sensor-Streamer-Service.md - บริการจัดการการเก็บข้อมูล sensor
- 📄 Device-Management-Service.md - บริการจัดการอุปกรณ์และการเชื่อมต่อ
- 📄 Farm-Management-Services.md - บริการจัดการฟาร์ม
- 📄 Feed-Formula-Services.md - บริการจัดการสูตรอาหารสัตว์
- 📄 Economic-Service.md - บริการวิเคราะห์เศรษฐกิจและต้นทุน
- 📄 External-Factor-Service.md - บริการปัจจัยภายนอก
- 📄 Monitoring-Service.md - บริการมอนิเตอร์ระบบ

### 2. เอกสารเพิ่มเติม
- 📄 API-Documentation.md - เอกสาร API
- 📄 Maintenance-Guide.md - คู่มือการบำรุงรักษา
- 📄 Performance-Optimization.md - แนวทางการเพิ่มประสิทธิภาพ

## คุณสมบัติของเอกสารที่ดี

### 1. ครอบคลุม (Comprehensive)
- ครอบคลุมทุก aspect ที่เกี่ยวข้อง
- แสดง tech stack อย่างชัดเจน
- มี version numbers กำกับ

### 2. เข้าใจง่าย (Understandable)
- ใช้ภาษาที่อ่านง่าย
- มีตัวอย่างโค้ดและ configuration
- มี diagram / flowchart

### 3. ใช้งานได้จริง (Practical)
- มี step-by-step instructions
- มี troubleshooting guides
- มี real-world examples

### 4. บำรุงรักษาได้ (Maintainable)
- อัปเดตเอกสารสม่ำเสมอ
- แยกตาม service และ function
- มีการจัดหมวดหมู่ที่ชัดเจน

## คู่มือการเริ่มต้นใช้งาน

### สำหรับนักพัฒนาใหม่
1. อ่าน  [README.md](./README.md)
2. เริ่มต้น [Developer-Onboarding.md](./Developer-Onboarding.md)
3. ศึกษา [Technology-Stack.md](./Technology-Stack.md)
4. ดู  [Service-Overview.md](./Service-Overview.md)

### สำหรับ DevOps/System Admin
1. "เริ่มต้น" ✅ [Deployment-Guide.md](./Deployment-Guide.md)
2. 👉 ผู้เขียน [System-Architecture.md](./System-Architecture.md)
3. "อ่าน" ✨ [Troubleshooting-Guide.md](./Troubleshooting-Guide.md)

### สำหรับนักพัฒนา/ทีมงานที่ต้องการทำความเข้าใจระบบปัจจุบัน
1. เช่น [Service-Overview.md](./Service-Overview.md)
2. "อ่าน" ✅ service-specific documentation
3. 👉 “เอกสาร” [API-Integration-Patterns.md](./API-Integration-Patterns.md)

## 👉 คู่มือการบำรุงรักษาเอกสาร

### เน้นที่ Service เป็นหลัก
1. “การบำรุงรักษา (Maintenance)” [Service-Overview.md](./Service-Overview.md)
2. คุณสมบัติของเอกสารที่ดี service-specific documentation
3. "การอ้างอิง" (Reference) [Technology-Stack.md](./Technology-Stack.md) 👉 “ที่เน้นใช้งาน”

### เกณฑ์การค้นหา Tech Stack
1. 👉 "การบำรุงรักษา (Maintenance)" [Technology-Stack.md](./Technology-Stack.md)
2. 👉 "การบำรุงรักษา (Maintenance)" service-specific documentation
3. 👉 "การบำรุงรักษา (Maintenance)" [Deployment-Guide.md](./Deployment-Guide.md)

### เน้นตาม Feature
1. 👉 "คู่มือ" service-specific documentation
2. 👉 "คู่มือ" [API-Documentation.md](./API-Documentation.md)
3. 👉 “การบำรุงรักษา” หรือ “Maintain” / “Maintenance” [Developer-Onboarding.md](./Developer-Onboarding.md) เธ–เนเธฒเธเธณเน€เธเนเธ

---

หมายเหตุ: เอกสารนี้ถูกจัดทำและแก้ไขล่าสุด: 2024-01-15

