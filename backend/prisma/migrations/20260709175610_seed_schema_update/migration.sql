-- CreateEnum
CREATE TYPE "GovernmentLevel" AS ENUM ('CENTRAL', 'STATE', 'JOINT');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'REVIEW_REQUIRED');

-- AlterTable
ALTER TABLE "Scheme" ADD COLUMN     "applicationProcess" TEXT,
ADD COLUMN     "faq" JSONB,
ADD COLUMN     "governmentLevel" "GovernmentLevel" NOT NULL DEFAULT 'CENTRAL',
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "lastVerified" TIMESTAMP(3),
ADD COLUMN     "secondaryCategories" TEXT[],
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'REVIEW_REQUIRED';
