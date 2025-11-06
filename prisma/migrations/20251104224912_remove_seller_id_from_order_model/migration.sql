/*
  Warnings:

  - Added the required column `sellarId` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_sellerId_fkey";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "sellarId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "sellerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sellarId_fkey" FOREIGN KEY ("sellarId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
