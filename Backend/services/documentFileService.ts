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
            const newDocument = await DocumentFileRepositorie.create(data);
            return newDocument
        } catch (error) {
            console.error("Erro ao processar PDF:", error);
            throw new Error("Falha ao processar o arquivo PDF.");
        }
    }

    static async findById(id: string) {
        if(!id) throw new Error("Id doesn't sended!");

        const document = await DocumentFileRepositorie.findById(id);

        return { buffer: document?.document_pdf};
    }
}
