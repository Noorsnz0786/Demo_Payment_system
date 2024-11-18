/*
  Warnings:

  - You are about to drop the column `balace` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "balace",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;
