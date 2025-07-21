-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('REGULAR', 'PRO', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'REGULAR';
