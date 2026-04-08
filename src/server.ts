import express from "express";
import cors from "cors";

import userRouter from "./routes/user.router";
import tweetRouter from "./routes/tweet.router";
import followRouter from "./routes/follow.router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);     
app.use("/auth", tweetRouter);  
app.use("/auth", followRouter); 

export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(3333, () => {
        console.log("Servidor rodando localmente na porta 3333!");
    });
}