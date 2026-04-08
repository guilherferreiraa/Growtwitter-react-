import express from "express";
import cors from "cors";

import userRouter from "./routes/user.router.ts";
import tweetRouter from "./routes/tweet.router.ts";
import followRouter from "./routes/follow.router.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);     
app.use("/tweets", tweetRouter);  
app.use("/follow", followRouter); 

export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(3333, () => {
        console.log("Servidor rodando localmente na porta 3333!");
    });
}