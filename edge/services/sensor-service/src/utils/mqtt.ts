// src/utils/mqtt.ts

import { connect, MqttClient } from "mqtt";
import { MQTT_BROKER_URL, MQTT_USER, MQTT_PASSWORD } from "../configs/config";

console.log(`[mqtt] connecting to ${MQTT_BROKER_URL} as ${MQTT_USER ?? "(no user)"}`);

export const mqttClient: MqttClient = connect(MQTT_BROKER_URL, {
  username: MQTT_USER,
  password: MQTT_PASSWORD,
  reconnectPeriod: 2000,
  keepalive: 30,
  clean: true,
});

mqttClient.on("connect", () => {
  console.log(`[mqtt] connected: ${MQTT_BROKER_URL}`);
  
  // Subscribe to topics
  const topics = [
    process.env.SENSOR_RAW_SUB || 'sensor.raw/+/+/+',
    process.env.DM_HEALTH_SUB || 'dm/+/+/health', 
    process.env.DM_LWT_SUB || 'dm/+/+/lwt'
  ];
  
  mqttClient.subscribe(topics, { qos: 1 }, (err, granted = []) => {
    if (err) {
      console.error("[mqtt] subscribe error:", err);
      return;
    }
    const summary = granted.map((g) => `${g.topic}@${g.qos}`).join(", ");
    console.log("[mqtt] subscribed:", summary);
  });
});
mqttClient.on("reconnect", () => console.log("[mqtt] reconnecting..."));
mqttClient.on("error", (err) => console.error("[mqtt] error:", err));

export function pubJSON(topic: string, payload: any, qos: 0 | 1 | 2 = 1, retain = false) {
  mqttClient.publish(topic, JSON.stringify(payload), { qos, retain }, (err) => {
    if (err) console.error("[mqtt] publish error:", err, topic);
  });
}
