import { Router } from "express";
import tweetRouter from "./tweet.router.js";
import userRouter from "./user.router.js";

const router = Router();

router.use("/user", userRouter);
router.use("/tweets", tweetRouter);


export default router;