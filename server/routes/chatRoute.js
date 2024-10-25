import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { getChatDetails, renameGroup, deleteChat, sendAttachment, leaveGroup, removeMembers, addMembers, myChat, groupChat, myGroups } from "../controllers/chatController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/group", groupChat);
router.get("/myChat", myChat);
router.get("/myGroup", myGroups);
router.put("/addMembers", addMembers);
router.put("/removeMembers", removeMembers);
router.delete("/leave/:id", leaveGroup);
router.post("/message", attachmentsMulter, sendAttachment);
router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default router;
