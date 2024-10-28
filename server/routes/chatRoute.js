import express from "express";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  groupChat,
  leaveGroup,
  myChat,
  myGroups,
  removeMembers,
  renameGroup,
  sendAttachment,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/group", groupChat);
router.get("/myChat", myChat);
router.get("/myGroup", myGroups);
router.put("/addMembers", addMembers);
router.put("/removeMembers", removeMembers);
router.delete("/leave/:id", leaveGroup);
router.post("/message", attachmentsMulter, sendAttachment);
router.get("/message/:id", getMessages);
router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default router;
