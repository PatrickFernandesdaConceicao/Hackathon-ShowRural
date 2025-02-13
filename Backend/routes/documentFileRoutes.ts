import { Router } from "express";
import { postDocument } from "../controller/DocumentFileController";
import { upload } from "../middlewares/multer";

const documentFileRoutes = Router();

documentFileRoutes.post("/", upload.single("file"), postDocument);
documentFileRoutes.get("/", upload.single("file"), postDocument);

export { documentFileRoutes }