import { Router } from "express";
import { documentFileRoutes } from "./documentFileRoutes";
import { notificationsRoutes } from "./notificationsRoutes";
import { documentOutorgaRoutes } from "./documentOutorgaRoutes";
import { documentsRoutes } from "./documentRoutes";

const routes = Router();

routes.use("/documentFiles", documentFileRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/documentOutorga", documentOutorgaRoutes);
routes.use("/documents", documentsRoutes);

export { routes }
