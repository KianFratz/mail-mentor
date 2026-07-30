/*
  Warnings:

  - You are about to drop the column `currentSreak` on the `user_streaks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_streaks" DROP COLUMN "currentSreak",
ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0;
