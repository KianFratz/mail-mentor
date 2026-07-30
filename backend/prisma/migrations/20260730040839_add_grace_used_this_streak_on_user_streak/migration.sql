/*
  Warnings:

  - You are about to drop the column `practice_streak` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "scenarios" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "user_streaks" ADD COLUMN     "graceUsedThisStreak" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "practice_streak";
