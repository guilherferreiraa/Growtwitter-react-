import express from "express";
import router from "./routes/index.router";
import userRouter from "./routes/user.router";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(router);
app.use(cors());

app.use("/auth", userRouter);

app.listen(3333, () => {
    console.log("Servidor rodando na porta 3333!");
});