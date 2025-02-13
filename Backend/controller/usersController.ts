import { Request, Response } from "express";
import { UserService } from "../services/users";

export const getAll = async (req: Request, res: Response) => {
    const users = UserService.getAll();

    res.send(users);
}