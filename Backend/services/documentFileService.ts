import { User } from "../entities/user";
import { PrismaDB } from "../prisma/client";
import pdf from "pdf-parse";
import { DocumentFileRepositorie } from "../repositorie/documentFileRepositorie";
import { DocumentPdF } from "../entities/documentPdf";

export class DocumentFileService {
    
    static async create(data: DocumentPdF) {
        try {
            if (!data.document_pdf) {
                throw new Error("Arquivo PDF inválido ou não fornecido.");
            }

            // 🔄 Converte Uint8Array para Buffer
            const buffer = Buffer.from(data.document_pdf);

            // 🔥 Extraindo texto do PDF
            const pdfData = await pdf(buffer);
            const extractedText = pdfData.text;


            console.log(extractedText)

        } catch (error) {
            console.error("Erro ao processar PDF:", error);
            throw new Error("Falha ao processar o arquivo PDF.");
        }
    }
}
