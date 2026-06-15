-- CreateTable
CREATE TABLE "UserSchemeInteraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSchemeInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSchemeInteraction_userId_schemeId_idx" ON "UserSchemeInteraction"("userId", "schemeId");

-- AddForeignKey
ALTER TABLE "UserSchemeInteraction" ADD CONSTRAINT "UserSchemeInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSchemeInteraction" ADD CONSTRAINT "UserSchemeInteraction_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
