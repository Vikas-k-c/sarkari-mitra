/*
  Warnings:

  - A unique constraint covering the columns `[externalId,sourceSystem]` on the table `Scheme` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Scheme" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "sourceSystem" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Scheme_externalId_sourceSystem_key" ON "Scheme"("externalId", "sourceSystem");
