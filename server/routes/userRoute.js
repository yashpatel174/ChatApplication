import express from "express";
import { singleAvatar } from "../middlewares/multer.js";
import { searchUser, logout, login, register, userProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", singleAvatar, register);
router.post("/login", login);

router.use(authMiddleware);
router.get("/profile", userProfile);
router.post("/logout", logout);
router.get("/search", searchUser);

export default router;
