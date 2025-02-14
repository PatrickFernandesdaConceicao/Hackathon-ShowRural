/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "DocumentFile" (
    "id" TEXT NOT NULL,
    "document_pdf" BYTEA NOT NULL,

    CONSTRAINT "DocumentFile_pkey" PRIMARY KEY ("id")
);
