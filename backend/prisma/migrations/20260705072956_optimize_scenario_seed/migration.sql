/*
  Warnings:

  - You are about to drop the column `hrName` on the `scenarios` table. All the data in the column will be lost.
  - You are about to drop the column `hrProfession` on the `scenarios` table. All the data in the column will be lost.
  - Changed the type of `aiPersona` on the `scenarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "scenarios" DROP COLUMN IF EXISTS "hrName";
ALTER TABLE "scenarios" DROP COLUMN IF EXISTS "hrProfession";
ALTER TABLE "scenarios" DROP COLUMN IF EXISTS "aiPersona";
ALTER TABLE "scenarios" ADD COLUMN "aiPersona" JSONB;
UPDATE "scenarios" SET "aiPersona" = '{}'::jsonb WHERE "aiPersona" IS NULL;
ALTER TABLE "scenarios" ALTER COLUMN "aiPersona" SET NOT NULL;
