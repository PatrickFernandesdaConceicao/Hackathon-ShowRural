import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import pdfParse from "pdf-parse";
import cors from "cors";

const app = express();
app.use(cors());
app.use(fileUpload());

app.post("/extract-text", async (req: Request, res: Response) => {
  if (!req.files || !req.files.pdf) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }

  try {
    const pdfFile = req.files.pdf as fileUpload.UploadedFile;
    const data = await pdfParse(pdfFile.data);
    res.json({ text: data.text });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar o PDF" });
  }
});

app.listen(3000, () => console.log("🚀 Backend rodando em http://localhost:3000"));
