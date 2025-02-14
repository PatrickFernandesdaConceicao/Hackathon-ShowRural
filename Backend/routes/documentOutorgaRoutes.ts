import { Router } from "express";
import { getAll } from "../controller/DocumentOutorgaController.ts";
import { upload } from "../middlewares/multer";

const documentOutorgaRoutes = Router();

documentOutorgaRoutes.post("/", upload.single("file"), getAll)

export { documentOutorgaRoutes }