/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `current_level` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'professional', 'admin');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authProviders" "AuthProvider"[],
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'student',
DROP COLUMN "current_level",
ADD COLUMN     "current_level" "SkillLevel" NOT NULL DEFAULT 'beginner';

-- DropEnum
DROP TYPE "skill_level";

-- DropEnum
DROP TYPE "user_role";
