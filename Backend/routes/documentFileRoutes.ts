import { Router } from "express";
import { postDocumentFile } from "../controller/DocumentFileController";
import { getByIdDocumentFile } from "../controller/DocumentFileController";
import { upload } from "../middlewares/multer";

const documentFileRoutes = Router();

documentFileRoutes.post("/", postDocumentFile);
documentFileRoutes.get("/:id", getByIdDocumentFile);

export { documentFileRoutes }