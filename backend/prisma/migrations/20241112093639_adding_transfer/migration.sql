/*
  Warnings:

  - You are about to drop the column `recipientName` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "recipientName",
DROP COLUMN "senderName";
