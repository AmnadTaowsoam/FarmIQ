// src/routes/sensor.route.ts (Fastify plugin)
import { FastifyInstance } from "fastify";
import { apiKey } from "../middlewares/apiKey";
import { prisma } from "../utils/prisma";

const latestCache: any[] = [];
export function stashLatest(msg: any) {
  latestCache.unshift(msg);
  if (latestCache.length > 50) latestCache.pop();
}

export default async function sensorRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async (_req, _reply) => ({ ok: true }));

  fastify.get(
    "/latest",
    { preHandler: [apiKey] },
    async (_req, _reply) => ({ data: latestCache })
  );

  // API endpoint to receive weight predictions from vision-inference service
  fastify.post(
    "/weight-predictions",
    { preHandler: [apiKey] },
    async (req, reply) => {
      try {
        const weightData = req.body as any;
        
        // Store weight prediction in database using DeviceReading model
        const deviceReading = await prisma.deviceReading.create({
          data: {
            time: new Date(weightData.timestamp),
            tenantId: weightData.tenantId,
            robotId: 'weight-robot', // Robot ID for weight prediction data
            deviceId: weightData.mediaId,
            metric: 'weight_prediction',
            value: weightData.predictedWeight,
            quality: 'clean',
            payload: {
              confidence: weightData.confidence,
              modelVersion: weightData.modelVersion,
              inferenceTime: weightData.inferenceTime,
              bbox: weightData.bbox,
              metadata: weightData.metadata,
              stationId: weightData.stationId,
            },
          },
        });

        return { success: true, id: deviceReading.deviceId };
      } catch (error: any) {
        fastify.log.error("Error storing weight prediction:", error);
        reply.code(500).send({ error: "Failed to store weight prediction" });
        return;
      }
    }
  );
}
