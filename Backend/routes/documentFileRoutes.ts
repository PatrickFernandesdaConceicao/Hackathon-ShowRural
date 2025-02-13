import { Router } from "express";
import { getAll } from "../controller/DocumentFileController";
import { upload } from "../middlewares/multer";

const documentFileRoutes = Router();

documentFileRoutes.post("/", upload.single("file"), getAll)

export { documentFileRoutes }