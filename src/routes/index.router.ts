import { Router } from "express";
import tweetRouter from "./tweet.router";
import userRouter from "./user.router";

const router = Router();

router.use("/user", userRouter);
router.use("/tweets", tweetRouter);


export default router;