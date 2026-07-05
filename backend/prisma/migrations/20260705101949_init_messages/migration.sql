/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_writingSessionId_fkey";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "writingSessionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_writingSessionId_createdAt_idx" ON "messages"("writingSessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_writingSessionId_fkey" FOREIGN KEY ("writingSessionId") REFERENCES "writing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
