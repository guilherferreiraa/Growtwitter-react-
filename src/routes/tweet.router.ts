import { Router } from "express";
import { TweetController } from "../controllers/tweetController";
import { authMiddleware } from "../middleware/auth.middleware";

const tweetRouter = Router();
const tweetController = new TweetController();

tweetRouter.get("/tweets", authMiddleware, (req, res) => tweetController.getFeed(req, res)); 
tweetRouter.get("/tweets/feed", authMiddleware, (req, res) => tweetController.getFeed(req, res));
tweetRouter.post("/tweets", authMiddleware, (req, res) => tweetController.handle(req, res));
tweetRouter.get("/tweets/explore", authMiddleware, (req, res) => tweetController.index(req, res));
tweetRouter.get("/tweets/:id", authMiddleware, tweetController.show);
tweetRouter.delete("/tweets/:id", authMiddleware, (req, res) => tweetController.destroy(req, res));
tweetRouter.get("/tweets/:id/replies", authMiddleware, (req, res) => tweetController.listReplies(req, res));
tweetRouter.post("/tweets/:id/reply", authMiddleware, (req, res) => tweetController.reply(req, res));
tweetRouter.post("/like/:id", authMiddleware, (req, res) => tweetController.like(req, res));
tweetRouter.delete("/unlike/:id", authMiddleware, (req, res) => tweetController.unlike(req, res));

tweetRouter.get("/tweets/user/:userId", authMiddleware, (req, res) => tweetController.getByUser(req, res));

export default tweetRouter;