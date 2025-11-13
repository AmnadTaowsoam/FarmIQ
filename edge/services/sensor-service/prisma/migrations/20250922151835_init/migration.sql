-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sensors";

-- CreateTable
CREATE TABLE "sensors"."device_readings" (
    "time" TIMESTAMPTZ NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "quality" TEXT NOT NULL,
    "payload" JSONB,

    CONSTRAINT "device_readings_pkey" PRIMARY KEY ("time","tenant_id","robot_id","device_id","metric")
);

-- CreateTable
CREATE TABLE "sensors"."device_health" (
    "time" TIMESTAMPTZ NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "online" BOOLEAN,
    "source" TEXT,
    "rssi" INTEGER,
    "uptime_s" INTEGER,
    "meta" JSONB,

    CONSTRAINT "device_health_pkey" PRIMARY KEY ("time","tenant_id","device_id")
);

-- CreateTable
CREATE TABLE "sensors"."sweep_readings" (
    "time" TIMESTAMPTZ NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "run_id" INTEGER NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "zone_id" TEXT,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "value" DOUBLE PRECISION NOT NULL,
    "quality" TEXT NOT NULL,
    "payload" JSONB,

    CONSTRAINT "sweep_readings_pkey" PRIMARY KEY ("time","robot_id","run_id","sensor_id","metric")
);
