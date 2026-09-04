/*
  Warnings:

  - You are about to drop the column `craetedAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `referecenId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referenceId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referenceId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_referecenId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "craetedAt",
DROP COLUMN "referecenId",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "referenceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_referenceId_key" ON "Payment"("referenceId");
