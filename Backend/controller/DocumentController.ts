import { Request, Response } from "express";
import { DocumentService } from "../services/documentService";

export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await DocumentService.findAll();
        res.send(documents);
    } catch(error) {
        if(error instanceof Error) {
            res.status(400).send({error: error.message});
        } else {
            res.status(500).send("Somenthing wen't wrong!");
        } 
    }
}