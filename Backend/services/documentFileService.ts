import { User } from "../entities/user";
import { PrismaDB } from "../prisma/client";
import { DocumentFileRepositorie } from "../repositorie/documentFileRepositorie";
import { DocumentPdF } from "../entities/documentPdf";

export class DocumentFileService {
    
    static create(data: DocumentPdF) {
        const newDocument = DocumentFileRepositorie.create(data);
    }
}