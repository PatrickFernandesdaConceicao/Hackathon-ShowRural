import { Router } from "express";
import { getAll } from "../controller/usersController";

const userRoutes = Router();

userRoutes.get("/", getAll)

export { userRoutes }