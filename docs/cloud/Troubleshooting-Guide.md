# FarmIQ Cloud Layer - Troubleshooting Guide

## ภาพรวม

คู่มือนี้ครอบคลุมการแก้ไขปัญหาที่พบบ่อยใน FarmIQ Cloud Layer และวิธีการวินิจฉัยปัญหา

## การวินิจฉัยปัญหาเบื้องต้น

### 1. ตรวจสอบสถานะระบบ
```bash
# ตรวจสอบสถานะ services ทั้งหมด
docker-compose ps

# ตรวจสอบ logs
docker-compose logs -f

# ตรวจสอบ resource usage
docker stats
```

### 2. ตรวจสอบ Health Checks
```bash
# Auth Service
curl http://localhost:7300/health

# Master Service
curl http://localhost:7301/health

# Sensor Streamer
curl http://localhost:7302/health

# Monitoring Service
curl http://localhost:7303/health

# Analytics API
curl http://localhost:7306/v1/health
```

### 3. ตรวจสอบ Network Connectivity
```bash
# ตรวจสอบ port ที่เปิด
netstat -tulpn | grep -E ":(7300|7301|7302|7303|7304|7305|7306|7307)"

# ตรวจสอบ Docker network
docker network ls
docker network inspect farmiq_cloud_default
```

## ปัญหาที่พบบ่อย

### 1. Service ไม่สามารถ Start ได้

#### อาการ
- Service container หยุดทำงาน
- Error message ใน logs
- Port conflicts

#### การแก้ไข
```bash
# ตรวจสอบ logs
docker-compose logs auth-service

# ตรวจสอบ port conflicts
sudo lsof -i :7300

# ตรวจสอบ resource usage
docker stats auth-service

# Restart service
docker-compose restart auth-service

# Rebuild และ restart
docker-compose up -d --build auth-service
```

#### สาเหตุที่เป็นไปได้
- Port ถูกใช้งานอยู่
- Memory หรือ CPU ไม่เพียงพอ
- Environment variables ไม่ถูกต้อง
- Database connection ล้มเหลว

### 2. Database Connection Issues

#### อาการ
- "Connection refused" error
- "Database not found" error
- Timeout errors

#### การแก้ไข
```bash
# ตรวจสอบ database status
docker exec -it timescaledb pg_isready -U postgres

# ตรวจสอบ database logs
docker-compose logs timescaledb

# ตรวจสอบ network connectivity
docker exec -it auth-service ping timescaledb

# ตรวจสอบ environment variables
docker exec -it auth-service env | grep DATABASE

# Test database connection
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT 1;"
```

#### สาเหตุที่เป็นไปได้
- Database service ไม่ทำงาน
- Network connectivity issues
- Wrong database credentials
- Database schema ไม่ถูกต้อง

### 3. Kafka Connection Issues

#### อาการ
- "Connection refused" error
- "Broker not available" error
- Message publishing/consuming ล้มเหลว

#### การแก้ไข
```bash
# ตรวจสอบ Kafka status
docker exec -it kafka kafka-topics.sh --bootstrap-server localhost:9092 --list

# ตรวจสอบ Kafka logs
docker-compose logs kafka

# ตรวจสอบ consumer groups
docker exec -it kafka kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list

# Test Kafka connectivity
docker exec -it kafka kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test-topic
```

#### สาเหตุที่เป็นไปได้
- Kafka service ไม่ทำงาน
- Wrong broker configuration
- Network connectivity issues
- Topic ไม่ถูกสร้าง

### 4. Redis Connection Issues

#### อาการ
- "Connection refused" error
- Cache operations ล้มเหลว
- Session storage issues

#### การแก้ไข
```bash
# ตรวจสอบ Redis status
docker exec -it redis redis-cli ping

# ตรวจสอบ Redis logs
docker-compose logs redis

# ตรวจสอบ Redis memory usage
docker exec -it redis redis-cli info memory

# Test Redis operations
docker exec -it redis redis-cli set test "hello"
docker exec -it redis redis-cli get test
```

### 5. Authentication Issues

#### อาการ
- "Invalid token" error
- "Token expired" error
- Login ล้มเหลว

#### การแก้ไข
```bash
# ตรวจสอบ JWT secret
docker exec -it auth-service env | grep JWT_SECRET

# ตรวจสอบ token format
curl -H "Authorization: Bearer <token>" http://localhost:7300/api/auth/me

# ตรวจสอบ database
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT * FROM auth.users LIMIT 5;"

# Test login
curl -X POST http://localhost:7300/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

#### สาเหตุที่เป็นไปได้
- JWT secret ไม่ตรงกัน
- Token format ไม่ถูกต้อง
- User ไม่มีอยู่ใน database
- Password hash ไม่ถูกต้อง

### 6. API Response Issues

#### อาการ
- 500 Internal Server Error
- 404 Not Found
- Slow response times

#### การแก้ไข
```bash
# ตรวจสอบ API logs
docker-compose logs customer-service

# ตรวจสอบ database queries
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT * FROM pg_stat_activity;"

# ตรวจสอบ slow queries
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Test API endpoint
curl -v http://localhost:7301/api/customers
```

### 7. Frontend Issues

#### อาการ
- CORS errors
- API calls ล้มเหลว
- UI components ไม่แสดง

#### การแก้ไข
```bash
# ตรวจสอบ CORS configuration
docker exec -it customer-service env | grep CORS

# ตรวจสอบ API connectivity
curl -H "Origin: http://localhost:3000" http://localhost:7301/api/customers

# ตรวจสอบ frontend logs
# เปิด browser developer tools และดู console logs
```

## การตรวจสอบ Performance

### 1. Database Performance
```sql
-- ตรวจสอบ slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- ตรวจสอบ table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname IN ('auth', 'customer', 'sensors', 'analytics')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ตรวจสอบ active connections
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';

