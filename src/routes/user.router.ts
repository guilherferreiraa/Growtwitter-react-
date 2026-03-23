import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new UserController();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.listAll);
router.delete("/users/:id", authMiddleware, controller.delete);
router.post("/logout", controller.logout); 

export default router;