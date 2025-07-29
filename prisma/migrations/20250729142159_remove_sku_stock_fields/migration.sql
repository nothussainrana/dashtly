/*
  Warnings:

  - You are about to drop the column `totalStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductVariant_productId_sku_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "totalStock";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "sku",
DROP COLUMN "stock";
