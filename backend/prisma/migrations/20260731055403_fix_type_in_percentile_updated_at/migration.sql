/*
  Warnings:

  - You are about to drop the column `percentileUpdateAt` on the `user_streaks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_streaks" DROP COLUMN "percentileUpdateAt",
ADD COLUMN     "percentileUpdatedAt" TIMESTAMP(3);
