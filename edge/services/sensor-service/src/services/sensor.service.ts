// src/services/sensor.service.ts
import { prisma } from "../utils/prisma";

export async function saveSweepReading(r: {
  time: Date; tenantId: string; robotId: string; runId: number; sensorId: string;
  metric: string; zoneId?: string; x?: number; y?: number;
  value: number; quality: "raw"|"clean"|"anomaly"|"dlq"|"invalid"|"calibrating"|"stale"; payload?: any;
}) {
  // Use parameterized SQL to avoid model declarations; targets sensors.sweep_readings
  await prisma.$executeRawUnsafe(
    `INSERT INTO sensors.sweep_readings
      (time, tenant_id, robot_id, run_id, sensor_id, metric, zone_id, x, y, value, quality, payload)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (time, robot_id, run_id, sensor_id, metric)
     DO UPDATE SET zone_id=EXCLUDED.zone_id, x=EXCLUDED.x, y=EXCLUDED.y,
                   value=EXCLUDED.value, quality=EXCLUDED.quality, payload=EXCLUDED.payload`,
    r.time, r.tenantId, r.robotId, r.runId, r.sensorId, r.metric,
    r.zoneId ?? null, r.x ?? null, r.y ?? null, r.value, r.quality, r.payload ?? null
  );
}

export async function upsertDeviceHealth(r: {
  time: Date; tenantId: string; deviceId: string;
  online?: boolean; source?: string; rssi?: number; uptimeS?: number; meta?: any;
}) {
  // Enhanced metadata with cloud-compatible fields
  const enhancedMeta = {
    ...(r.meta || {}),
    tenantId: r.tenantId,
    deviceId: r.deviceId,
    source: r.source,
    uptimeS: r.uptimeS,
    generatedAt: new Date().toISOString(),
    // Add cloud-compatible fields
    batteryLevel: r.meta?.batteryLevel || 100,
    signalStrength: r.rssi || -50,
    temperature: r.meta?.temperature || 25,
    errors: Array.isArray(r.meta?.errors) ? r.meta.errors : [],
    warnings: Array.isArray(r.meta?.warnings) ? r.meta.warnings : []
  };

  await prisma.$executeRawUnsafe(
    `INSERT INTO sensors.device_health
      (time, tenant_id, device_id, online, source, rssi, uptime_s, meta)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (time, tenant_id, device_id)
     DO UPDATE SET online=EXCLUDED.online, source=EXCLUDED.source,
                   rssi=EXCLUDED.rssi, uptime_s=EXCLUDED.uptime_s, meta=EXCLUDED.meta`,
    r.time, r.tenantId, r.deviceId, r.online ?? null, r.source ?? null, r.rssi ?? null, r.uptimeS ?? null, enhancedMeta
  );
}

// Raw ingestion helper using Prisma ORM
export async function ingestDeviceReadingSQL(r: {
  tenantId: string; deviceId: string; time: Date;
  sensorId?: string | null; metric: string; value: number;
  quality: "raw"|"clean"|"anomaly"|"dlq"|"invalid"|"calibrating"|"stale";
  payload?: any;
}) {
  // Use Prisma ORM to insert data directly
  await prisma.deviceReading.create({
    data: {
      time: r.time,
      tenantId: r.tenantId,
      robotId: 'mock-robot', // Default robot ID for mock data
      deviceId: r.deviceId,
      metric: r.metric,
      value: r.value,
      quality: r.quality,
      payload: r.payload || {},
    },
  });
}

// Enhanced function to create sensor readings with cloud-compatible format
export async function createSensorReading(r: {
  tenantId: string; deviceId: string; farmId?: string; houseId?: string; stationId?: string;
  time: Date; sensorId?: string | null; metric: string; value: number;
  quality: "raw"|"clean"|"anomaly"|"dlq"|"invalid"|"calibrating"|"stale";
  payload?: any; location?: { x: number; y: number; z: number };
}) {
  // Enhanced payload with cloud-compatible fields
  const enhancedPayload = {
    ...(r.payload || {}),
    tenantId: r.tenantId,
    farmId: r.farmId,
    houseId: r.houseId,
    stationId: r.stationId,
    sensorId: r.sensorId,
    quality: r.quality,
    location: r.location,
    unit: getUnitForSensorType(r.metric),
    generatedAt: new Date().toISOString()
  };

  await prisma.$executeRawUnsafe(
    `SELECT sensors.fn_ingest_device_reading($1,$2,$3,$4,$5,$6,$7,$8)`,
    r.tenantId, r.deviceId, r.time, r.sensorId ?? null, r.metric, r.value, r.quality, enhancedPayload
  );
}

// Helper function to get unit for sensor type
function getUnitForSensorType(sensorType: string): string {
  const unitMap: { [key: string]: string } = {
    temperature: 'degC',
    humidity: '%',
    CO2: 'ppm',
    NH3: 'ppm',
    illuminance: 'lux',
    photoperiod: 'hours',
    VOCs: 'ppb',
    pH: 'pH',
    TDS: 'ppm',
    EC: 'mS/cm',
    water_volume: 'L',
    water_temp: 'degC',
    'feed.intake.kg': 'kg',
    'sensors.weight_scale.current_kg': 'kg',
    'sensors.weight_predict.current_kg': 'kg',
  };
  return unitMap[sensorType] || sensorType;
}




