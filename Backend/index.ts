import express, { json } from "express";
import { routes } from "./routes/routes";

const app = express();

app.use(routes)
app.use(json())

const PORT = "3000";

app.listen(PORT, () => {
    console.log("Rodando na porta: ", PORT)
});