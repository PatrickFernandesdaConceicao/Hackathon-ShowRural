import { Router } from "express";
import { documentFileRoutes } from "./documentFileRoutes";
import { notificationsRoutes } from "./notificationsRoutes";
import { documentOutorgaRoutes } from "./documentOutorgaRoutes";

const routes = Router();

routes.use("/documentFiles", documentFileRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/documentOutorga", documentOutorgaRoutes);

export { routes }
