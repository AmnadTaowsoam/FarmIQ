-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "edge_weight";

-- CreateTable
CREATE TABLE "edge_weight"."weight_readings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "farmId" TEXT,
    "houseId" TEXT,
    "stationId" TEXT,
    "sensorId" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weight_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edge_weight"."lab_readings" (
    "id" TEXT NOT NULL,
    "sampleId" TEXT NOT NULL,
    "farmId" TEXT,
    "tenantId" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "result" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edge_weight"."weight_associations" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "readingId" TEXT NOT NULL,
    "deltaMs" INTEGER NOT NULL,
    "strategy" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weight_associations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weight_readings_tenantId_timestamp_idx" ON "edge_weight"."weight_readings"("tenantId", "timestamp");

-- CreateIndex
CREATE INDEX "weight_readings_sensorId_timestamp_idx" ON "edge_weight"."weight_readings"("sensorId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "lab_readings_sampleId_key" ON "edge_weight"."lab_readings"("sampleId");

-- CreateIndex
CREATE INDEX "lab_readings_sampleId_testType_idx" ON "edge_weight"."lab_readings"("sampleId", "testType");

-- CreateIndex
CREATE INDEX "lab_readings_tenantId_timestamp_idx" ON "edge_weight"."lab_readings"("tenantId", "timestamp");

-- CreateIndex
CREATE INDEX "weight_associations_mediaId_idx" ON "edge_weight"."weight_associations"("mediaId");

-- CreateIndex
CREATE INDEX "weight_associations_readingId_idx" ON "edge_weight"."weight_associations"("readingId");

-- CreateIndex
CREATE UNIQUE INDEX "weight_associations_mediaId_readingId_key" ON "edge_weight"."weight_associations"("mediaId", "readingId");
