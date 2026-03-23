import express from "express";
import cors from "cors";

import userRouter from "./routes/user.router";
import tweetRouter from "./routes/tweet.router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);
app.use("/auth", tweetRouter); 

app.listen(3333, () => {
    console.log("Servidor rodando na porta 3333!");
});