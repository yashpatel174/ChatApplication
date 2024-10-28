import express from "express";
import { adminData, adminLogin, adminLogout, allChats, allMessages, allUsers, dashboard } from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/verify", adminLogin);
router.get("/logout", adminLogout);

router.use(isAdmin);
//* Only Admin Can Access
router.get("/", adminData);
router.get("/users", allUsers);
router.get("/chats", allChats);
router.get("/messages", allMessages);
router.get("/stats", dashboard);

export default router;
