import { PrismaDB } from "../prisma/client";
import { DocumentPdF } from "../entities/documentPdf";
import { DocumentFile } from "@prisma/client";

export class DocumentFileRepositorie {
    
    static async create(data: DocumentPdF) {
        const newDocument = await PrismaDB.prisma.documentFile.create({
            data
        });

        return newDocument;
    }

    static async findById(id: string): Promise<DocumentFile | null> {
        const document = await PrismaDB.prisma.documentFile.findFirst({
            where: {
                id
            }
        })

        return document;
    }
}