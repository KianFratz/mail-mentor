-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerifyExpiresAt" TEXT,
ADD COLUMN     "emailVerifyTokenHash" TEXT,
ADD COLUMN     "pendingEmail" TEXT;
