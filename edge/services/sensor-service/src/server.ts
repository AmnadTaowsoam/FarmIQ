import "reflect-metadata";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import { PORT, SENSOR_RAW_SUB, PUB_NS_CLEAN, PUB_NS_ANOMALY, PUB_NS_DLQ, WRITE_DB } from "./configs/config";
import { mqttClient, pubJSON } from "./utils/mqtt";
import { parseRaw, applyDQ, parseHealth } from "./utils/zod";
import sensorRoutes, { stashLatest } from "./routes/sensor.route";
import { prisma } from "./utils/prisma";
import { saveSweepReading, upsertDeviceHealth, ingestDeviceReadingSQL } from "./services/sensor.service";

const DM_HEALTH_SUB = process.env.DM_HEALTH_SUB ?? "dm/+/+/health";
const DM_LWT_SUB = process.env.DM_LWT_SUB ?? "dm/+/+/lwt";
function parseSensorTopic(topic: string) {
  // sensor.raw/{tenant}/{metric}/{deviceId}
  const parts = topic.split("/");
  if (parts.length < 4) return null;
  return { tenant: parts[1], metric: parts[2], deviceId: parts[3] };
}

function parseDmTopic(topic: string) {
  // dm/{tenant}/{deviceId}/{health|lwt}
  const parts = topic.split("/");
  if (parts.length < 4) return null;
  return { tenant: parts[1], deviceId: parts[2], kind: parts[3] as "health" | "lwt" };
}
async function bootstrap() {
  await prisma.$connect();
  console.log("[bootstrap] Prisma connected (sensor-service)");


  mqttClient.on("message", async (topic, payload) => {
    const preview = payload.toString("utf8", 0, 100);
    console.log("[mqtt] message received:", topic, payload.length > 100 ? `${preview}...` : preview);

    try {
      if (topic.startsWith("sensor.raw/")) {
        console.log("📨 Received MQTT sensor message:", {
          topic,
          payload: payload.toString("utf8", 0, 200) + (payload.length > 200 ? "..." : "")
        });
        
        const tp = parseSensorTopic(topic);
        if (!tp) {
          console.warn("[mqtt] invalid sensor topic:", topic);
          return;
        }
        
        console.log("🔍 Parsed sensor topic:", {
          tenant: tp.tenant,
          metric: tp.metric,
          deviceId: tp.deviceId
        });

        const raw = parseRaw(payload);
        if (!raw) return;

        const ts = raw.ts ?? new Date();
        const dq = applyDQ(tp.metric, raw.value);

        const out = {
          ts,
          tenant: tp.tenant,
          device_id: tp.deviceId,
          metric: tp.metric,
          value: raw.value,
          quality: dq.quality,
          rule_hits: dq.reasons ?? [],
          run_id: raw.run_id ?? undefined,
          sensor_id: raw.sensor_id ?? undefined,
          zone_id: raw.zone_id ?? undefined,
          x: raw.x ?? undefined,
          y: raw.y ?? undefined,
          payload: raw,
        };

        const base =
          dq.quality === "clean"
            ? PUB_NS_CLEAN
            : dq.quality === "anomaly"
            ? PUB_NS_ANOMALY
            : PUB_NS_DLQ;
        const outTopic = `${base}/${tp.tenant}/${tp.metric}/${tp.deviceId}`;
        pubJSON(outTopic, out, 1, false);
        stashLatest({ topic: outTopic, data: out });

        if (WRITE_DB) {
          console.log("💾 Writing to database:", {
            tenant: tp.tenant,
            device: tp.deviceId,
            metric: tp.metric,
            value: out.value,
            quality: out.quality,
            runId: out.run_id,
            sensorId: out.sensor_id
          });
          
          if (out.run_id && out.sensor_id) {
            console.log("📝 Saving SweepReading to database");
            await saveSweepReading({
              time: new Date(ts),
              tenantId: tp.tenant,
              robotId: tp.deviceId,
              runId: out.run_id,
              sensorId: out.sensor_id,
              metric: tp.metric,
              zoneId: out.zone_id,
              x: out.x,
              y: out.y,
              value: out.value,
              quality: out.quality as any,
              payload: out,
            });
          } else {
            console.log("📝 Saving DeviceReading to database");
            await ingestDeviceReadingSQL({
              tenantId: tp.tenant,
              deviceId: tp.deviceId,
              time: new Date(ts),
              sensorId: out.sensor_id ?? null,
              metric: tp.metric,
              value: out.value,
              quality: out.quality as any,
              payload: out,
            });
            console.log("✅ DeviceReading saved successfully");
          }
        }
        return;
      }
      if (topic.startsWith("dm/")) {
        const tp = parseDmTopic(topic);
        if (!tp) {
          console.warn("[mqtt] invalid dm topic:", topic);
          return;
        }

        const health = parseHealth(payload);
        if (!health) return;

        const ts = health.ts ?? new Date();
        const online = tp.kind === "lwt" ? false : health.online ?? true;

        if (WRITE_DB) {
          await upsertDeviceHealth({
            time: new Date(ts),
            tenantId: tp.tenant,
            deviceId: tp.deviceId,
            online,
            source: tp.kind,
            rssi: health.rssi,
            uptimeS: health.uptime_s,
            meta: health.meta ?? {},
          });
        }
        return;
      }
    } catch (error) {
      console.error("[mqtt] onMessage error:", error);
    }
  });

  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });
  await app.register(helmet, { contentSecurityPolicy: false });

  await app.register(async (f) => {
    await sensorRoutes(f);
  }, { prefix: "/sensor" });

  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`[http] sensor-service listening on http://0.0.0.0:${PORT}`);
  console.log(`[http] health check at http://0.0.0.0:${PORT}/sensor/health`);
}

bootstrap().catch((error) => {
  console.error("Bootstrap error:", error);
  process.exit(1);
});

