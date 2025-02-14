import { Router } from "express";
import { postNotification } from "../controller/NotificationController";

const notificationsRoutes = Router();

notificationsRoutes.post("/", postNotification)

export { notificationsRoutes }