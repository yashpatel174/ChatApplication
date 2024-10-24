import express from "express";
import { singleAvatar } from "../middlewares/multer.js";
import { login, register } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", singleAvatar, register);
router.post("/login", singleAvatar, login);

export default router;
