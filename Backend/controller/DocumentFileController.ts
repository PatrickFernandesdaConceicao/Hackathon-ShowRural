import { Request, Response } from "express";
import { DocumentFileService } from "../services/documentFileService";

export const postDocumentFile = async (req: Request, res: Response) => {
    try {
        const buffer = req.file!.buffer;
        const document = await DocumentFileService.create({document_pdf: buffer});
    
        res.send(document);
    } catch(error) {
        res.status(500).send({error})
    }
}

export const getByIdDocumentFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const document = await DocumentFileService.findById(id);
        res.send(document);
    } catch(e) {
        res.status(500).send({error: e})
    }
}