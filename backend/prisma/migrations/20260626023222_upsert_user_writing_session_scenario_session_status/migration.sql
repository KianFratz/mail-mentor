/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `current_level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_active_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `xp_total` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('draft', 'submitted', 'graded', 'abandoned');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "current_level",
DROP COLUMN "last_active_at",
DROP COLUMN "updated_at",
DROP COLUMN "xp_total",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentLevel" "SkillLevel" NOT NULL DEFAULT 'beginner',
ADD COLUMN     "lastActiveAt" TIMESTAMPTZ,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xpTotal" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "writing_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'draft',
    "subjectLine" TEXT NOT NULL,
    "textBody" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "scenarioId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" "SkillLevel" NOT NULL DEFAULT 'beginner',
    "aiPersona" TEXT NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "writing_sessions" ADD CONSTRAINT "writing_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_sessions" ADD CONSTRAINT "writing_sessions_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
