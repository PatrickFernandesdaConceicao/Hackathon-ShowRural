import { Request, Response } from "express";
import { DocumentFileService } from "../services/documentFileService";

export const postDocument = async (req: Request, res: Response) => {
    if(!req.file) res.status(400).send({message: "File doesn't sended!"});

    const buffer = req.file!.buffer;

    const users = DocumentFileService.create({document_pdf: buffer});

    res.send(users);
}