import { Router } from "express";
import { getAllDocuments } from "../controller/DocumentController";

const documentsRoutes = Router();

documentsRoutes.get("/", getAllDocuments)

export { documentsRoutes }