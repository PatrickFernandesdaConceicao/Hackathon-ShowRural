import { Router } from "express";
import { documentFileRoutes } from "./documentFileRoutes";

export const routes = Router();

routes.use("/documentFiles", documentFileRoutes);