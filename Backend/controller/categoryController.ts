import { Request, Response } from "express";
import { UserService } from "../services/category";

export const getAll = async (req: Request, res: Response) => {
    const category = UserService.getAll();

    res.send(users);
}