# Kafka Complete Guide for FarmIQ Cloud

เอกสารนี้อธิบายแนวทางใช้งาน Apache Kafka ใน FarmIQ Cloud ครอบคลุม Event-Driven Architecture, Topics Management, และ Best Practices

## สารบัญ

1. [Event-Driven Architecture Overview](#event-driven-architecture-overview)
2. [Topic Management](#topic-management)
3. [Event Schema Patterns](#event-schema-patterns)
4. [Producer Patterns](#producer-patterns)
5. [Consumer Patterns](#consumer-patterns)
6. [Error Handling and Resilience](#error-handling-and-resilience)
7. [Monitoring and Observability](#monitoring-and-observability)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Event-Driven Architecture Overview

FarmIQ Cloud-Layer ใช้ Event-Driven Architecture โดยมี Apache Kafka เป็น message broker และใช้ TimescaleDB เป็น time-series database สำหรับรองรับไมโครเซอร์วิส

### Architecture Benefits
- **Loose Coupling**: Services แยกส่วนกัน ลดการพึ่งพากันโดยตรง
- **Scalability**: ขยายขนาดได้ตาม service ที่ต้องการ
- **Resilience**: ระบบทนทานต่อความผิดพลาดของบาง service
- **Real-time Processing**: ประมวลผลแบบเรียลไทม์

---

## Topic Management

### ไฟล์และสคริปต์ที่เกี่ยวข้อง

- `cloud/kafka-topics.yml` - ไฟล์ configuration สำหรับนิยาม topics
- `cloud/scripts/create-kafka-topics.sh` - สคริปต์บน Linux/macOS
- `cloud/scripts/create-kafka-topics.ps1` - สคริปต์บน Windows PowerShell
- `docker-compose.infra.yml` - Docker Compose configuration สำหรับ Kafka

### ขั้นตอนการตั้งค่า

#### 1. เริ่มระบบโครงสร้างพื้นฐาน (Infrastructure)

```bash
# เริ่ม Kafka และบริการที่เกี่ยวข้อง รวมถึงการสร้าง topics อัตโนมัติ
docker-compose -f docker-compose.infra.yml up -d

# ตรวจสอบสถานะคอนเทนเนอร์
docker-compose -f docker-compose.infra.yml ps
```

#### 2. สร้าง/จัดการ Topics แบบ Manual

**Linux/macOS:**
```bash
# สร้าง topics ที่กำหนดไว้
./cloud/scripts/create-kafka-topics.sh

# แสดงรายการ topics
./cloud/scripts/create-kafka-topics.sh list

# ดูรายละเอียด topic
./cloud/scripts/create-kafka-topics.sh describe sensors.device.readings.v1

# ลบ topic (ระวังข้อมูลหาย!)
./cloud/scripts/create-kafka-topics.sh delete test-topic
```

**Windows PowerShell:**
```powershell
# สร้าง topics ที่กำหนดไว้
.\cloud\scripts\create-kafka-topics.ps1

# แสดงรายการ topics
.\cloud\scripts\create-kafka-topics.ps1 -Command list

# ดูรายละเอียด topic
.\cloud\scripts\create-kafka-topics.ps1 -Command describe -TopicName sensors.device.readings.v1

# ลบ topic (ระวังข้อมูลหาย!)
.\cloud\scripts\create-kafka-topics.ps1 -Command delete -TopicName test-topic
```

### รายการ Topics

#### Master Service Topics
- `master.customer.snapshot.v1` - ข้อมูลลูกค้า
- `master.farm.snapshot.v1` - ข้อมูลฟาร์ม
- `master.house.snapshot.v1` - ข้อมูลโรงเรือน
- `master.device.snapshot.v1` - ข้อมูลอุปกรณ์
- `master.flock.snapshot.v1` - ข้อมูลฝูงสัตว์
- `master.animal-type.snapshot.v1` - ประเภทสัตว์
- `master.breed.snapshot.v1` - สายพันธุ์

#### Sensor Data Topics
- `sensors.device.readings.v1` - ข้อมูลการอ่านจากอุปกรณ์แบบเรียลไทม์
- `sensors.device.health.v1` - สถานะสุขภาพอุปกรณ์
- `sensors.lab.readings.v1` - ข้อมูลอ่านจากห้องปฏิบัติการ
- `sensors.sweep.readings.v1` - ข้อมูลสแกน/กวาดอ่าน

#### Farm Operational Topics
- `farms.operational.event.v1` - เหตุการณ์การปฏิบัติงานในฟาร์ม
- `farms.farm.snapshot.v1` - Snapshot ข้อมูลฟาร์ม
- `farms.house.snapshot.v1` - Snapshot ข้อมูลโรงเรือน
- `farms.flock.snapshot.v1` - Snapshot ข้อมูลฝูงสัตว์

#### Feed Management Topics
- `feed.batch.created.v1` - การสร้าง batch อาหาร
- `feed.quality.result.v1` - ผลการตรวจคุณภาพอาหาร

#### Economics Topics
- `economics.cost.txn.v1` - ข้อมูลธุรกรรมต้นทุน

#### External Data Topics
- `external.weather.observation.v1` - ข้อมูลสภาพอากาศภายนอก

#### Analytics Topics
- `analytics.features` - คุณลักษณะ (features) สำหรับงานวิเคราะห์
- `analytics.features.materialized.v1` - Materialized features
- `analytics.prediction.v1` - ผลการพยากรณ์ของ ML
- `analytics.anomaly.v1` - การตรวจจับความผิดปกติ
- `analytics.invalid-readings` - Dead letter queue คิวเก็บข้อความที่ไม่ผ่านเงื่อนไข (DLQ)

#### Device Management Topics
- `devices.device.snapshot.v1` - Snapshot ข้อมูลอุปกรณ์

#### Formula Management Topics
- `formula.recipe.snapshot.v1` - Snapshot สูตรผสม

### การกำหนดค่า Topics

#### Retention Policy
- **Compact Topics**: เก็บเฉพาะสถานะล่าสุด (master data)
- **Delete Topics**: เก็บตามระยะเวลา แล้วลบตามกำหนด (sensor data)

#### Retention Time
- **Master Data**: 7 วัน
- **Sensor Data**: 30–90 วัน
- **Analytics Data**: 30–90 วัน
- **Economic Data**: 1 ปี

#### Partitions
- **High Volume**: 6 partitions (sensor readings, analytics features)
- **Medium Volume**: 3 partitions (งานปานกลาง)
- **Low Volume**: 1 partition (งานน้อย/เมตาดาต้า)

### ตัวอย่างการตั้งค่า Topics

#### 1. ไฟล์ Configuration
```yaml
# ตัวอย่างใน cloud/kafka-topics.yml
topics:
  sensors:
    device_readings:
      - name: "sensors.device.readings.v1"
        partitions: 8  # จำนวน partitions
        replication_factor: 1
        config:
          retention.ms: "5184000000"  # ระยะเวลาเก็บข้อมูล 60 วัน
```

#### 2. Restart Kafka
```bash
# หยุด Kafka
docker-compose -f docker-compose.infra.yml stop kafka

# เริ่มใหม่
docker-compose -f docker-compose.infra.yml up -d kafka

# รันตัวสร้าง topics ให้แน่ใจว่าสร้างครบ
docker-compose -f docker-compose.infra.yml up kafka-init-topics
```

---

## Event Schema Patterns

### Topic Naming Convention

#### Pattern: `{domain}.{entity}.{action}.v{version}`

```
sensors.device.readings.v1          # Sensor readings from devices
sensors.device.health.v1            # Device health status
master.farm.snapshot.v1             # Farm master data (compact)
master.operational.event.v1         # Farm operational events
analytics.prediction.v1             # ML predictions
master.economic.txn.v1              # Cost transactions
```

### 1. Sensor Data Events

#### Device Readings Event
```json
{
  "eventId": "evt_1234567890",
  "eventType": "sensor.reading.created",
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": {
    "service": "sensor-streamer-service",
    "version": "1.0.0"
  },
  "data": {
    "deviceId": "dev_001",
    "farmId": "farm_001",
    "houseId": "house_001",
    "sensorType": "temperature",
    "value": 25.5,
    "unit": "celsius",
    "location": {
      "x": 10.5,
      "y": 20.3,
      "z": 1.2
    },
    "metadata": {
      "batteryLevel": 85,
      "signalStrength": -45,
      "calibrationDate": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Device Health Event
```json
{
  "eventId": "evt_1234567891",
  "eventType": "device.health.updated",
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": {
    "service": "devices-service",
    "version": "1.0.0"
  },
  "data": {
    "deviceId": "dev_001",
    "status": "online",
    "lastSeen": "2024-01-15T10:29:45Z",
    "batteryLevel": 85,
    "signalStrength": -45,
    "temperature": 35.2,
    "errors": [],
    "warnings": ["low_battery"]
  }
}
```

### 2. Master Data Events (Compact Topics)

#### Farm Snapshot Event
```json
{
  "eventId": "evt_1234567892",
  "eventType": "farm.snapshot.updated",
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": {
    "service": "farms-master-service",
    "version": "1.0.0"
  },
  "data": {
    "farmId": "farm_001",
    "name": "Green Valley Farm",
    "ownerId": "user_001",
    "location": {
      "address": "123 Farm Road",
      "city": "Bangkok",
      "province": "Bangkok",
      "country": "Thailand",
      "coordinates": {
        "lat": 13.7563,
        "lng": 100.5018
      }
    },
    "settings": {
      "timezone": "Asia/Bangkok",
      "currency": "THB",
      "units": "metric"
    },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Operational Events

#### Farm Operational Event
```json
{
  "eventId": "evt_1234567893",
  "eventType": "farm.operational.event.created",
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": {
    "service": "farms-operational-service",
    "version": "1.0.0"
  },
  "data": {
    "eventId": "op_evt_001",
    "farmId": "farm_001",
    "houseId": "house_001",
    "flockId": "flock_001",
    "eventType": "feeding",
    "description": "Morning feeding completed",
    "details": {
      "feedType": "starter_feed",
      "amount": 100.5,
      "unit": "kg",
      "duration": 30,
      "durationUnit": "minutes"
    },
    "performedBy": "user_001",
    "performedAt": "2024-01-15T08:00:00Z",
    "metadata": {
      "weather": "sunny",
      "temperature": 28.5,
      "humidity": 65
    }
  }
}
```

### 4. Analytics Events

#### ML Prediction Event
```json
{
  "eventId": "evt_1234567894",
  "eventType": "analytics.prediction.created",
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": {
    "service": "analytics-worker",
    "version": "1.0.0"
  },
  "data": {
    "predictionId": "pred_001",
    "modelId": "weight_prediction_v1",
    "modelVersion": "1.0.0",
    "farmId": "farm_001",
    "flockId": "flock_001",
    "predictionType": "weight_gain",
    "predictedValue": 2.5,
    "unit": "kg",
    "confidence": 0.85,
    "predictionDate": "2024-01-20T00:00:00Z",
    "features": {
      "age_days": 45,
      "feed_intake_avg": 120.5,
      "temperature_avg": 28.2,
      "humidity_avg": 65.0
    },
    "metadata": {
      "trainingDataSize": 10000,
      "lastModelUpdate": "2024-01-10T00:00:00Z"
    }
  }
}
```

---

## Producer Patterns

### 1. TypeScript Producer (Node.js Services)

```typescript
// utils/kafkaProducer.ts
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

export class KafkaProducer {
  private producer: Producer;
  private isConnected = false;

  constructor(private kafka: Kafka) {
    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected');
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka producer disconnected');
    }
  }

  async publishEvent<T>(
    topic: string,
    eventType: string,
    data: T,
    key?: string
  ): Promise<void> {
    await this.connect();

    const event = {
      eventId: this.generateEventId(),
      eventType,
      version: '1.0',
      timestamp: new Date().toISOString(),
      source: {
        service: process.env.SERVICE_NAME || 'unknown-service',
        version: process.env.SERVICE_VERSION || '1.0.0',
      },
      data,
    };

    const record: ProducerRecord = {
      topic,
      messages: [{
        key: key || event.eventId,
        value: JSON.stringify(event),
        timestamp: Date.now().toString(),
        headers: {
          eventType,
          version: '1.0',
        },
      }],
    };

    try {
      const result = await this.producer.send(record);
      console.log(`📤 Event published to ${topic}:`, {
        eventId: event.eventId,
        partition: result[0].partition,
        offset: result[0].offset,
      });
    } catch (error) {
      console.error('❌ Failed to publish event:', error);
      throw error;
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Usage example
const kafka = new Kafka({
  clientId: 'sensor-streamer-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = new KafkaProducer(kafka);

// Publish sensor reading
await producer.publishEvent(
  'sensors.device.readings.v1',
  'sensor.reading.created',
  {
    deviceId: 'dev_001',
    farmId: 'farm_001',
    sensorType: 'temperature',
    value: 25.5,
    unit: 'celsius',
  },
  'dev_001' // Use device ID as key for partitioning
);
```

### 2. Python Producer (Python Services)

```python
# utils/kafka_producer.py
from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
import uuid
from datetime import datetime
from typing import Any, Dict, Optional

class KafkaEventProducer:
    def __init__(self, bootstrap_servers: str):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None,
            acks='all',
            retries=3,
            retry_backoff_ms=100,
            enable_idempotence=True,
            max_in_flight_requests_per_connection=1,
        )
    
    def publish_event(
        self,
        topic: str,
        event_type: str,
        data: Dict[str, Any],
        key: Optional[str] = None
    ) -> None:
        event = {
            "eventId": self._generate_event_id(),
            "eventType": event_type,
            "version": "1.0",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source": {
                "service": "analytics-worker",
                "version": "1.0.0"
            },
            "data": data
        }
        
        try:
            future = self.producer.send(
                topic,
                value=event,
                key=key or event["eventId"]
            )
            result = future.get(timeout=10)
            print(f"Event published to {topic}: {event['eventId']}")
        except KafkaError as e:
            print(f"Failed to publish event: {e}")
            raise
    
    def _generate_event_id(self) -> str:
        return f"evt_{int(datetime.utcnow().timestamp() * 1000)}_{uuid.uuid4().hex[:8]}"
    
    def close(self):
        self.producer.close()

# Usage example
producer = KafkaEventProducer("localhost:9092")

producer.publish_event(
    topic="analytics.prediction.v1",
    event_type="analytics.prediction.created",
    data={
        "predictionId": "pred_001",
        "modelId": "weight_prediction_v1",
        "predictedValue": 2.5,
        "confidence": 0.85
    },
    key="pred_001"
)
```

---

## Consumer Patterns

### 1. TypeScript Consumer (Node.js Services)

```typescript
// utils/kafkaConsumer.ts
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

export interface EventHandler<T = any> {
  (event: T): Promise<void>;
}

export class KafkaConsumer {
  private consumer: Consumer;
  private handlers = new Map<string, EventHandler[]>();

  constructor(
    private kafka: Kafka,
    private groupId: string
  ) {
    this.consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxBytesPerPartition: 1048576, // 1MB
      maxWaitTimeInMs: 5000,
    });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
    console.log(`โ… Kafka consumer connected (group: ${this.groupId})`);
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
    console.log('โ… Kafka consumer disconnected');
  }

  async subscribe(topic: string): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    console.log(`Subscribed to topic: ${topic}`);
  }

  async run(): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        try {
          const event = JSON.parse(message.value?.toString() || '{}');
          const eventType = event.eventType;
          
          console.log(`Received event: ${eventType} from ${topic}`);
          
          const handlers = this.handlers.get(eventType) || [];
          await Promise.all(
            handlers.map(handler => this.handleEvent(handler, event))
          );
        } catch (error) {
          console.error('Error processing message:', error);
          // Send to DLQ or handle error appropriately
        }
      },
    });
  }

  onEvent<T>(eventType: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as EventHandler);
  }

  private async handleEvent(handler: EventHandler, event: any): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      console.error(`Error in event handler for ${event.eventType}:`, error);
      // Implement retry logic or dead letter queue
    }
  }
}

// Usage example
const kafka = new Kafka({
  clientId: 'analytics-stream-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const consumer = new KafkaConsumer(kafka, 'analytics-stream-group');

// Register event handlers
consumer.onEvent('sensor.reading.created', async (event) => {
  console.log('Processing sensor reading:', event.data);
  // Process sensor data
});

consumer.onEvent('device.health.updated', async (event) => {
  console.log('Processing device health:', event.data);
  // Update device status
});

// Start consuming
await consumer.connect();
await consumer.subscribe('sensors.device.readings.v1');
await consumer.subscribe('sensors.device.health.v1');
await consumer.run();
```

### 2. Python Consumer (Python Services)

```python
# utils/kafka_consumer.py
from kafka import KafkaConsumer
from kafka.errors import KafkaError
import json
from typing import Dict, Any, Callable
import asyncio
from concurrent.futures import ThreadPoolExecutor

class KafkaEventConsumer:
    def __init__(self, bootstrap_servers: str, group_id: str):
        self.consumer = KafkaConsumer(
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            key_deserializer=lambda m: m.decode('utf-8') if m else None,
            auto_offset_reset='latest',
            enable_auto_commit=True,
            auto_commit_interval_ms=1000,
            max_poll_records=100,
            session_timeout_ms=30000,
            heartbeat_interval_ms=3000,
        )
        self.handlers: Dict[str, list] = {}
        self.executor = ThreadPoolExecutor(max_workers=10)
    
    def subscribe(self, topics: list):
        self.consumer.subscribe(topics)
        print(f"Subscribed to topics: {topics}")
    
    def on_event(self, event_type: str, handler: Callable):
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)
    
    async def start_consuming(self):
        try:
            for message in self.consumer:
                await self._process_message(message)
        except KafkaError as e:
            print(f"Kafka consumer error: {e}")
        finally:
            self.consumer.close()
    
    async def _process_message(self, message):
        try:
            event = message.value
            event_type = event.get('eventType')
            
            print(f"Received event: {event_type} from {message.topic}")
            
            if event_type in self.handlers:
                handlers = self.handlers[event_type]
                tasks = [self._handle_event(handler, event) for handler in handlers]
                await asyncio.gather(*tasks, return_exceptions=True)
                
        except Exception as e:
            print(f"Error processing message: {e}")
    
    async def _handle_event(self, handler: Callable, event: Dict[str, Any]):
        try:
            if asyncio.iscoroutinefunction(handler):
                await handler(event)
            else:
                await asyncio.get_event_loop().run_in_executor(
                    self.executor, handler, event
                )
        except Exception as e:
            print(f"Error in event handler: {e}")

# Usage example
consumer = KafkaEventConsumer("localhost:9092", "analytics-worker-group")

# Register handlers
async def handle_sensor_reading(event):
    print(f"Processing sensor reading: {event['data']}")
    # Process sensor data

async def handle_prediction(event):
    print(f"Processing prediction: {event['data']}")
    # Process prediction

consumer.on_event("sensor.reading.created", handle_sensor_reading)
consumer.on_event("analytics.prediction.created", handle_prediction)

# Start consuming
consumer.subscribe(["sensors.device.readings.v1", "analytics.prediction.v1"])
asyncio.run(consumer.start_consuming())
```

---

## Error Handling and Resilience

### 1. Dead Letter Queue (DLQ) Pattern

```typescript
// utils/dlqHandler.ts
export class DLQHandler {
  constructor(private producer: KafkaProducer) {}

  async sendToDLQ(
    originalTopic: string,
    originalMessage: any,
    error: Error,
    retryCount: number = 0
  ): Promise<void> {
    const dlqTopic = `${originalTopic}.dlq`;
    
    const dlqMessage = {
      ...originalMessage,
      dlqMetadata: {
        originalTopic,
        error: error.message,
        retryCount,
        timestamp: new Date().toISOString(),
      },
    };

    await this.producer.publishEvent(
      dlqTopic,
      'message.dlq.sent',
      dlqMessage,
      originalMessage.eventId
    );

    console.log(`Message sent to DLQ: ${dlqTopic}`);
  }
}
```

### 2. Retry Pattern

```typescript
// utils/retryHandler.ts
export class RetryHandler {
  constructor(
    private maxRetries: number = 3,
    private baseDelay: number = 1000
  ) {}

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.maxRetries) {
          console.error(`❌ ${context} failed after ${this.maxRetries} attempts:`, lastError);
          throw lastError;
        }
        
        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        console.warn(`🙂 ${context} attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message);
        
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## Monitoring and Observability

### 1. Event Metrics

```typescript
// utils/eventMetrics.ts
import { Counter, Histogram, register } from 'prom-client';

const eventCounter = new Counter({
  name: 'kafka_events_total',
  help: 'Total number of Kafka events processed',
  labelNames: ['topic', 'event_type', 'status'],
});

const eventProcessingTime = new Histogram({
  name: 'kafka_event_processing_duration_seconds',
  help: 'Time spent processing Kafka events',
  labelNames: ['topic', 'event_type'],
});

export function recordEventProcessed(
  topic: string,
  eventType: string,
  status: 'success' | 'error',
  processingTime?: number
): void {
  eventCounter.inc({ topic, event_type: eventType, status });
  
  if (processingTime !== undefined) {
    eventProcessingTime.observe(
      { topic, event_type: eventType },
      processingTime
    );
  }
}
```

### 2. Health Check for Kafka

```typescript
// utils/kafkaHealthCheck.ts
export class KafkaHealthCheck {
  constructor(
    private producer: KafkaProducer,
    private consumer: KafkaConsumer
  ) {}

  async checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: {
      producer: boolean;
      consumer: boolean;
      timestamp: string;
    };
  }> {
    const timestamp = new Date().toISOString();
    
    try {
      // Check producer health
      const producerHealthy = await this.checkProducerHealth();
      
      // Check consumer health
      const consumerHealthy = await this.checkConsumerHealth();
      
      const status = producerHealthy && consumerHealthy ? 'healthy' : 'unhealthy';
      
      return {
        status,
        details: {
          producer: producerHealthy,
          consumer: consumerHealthy,
          timestamp,
        },
      };
    } catch (error) {
      console.error('โ Kafka health check failed:', error);
      return {
        status: 'unhealthy',
        details: {
          producer: false,
          consumer: false,
          timestamp,
        },
      };
    }
  }

  private async checkProducerHealth(): Promise<boolean> {
    try {
      // Try to get metadata to check connection
      await this.producer.connect();
      return true;
    } catch {
      return false;
    }
  }

  private async checkConsumerHealth(): Promise<boolean> {
    try {
      // Check if consumer is connected
      return this.consumer.isConnected();
    } catch {
      return false;
    }
  }
}
```

### 📊 การ Monitor Topics

#### 👉 ดูรายการ Topics
```bash
# ผ่าน Docker
docker exec farmiq-kafka kafka-topics.sh --bootstrap-server localhost:9092 --list

# เมนู Script
./cloud/scripts/create-kafka-topics.sh list
```

#### ข้อความที่เพี้ยนตรงนี้ 👉
```bash
# ผ่าน Docker
docker exec farmiq-kafka kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic sensors.device.readings.v1

# เมนู Script หรือ ใช้งาน Script
./cloud/scripts/create-kafka-topics.sh describe sensors.device.readings.v1
```

#### "ดู Consumer Groups" ✅
```bash
docker exec farmiq-kafka kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
```

---

## Best Practices

### 1. Event Design
- **Idempotent**: Events should be idempotent to handle duplicates
- **Immutable**: Event data should not be modified after creation
- **Versioned**: Always include version information for schema evolution
- **Self-contained**: Include all necessary data in the event

### 2. Topic Design
- **Partitioning**: Use meaningful keys for partitioning (e.g., device ID, farm ID)
- **Retention**: Set appropriate retention policies based on data importance
- **Compaction**: Use compact topics for master data that needs latest state

### 3. Consumer Design
- **Idempotent Processing**: Ensure consumers can handle duplicate events
- **Error Handling**: Implement proper error handling and DLQ patterns
- **Batch Processing**: Process events in batches for better performance
- **Monitoring**: Add comprehensive monitoring and alerting

### 4. Producer Design
- **Reliability**: Use idempotent producers for exactly-once semantics
- **Batching**: Use batching for better throughput
- **Compression**: Enable compression for large payloads
- **Schema Registry**: Use schema registry for schema evolution

---

## Troubleshooting

### Topic ไม่ถูกสร้าง
1. ตรวจสอบว่า Kafka เริ่มทำงานแล้ว
2. ตรวจดู logs ของ kafka-init-topics
3. ใช้สคริปต์ manual

### Topic เธกเธตเธเนเธญเธกเธนเธฅเนเธกเนเธเธฃเธ
1. ตรวจสอบ retention policy
2. ตรวจสอบ consumer groups
3. ตรวจสอบการกระจาย partition assignment

### Performance Issues
1. เพิ่มจำนวน partitions สำหรับหัวข้อที่โหลดสูง high-volume topics
2. ปรับ retention time
3. ตรวจสอบ consumer lag

### Consumer Lag Issues
1. เพิ่มจำนวน consumer instances
2. ปรับลดเวลา processing ต่อข้อความ
3. ปรับ batch size

### Producer Issues
1. ตรวจสอบ network connectivity
2. ตรวจสอบการตั้งค่า broker configuration
3. ตรวจสอบข้อจำกัดขนาดข้อความ message size limits

---

## สรุปย่อ

- Topics แสดงรายการ Topics ที่ถูก Monitor อยู่ตอนนี้ start Docker Compose
- เปลี่ยนแปลงจำนวน/การตั้งค่า topics ต้อง restart Kafka
- ใช้ --if-not-exists เพื่อหลีกเลี่ยง error เมื่อมี topic อยู่แล้ว
- ตรวจสอบ logs เพื่อหาสาเหตุเมื่อสร้างไม่สำเร็จ

## แหล่งอ้างอิง

- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FarmIQ Cloud Documentation](./docs/cloud/)

---

*อัปเดตล่าสุด: 2024-01-15*
