/*
  Warnings:

  - You are about to drop the column `sellarId` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_sellarId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "sellarId",
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
