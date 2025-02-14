import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";

export const postNotification = async (req: Request, res: Response) => {
    try {
        await NotificationService.create(req.body);
        res.send({message: "Notification created successufully!"});
    } catch(error) {
        if(error instanceof Error) {
            res.status(400).send({error: error.message});
        } else {
            res.status(500).send("Somenthing wen't wrong!");
        } 
    }
}