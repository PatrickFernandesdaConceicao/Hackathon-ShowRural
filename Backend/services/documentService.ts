import { User } from "../entities/user";
import { PrismaDB } from "../prisma/client";
import pdf from "pdf-parse";
import { DocumentRepositorie } from "../repositorie/documentRepositorie";
import { Document } from "@prisma/client";

export class DocumentService {
    
    static async create(data: Document) {
        try {
            if (!data) throw new Error("Doenst send data documents.");

            console.log(extractedText)
            const newDocument = await DocumentRepositorie.create(data);
            return newDocument
        } catch (error) {
            console.error("Erro ao processar PDF:", error);
            throw new Error("Falha ao processar o arquivo PDF.");
        }
    }

    static async findById(id: string) {
        if(!id) throw new Error("Id doesn't sended!");

        const document = await DocumentRepositorie.findById(id);

        return document;
    }
}
