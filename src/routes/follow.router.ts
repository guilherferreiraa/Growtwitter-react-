import { Router } from "express";
import { FollowController } from "../controllers/followController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followRouter = Router();
const followController = new FollowController();

followRouter.post("/users/:id/follow", authMiddleware, (req, res) => followController.follow(req, res));
followRouter.delete("/users/:id/unfollow", authMiddleware, (req, res) => followController.unfollow(req, res));

export default followRouter;