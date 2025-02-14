import { Request, Response } from "express";
import { DocumentOutorgaService } from "../services/documentOutorgaService";

export const getAll = async (req: Request, res: Response) => {
    if(!req.file) res.status(400).send({message: "File doesn't sended!"});

    const buffer = req.file!.buffer;

    const users = DocumentOutorgaService.getAll({documentOutorga_pdf: buffer});

    res.send(users);
}