-- AlterTable
ALTER TABLE "Scheme" ADD COLUMN     "checksum" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "lastFetched" TIMESTAMP(3),
ADD COLUMN     "lastUpdated" TIMESTAMP(3),
ADD COLUMN     "ministry" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "state" TEXT;
