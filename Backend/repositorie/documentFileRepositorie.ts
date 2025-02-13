import { Document } from "@prisma/client";
import { PrismaDB } from "../prisma/client";
import { DocumentPdF } from "../entities/documentPdf";

export class DocumentFileRepositorie {
    
    static async create(data: DocumentPdF) {
        const newDocument = await PrismaDB.prisma.document.create({
            data
        });

        return newDocument;
    }
}