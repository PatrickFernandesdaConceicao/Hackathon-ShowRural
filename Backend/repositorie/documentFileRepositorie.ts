import { PrismaDB } from "../prisma/client";
import { DocumentFile } from "../entities/documentFile";
import { DocumentFile as DocumentFilePrisma } from "@prisma/client";

export class DocumentFileRepositorie {
    
    static async create(data: DocumentFile) {
        const newDocument = await PrismaDB.prisma.documentFile.create({
            data
        });

        return newDocument;
    }

    static async findById(id: string): Promise<DocumentFilePrisma | null> {
        const document = await PrismaDB.prisma.documentFile.findUnique({
            where: {
                id
            }
        })

        return document;
    }
}