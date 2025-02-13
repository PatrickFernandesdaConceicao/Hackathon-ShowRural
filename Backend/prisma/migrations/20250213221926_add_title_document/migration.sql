/*
  Warnings:

  - You are about to drop the column `name` on the `Document` table. All the data in the column will be lost.
  - Added the required column `corporate_reason` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "name",
ADD COLUMN     "corporate_reason" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
