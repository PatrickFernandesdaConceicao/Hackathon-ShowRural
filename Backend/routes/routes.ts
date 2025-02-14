import { Router } from "express";
import { documentFileRoutes } from "./documentFileRoutes";
import { documentOutorgaRoutes } from "./documentOutorgaRoutes";


export const routes = Router();

routes.use("/documentFiles", documentFileRoutes);

routes.use("/documentOutorga", documentOutorgaRoutes);