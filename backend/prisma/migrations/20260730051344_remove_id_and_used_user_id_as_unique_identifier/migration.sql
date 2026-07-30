/*
  Warnings:

  - The primary key for the `user_streaks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_streaks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_streaks" DROP CONSTRAINT "user_streaks_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("userId");
