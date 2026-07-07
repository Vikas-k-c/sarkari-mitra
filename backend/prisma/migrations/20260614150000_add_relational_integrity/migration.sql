ALTER TABLE "profiles"
DROP CONSTRAINT IF EXISTS "profiles_userId_fkey";

ALTER TABLE "profiles"
ADD CONSTRAINT "profiles_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_history"
ADD CONSTRAINT "chat_history_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "chat_history_userId_createdAt_idx"
ON "chat_history"("userId", "createdAt");
