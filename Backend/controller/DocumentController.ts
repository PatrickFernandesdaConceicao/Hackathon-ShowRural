import { Request, Response } from "express";
import { DocumentService } from "../services/documentService";

export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const specific_activity = req.query.specific_activity as string;
        console.log(specific_activity)
        let documents;
        if(specific_activity) {
            documents = await DocumentService.findBySpecificActivity(specific_activity);
        } else {
            documents = await DocumentService.findAll();
        }
        res.send(documents);
    } catch(error) {
        if(error instanceof Error) {
            res.status(400).send({error: error.message});
        } else {
            res.status(500).send("Somenthing wen't wrong!");
        } 
    }
}