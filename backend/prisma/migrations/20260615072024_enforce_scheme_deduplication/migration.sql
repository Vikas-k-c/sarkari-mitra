/*
  Warnings:

  - Made the column `externalId` on table `Scheme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sourceSystem` on table `Scheme` required. This step will fail if there are existing NULL values in that column.

*/
-- Backfill existing NULL values
UPDATE "Scheme" SET "externalId" = gen_random_uuid()::text WHERE "externalId" IS NULL;
UPDATE "Scheme" SET "sourceSystem" = 'manual' WHERE "sourceSystem" IS NULL;

-- AlterTable
ALTER TABLE "Scheme" ALTER COLUMN "externalId" SET NOT NULL,
ALTER COLUMN "sourceSystem" SET NOT NULL,
ALTER COLUMN "sourceSystem" SET DEFAULT 'manual';
