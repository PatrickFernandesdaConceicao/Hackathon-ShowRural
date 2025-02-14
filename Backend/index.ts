import express, { json } from "express";
import { routes } from "./routes/routes";
import { listenNotifications } from "./utils/CronProvider";
import cors from 'cors';

const app = express();

app.use(json())
app.use(cors({
    origin: '*',
    allowedHeaders: "*"
}))
app.use(routes)

const PORT = "3000";

app.listen(PORT, async () => {
    console.log("Rodando na porta: ", PORT)
});