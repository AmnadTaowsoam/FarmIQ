import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { config } from './config.js';
import { mqttLogger as logger } from './mqttClient.js';

const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAn8B9zsy3a0AAAAASUVORK5CYII=',
  'base64',
);

const ensureDir = async (dir) => {
  await fsPromises.mkdir(dir, { recursive: true });
};

const buildEventTopic = (context) =>
  `edge/evt/${context.tenantId}/${context.houseId}/lab/${context.stationId}/camera/${context.cameraId}/image`;

const writePlaceholderImage = async (context, sessionId) => {
  const dir = path.join(config.capture.mediaDir, context.tenantId, context.houseId);
  await ensureDir(dir);
  const filename = `${sessionId}.png`;
  const fullPath = path.join(dir, filename);
  await fsPromises.writeFile(fullPath, PLACEHOLDER_PNG);
  return { fullPath, filename };
};

const uploadToIngestion = async ({ filePath, context, sessionId, weightGrams, timestamp }) => {
  if (!config.capture.ingestUrl) {
    logger.warn({ msg: 'Skip ingestion upload: CAPTURE_INGEST_URL not set' });
    return;
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('tenant_id', context.tenantId);
  form.append('station_id', context.stationId);
  form.append('sensor_id', context.cameraId);
  form.append('robot_id', context.deviceId);
  form.append('metric', config.capture.imageMetric);
  form.append('timestamp', timestamp.toISOString());
  form.append('session_id', sessionId);
  form.append('weight_g', String(weightGrams));

  const headers = { ...form.getHeaders() };
  if (config.capture.ingestApiKey) {
    headers['x-api-key'] = config.capture.ingestApiKey;
  }

  try {
    await axios.post(config.capture.ingestUrl, form, {
      headers,
      timeout: 10000,
    });
    logger.info({ msg: 'Uploaded mock image to ingestion', sessionId, filePath });
    await fsPromises.unlink(filePath).catch(() => {});
  } catch (error) {
    logger.warn({ msg: 'Failed to upload mock image', sessionId, error: error?.message ?? error });
  }
};

export const emitCapture = async ({ context, sessionId, weightKg, timestamp, publishEvent }) => {
  if (!config.capture.enabled) {
    return;
  }

  const weightGrams = Math.round(weightKg * 1000);
  const { fullPath, filename } = await writePlaceholderImage(context, sessionId);

  const eventPayload = {
    schema: 'image_captured@2',
    ts: timestamp.toISOString(),
    session_id: sessionId,
    tenant: context.tenantId,
    house: context.houseId,
    station: context.stationId,
    cam_id: context.cameraId,
    filename,
    weight_g: weightGrams,
    reason: 'mock-iot-service',
    quality: { synthetic: true },
  };

  const topic = buildEventTopic(context);
  publishEvent(topic, eventPayload);

  await uploadToIngestion({ filePath: fullPath, context, sessionId, weightGrams, timestamp });
};
