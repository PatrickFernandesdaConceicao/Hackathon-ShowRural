import { Document } from "@prisma/client";
import { User } from "../entities/user";
import { PrismaDB } from "../prisma/client";
import { DocumentFileRepositorie } from "../repositorie/documentFileRepositorie";
import { DocumentPdF } from "../entities/documentPdf";

export class DocumentFileService {
    
    static getAll(data: DocumentPdF) {
        const newDocument = DocumentFileRepositorie.create(data);
    }
}