-- ตรวจสอบ locks
SELECT * FROM pg_locks WHERE NOT granted;
```

### 2. Service Performance
```bash
# ตรวจสอบ memory usage
docker stats --no-stream

# ตรวจสอบ CPU usage
docker exec auth-service top

# ตรวจสอบ network connections
docker exec auth-service netstat -tulpn

# ตรวจสอบ file descriptors
docker exec auth-service lsof | wc -l
```

### 3. Kafka Performance
```bash
# ตรวจสอบ topic partitions
docker exec -it kafka kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic sensors.device.readings.v1

# ตรวจสอบ consumer lag
docker exec -it kafka kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group analytics-worker-group --describe

# ตรวจสอบ broker metrics
docker exec -it kafka kafka-log-dirs.sh --bootstrap-server localhost:9092 --describe
```

## การแก้ไขปัญหาเฉพาะ Service

### Auth Service
```bash
# ตรวจสอบ JWT configuration
docker exec -it auth-service cat /app/.env | grep JWT

# ตรวจสอบ database connection
docker exec -it auth-service node -e "console.log(process.env.DATABASE_URL)"

# Test authentication flow
curl -X POST http://localhost:7300/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Customer Service
```bash
# ตรวจสอบ tenant isolation
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT tenant_id, count(*) FROM customers.customers GROUP BY tenant_id;"

# ตรวจสอบ subscription data
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT * FROM customers.subscriptions LIMIT 5;"
```

### Sensor Streamer Service
```bash
# ตรวจสอบ TimescaleDB hypertables
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT * FROM timescaledb_information.hypertables;"

# ตรวจสอบ sensor data
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT * FROM sensors.sensor_readings ORDER BY timestamp DESC LIMIT 5;"

# Test sensor data ingestion
curl -X POST http://localhost:7302/api/sensor-readings/batch \
  -H "Content-Type: application/json" \
  -H "x-api-key: admin-key" \
  -d '[{"deviceId":"test-device","sensorType":"temperature","value":25.5,"unit":"celsius"}]'
```

### Analytics Services
```bash
# ตรวจสอบ analytics data
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT * FROM analytics.analytics_agg ORDER BY bucket_start DESC LIMIT 5;"

# ตรวจสอบ anomalies
docker exec -it timescaledb psql -U postgres -d farmiq_cloud -c "SELECT * FROM analytics.analytics_anomaly ORDER BY timestamp DESC LIMIT 5;"

# Test analytics API
curl "http://localhost:7305/v1/agg?tenant_id=test&factory_id=test&machine_id=test&metric=temp&window_s=60&start=2024-01-01T00:00:00Z&end=2024-01-02T00:00:00Z"
```

## การแก้ไขปัญหาเฉพาะ Environment

### Development Environment
```bash
# ตรวจสอบ development setup
yarn --version
node --version
docker --version
docker-compose --version

# ตรวจสอบ environment variables
cat cloud/.env

# ตรวจสอบ port conflicts
sudo lsof -i :7300-7315
```

### Production Environment
```bash
# ตรวจสอบ system resources
free -h
df -h
top

# ตรวจสอบ service status
systemctl status docker
systemctl status nginx

# ตรวจสอบ logs
journalctl -u docker
tail -f /var/log/nginx/error.log
```

## การ Backup และ Recovery

### Database Backup
```bash
# Create full backup
docker exec timescaledb pg_dump -U postgres farmiq_cloud > backup_$(date +%Y%m%d_%H%M%S).sql

# Create schema-only backup
docker exec timescaledb pg_dump -U postgres -s farmiq_cloud > schema_backup_$(date +%Y%m%d_%H%M%S).sql

# Create data-only backup
docker exec timescaledb pg_dump -U postgres -a farmiq_cloud > data_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Application Recovery
```bash
# Restore database
docker exec -i timescaledb psql -U postgres farmiq_cloud < backup_20240115_120000.sql

# Restart services
docker-compose restart

# Verify recovery
curl http://localhost:7300/health
```

## การ Monitor และ Alert

### Prometheus Metrics
```bash
# ตรวจสอบ metrics
curl http://localhost:9090/metrics

# ตรวจสอบ service metrics
curl http://localhost:7300/metrics
curl http://localhost:7301/metrics
```

### Log Analysis
```bash
# ตรวจสอบ error logs
docker-compose logs | grep ERROR

# ตรวจสอบ access logs
docker-compose logs | grep "GET\|POST\|PUT\|DELETE"

# ตรวจสอบ performance logs
docker-compose logs | grep "slow\|timeout"
```

## การติดต่อ Support

### ข้อมูลที่ต้องเตรียม
1. **Error Messages**: ข้อความ error ที่ชัดเจน
2. **Logs**: Log files ที่เกี่ยวข้อง
3. **Environment**: OS, Docker version, Node.js version
4. **Steps to Reproduce**: ขั้นตอนการทำซ้ำปัญหา
5. **Expected vs Actual**: ผลลัพธ์ที่คาดหวัง vs ผลลัพธ์จริง

### การรวบรวมข้อมูล
```bash
# Collect system information
uname -a
docker --version
docker-compose --version
node --version
yarn --version

# Collect service logs
docker-compose logs > farmiq_logs_$(date +%Y%m%d_%H%M%S).txt

# Collect configuration
cp cloud/.env farmiq_config_$(date +%Y%m%d_%H%M%S).env

# Collect database schema
docker exec timescaledb pg_dump -U postgres -s farmiq_cloud > farmiq_schema_$(date +%Y%m%d_%H%M%S).sql
```

---

*เอกสารนี้ได้รับการอัปเดตล่าสุด: 2024-01-15*

