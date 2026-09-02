/*
  Warnings:

  - Added the required column `amount` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingInterval` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('month', 'year');

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "billingInterval" "BillingInterval" NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'PHP',
ALTER COLUMN "usageResetAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "referecenId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerPaymentId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "craetedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_referecenId_key" ON "Payment"("referecenId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_subscriptionId_idx" ON "Payment"("subscriptionId");
