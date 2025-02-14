import { PrismaDB } from "../prisma/client";
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

    static async findAll(): Promise<Omit<Document, "conditions">[]> {
        const documents = await PrismaDB.prisma.document.findMany({
            omit: {
                conditions: true
            }
        });

        return documents;
    }

    static async findBySpecify(specific_activity: string): Promise<Omit<Document, "conditions">[]> {
        const documents = await PrismaDB.prisma.document.findMany({
            where: {
                specific_activity: {
                    contains: specific_activity
                }
            }
        });

        return documents;
    }
}