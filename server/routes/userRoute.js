import express from "express";
import { acceptRequest, getFriends, login, logout, notifications, register, searchUser, sendRequest, userProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", singleAvatar, register);
router.post("/login", login);

router.use(authMiddleware);
router.get("/profile", userProfile);
router.get("/logout", logout);
router.get("/search", searchUser);
router.put("/sendRequest", sendRequest);
router.put("/acceptRequest", acceptRequest);
router.get("/notifications", notifications);
router.get("/friends", getFriends);

export default router;
