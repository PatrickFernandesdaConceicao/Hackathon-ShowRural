-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "document_pdf" BYTEA NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
