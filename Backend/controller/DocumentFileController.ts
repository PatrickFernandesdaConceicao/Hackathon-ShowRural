import { Request, Response } from "express";
import { DocumentFileService } from "../services/documentFileService";
import { base64ToUint8Array } from "../utils/transformers";

export const postDocumentFile = async (req: Request, res: Response) => {
    try {
        console.log("Oi!")
        const buffer = base64ToUint8Array(req.body.file);
        console.log(buffer)
        const document = await DocumentFileService.create({document_pdf: buffer});
    
        res.send(document);
    } catch(error) {
        if(error instanceof Error) {
            res.status(400).send({error: error.message});
        } else {
            res.status(500).send("Somenthing wen't wrong!");
        } 
    }
}

export const getByIdDocumentFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const document = await DocumentFileService.findById(id);
        res.send(document);
    } catch(error) {
        if(error instanceof Error) {
            res.status(400).send({error: error.message});
        } else {
            res.status(500).send("Somenthing wen't wrong!");
        } 
    }
}