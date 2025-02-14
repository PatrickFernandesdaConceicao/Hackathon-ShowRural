import express, { json } from "express";
import { routes } from "./routes/routes";
import { listenNotifications } from "./utils/CronProvider";

const app = express();

app.use(json())
app.use(routes)

const PORT = "3000";

app.listen(PORT, () => {
    listenNotifications();
    // console.log(new Date().toISOString().split('T')[0]);
    console.log("Rodando na porta: ", PORT)

});