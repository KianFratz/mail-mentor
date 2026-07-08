-- CreateTable
CREATE TABLE "session_feedbacks" (
    "id" UUID NOT NULL,
    "writingSessionId" UUID NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "categoryScores" JSONB NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "suggestedRevision" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_feedbacks_writingSessionId_key" ON "session_feedbacks"("writingSessionId");

-- AddForeignKey
ALTER TABLE "session_feedbacks" ADD CONSTRAINT "session_feedbacks_writingSessionId_fkey" FOREIGN KEY ("writingSessionId") REFERENCES "writing_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
