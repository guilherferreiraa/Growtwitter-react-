import { Router } from "express";
import { TweetController } from "../controllers/tweetControler";
import { authMiddleware } from "../middleware/auth.middleware";

const tweetRouter = Router();
const tweetController = new TweetController();

tweetRouter.get("/tweets", authMiddleware, (req, res) => tweetController.index(req, res)); 
tweetRouter.get("/tweets/feed", authMiddleware, (req, res) => tweetController.feed(req, res));

tweetRouter.post("/tweets", authMiddleware, (req, res) => tweetController.handle(req, res));
tweetRouter.delete("/tweets/:id", authMiddleware, (req, res) => tweetController.destroy(req, res));
tweetRouter.post("/tweets/:id/reply", authMiddleware, (req, res) => tweetController.reply(req, res));
tweetRouter.post("/like/:id", authMiddleware, (req, res) => tweetController.like(req, res));
tweetRouter.delete("/unlike/:id", authMiddleware, (req, res) => tweetController.unlike(req, res));

export default tweetRouter;