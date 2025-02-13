import { PrismaDB } from "../prisma/client";
import { DocumentPdF } from "../entities/documentPdf";
import { Document } from "@prisma/client";

export class DocumentRepositorie {
    
    static async create(data: Document) {
        const newDocument = await PrismaDB.prisma.document.create({
            data
        });

        return newDocument;
    }

    static async findById(id: string): Promise<Document | null> {
        const document = await PrismaDB.prisma.document.findUnique({
            where: {
                id
            }
        })

        return document;
    }
}