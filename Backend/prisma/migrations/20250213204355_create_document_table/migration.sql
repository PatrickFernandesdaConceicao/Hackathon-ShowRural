-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "num_protocol" TEXT NOT NULL,
    "num_documento" TEXT NOT NULL,
    "expirate_date" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specific_activity" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_id_fkey" FOREIGN KEY ("id") REFERENCES "DocumentFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
