import { Router } from "express";
import { documentFileRoutes } from "./documentFileRoutes";
import { notificationsRoutes } from "./notificationsRoutes";

const routes = Router();

routes.use("/documentFiles", documentFileRoutes);
routes.use("/notifications", notificationsRoutes);

export { routes }