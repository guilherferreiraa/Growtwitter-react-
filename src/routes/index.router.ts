import { Router } from "express";
import tweetRouter from "./tweet.router";
import userRouter from "./user.router";

const router = Router();

// Define os prefixos 
router.use("/user", userRouter);
router.use("/tweets", tweetRouter);

export default router;