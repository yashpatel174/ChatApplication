import { alert, new_message, new_message_alert, refetch_chats } from "../constants/events.js";
import { otherMember } from "../lib/helper.js";
import { required, response } from "../middlewares/responses.js";
import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModel.js";
import { userModel } from "../models/userModel.js";
import { deleteFilesFromCloudinary, emitEvent, uploadFileCloudinary } from "../utils/features.js";

const groupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    required(res, { name }, { members });
    if (members.length < 2) return response(res, "Group chat must have at least 3 members.", 400);

    const allMembers = [...members, req.user];

    const chat = new chatModel({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });
    await chat.save();
    emitEvent(req, alert, allMembers, `Welcome to the ${name} group!`);
    emitEvent(req, refetch_chats, members, `Welcome to the ${name} group!`);
    response(res, "Group Created Successfully!", 201, chat);
  } catch (error) {
    response(res, "Error while creating group", 500, error.message);
  }
};

const myChat = async (req, res) => {
  try {
    const chats = await chatModel.find({ members: req.user }).populate("members", "name avatar");
    const transformedChats = chats?.map(({ _id, name, members, groupChat }) => {
      const otherUser = otherMember(members, req.user);
      return {
        _id,
        groupChat,
        avatar: groupChat ? members.slice(0, 3)?.map(({ avatar }) => avatar.url) : [otherUser.avatar.url],
        name: groupChat ? name : otherUser.name,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            prev?.push(curr._id);
          }
          return prev;
        }, []),
      };
    });
    response(res, "Chat deta fetched successfully!", 200, transformedChats);
  } catch (error) {
    response(res, "Error while getting chats", 500, error.message);
  }
};

const myGroups = async (req, res) => {
  try {
    const chats = await chatModel.find({ members: req.user, groupChat: true, creator: req.user }).populate("members", "name avatar");

    const groups = chats?.map(({ members, _id, groupChat, name }) => ({
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3)?.map(({ avatar }) => avatar.url),
    }));

    response(res, "", 200, groups);
  } catch (error) {
    response(res, "Error while getting groups", 500, error.message);
  }
};

const addMembers = async (req, res) => {
  try {
    const { chatId, members } = req.body;
    required(res, { chatId }, { members });
    if (!members || members.length < 1) return response(res, "Please provide members.");

    const chat = await chatModel.findById(chatId);
    if (!chat) return response(res, "Chat not found!", 404);
    if (!chat.groupChat) return response(res, "This is not a group chat!", 400);
    if (chat.creator.toString() !== req.user.toString()) return response(res, "You are not allowed to add members", 403);

    const newMembers = members?.map((i) => userModel.findById(i, "name"));
    const allNewMembers = await Promise.all(newMembers);
    const uniqueMembers = allNewMembers.filter((i) => !chat.members?.includes(i._id.toString()))?.map((i) => i._id);
    chat.members?.push(...uniqueMembers);
    await chat.save();

    const allUsersName = allNewMembers?.map((i) => i.name).join(",");

    emitEvent(res, alert, chat.members, `${allUsersName} have been added in the group!`);
    emitEvent(res, refetch_chats, chat.members);

    response(res, "Members added successfully!", 200);
  } catch (error) {
    response(res, "Error while adding members to the group", 500, error.message);
  }
};

const removeMembers = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    required(res, { userId }, { chatId });

    const [chat, removedUser] = await Promise.all([chatModel.findById(chatId), userModel.findById(userId, "name")]);
    if (!chat) return response(res, "Chat not found", 404);
    if (!chat.groupChat) return response(res, "This is not a group chat!", 400);
    if (chat.creator.toString() !== req.user.toString()) return response(res, "You are not allowed to add members", 403);
    if (chat.members.length <= 3) return response(res, "Group must have at least 3 members.", 400);

    chat.members = chat.members?.filter((member) => member.toString() !== userId.toString());

    await chat.save();

    emitEvent(req, alert, chat.members, `${removedUser.name} has been removed from the group!`);
    emitEvent(res, refetch_chats, chat.members);

    response(res, "Member removed successfully!", 200);
  } catch (error) {
    response(res, "Error while removing members from the group", 500, error.message);
  }
};

const leaveGroup = async (req, res) => {
  try {
    const chatId = req.params.id;

    const chat = await chatModel.findById(chatId);
    if (!chat) return response(res, "Chat not found!", 404);
    if (!chat.groupChat) return response(res, "This is not a group chat!", 400);

    const remainingMember = chat.members?.filter((member) => member.toString() !== req.user.toString());
    if (remainingMember.length < 3) return response(res, "Group must have at least 3 members.", 400);

    if (chat.creator.toString() === req.user.toString()) {
      const randomNumber = Math.floor(Math.random() * remainingMember.length);
      const newCreator = remainingMember[randomNumber];
      chat.creator = newCreator;
    }

    chat.members = remainingMember;
    const [user] = await Promise.all([userModel.findById(req.user, "name"), chat.save()]);

    emitEvent(req, alert, chat.members, `User ${user.name} has left the group.`);
    response(res, "Group deleted successfully!", 200);
  } catch (error) {
    response(res, "Error while leaving group", 500, error.message);
  }
};

const sendAttachment = async (req, res) => {
  try {
    const { chatId } = req.body;
    const files = req.files || [];
    if (!files || files.length < 1) return response(res, "Please upload attachments!", 400);
    if (files.length > 5) return response(res, "Files can't be more than 5", 400);

    const [chat, me] = await Promise.all([chatModel.findById(chatId), userModel.findById(req.user, "name")]);
    if (!chat) return response(res, "Chat not found!", 404);
    if (!me) return response(res, "User not found!", 404);

    //? Upload files here
    const attachments = await uploadFileCloudinary(files);

    const messageForDb = { content: "", attachments, sender: me._id, chat: chatId };
    const messageForRealTime = { ...messageForDb, sender: { _id: me._id, name: me.name } };
    const message = new messageModel(messageForDb);
    await message.save();
    emitEvent(req, new_message, chat.members, {
      message: messageForRealTime,
      chatId,
    });
    emitEvent(req, new_message_alert, chat.members, { chatId });
    response(res, "Attachment sent successfully!", 200, message);
  } catch (error) {
    response(res, "Error while sending documents.", 500, error.message);
  }
};

const getChatDetails = async (req, res) => {
  try {
    if (req.query.populate === "true") {
      const chat = await chatModel.findById(req.params.id).populate("members", "name avatar").lean();
      if (!chat) return response(res, "Chat not found!", 404);

      chat.members = chat.members?.map(({ _id, name, avatar }) => ({ _id, name, avatar: avatar.url }));
      return response(res, "Chat details fetched successfully", 200, chat);
    } else {
      const chat = await chatModel.findById(req.params.id);
      if (!chat) return response(res, "Chat not found!", 404);
      return response(res, "Data fetched successfully!", 200, chat);
    }
  } catch (error) {
    if (error.name === "CastError") return response(res, `Invalid format of ${error.path}`, 500);
    response(res, "Error while getting chat information.", 500, process.env.NODE_ENV === "DEVELOPMENT" ? error : error.message);
  }
};

const renameGroup = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { name } = req.body;

    const chat = await chatModel.findById(chatId);
    if (!chat) return response(res, "Chat not found", 404);

    if (!chat.groupChat) return response(res, "This is not a group chat!", 400);
    if (chat.creator.toString() !== req.user.toString()) return response(res, "You are not allowed to rename the group.");

    chat.name = name;
    await chat.save();

    emitEvent(req, refetch_chats, chat.members);
    response(res, "Group renamed successfully!", 200);
  } catch (error) {
    response(res, "Error while renaming group.", 500, error.message);
  }
};

const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    const chat = await chatModel.findById(chatId);
    if (!chat) return response(res, "Chat not found", 404);

    const members = chat.members;
    if (chat.groupChat && chat.creator.toString() !== req.user.toString()) return response(res, "Only admin can delete the group.", 400);
    if (!chat.groupChat && !chat.members?.includes(req.user.toString())) return response(res, "You are not allowed to delete the group.", 400);

    //? Here we have to delete all the messages as well as all the attachments/files from the cloudinary.
    const attachmentsMsg = await messageModel.find({ chat: chatId, attachments: { $exists: true, $ne: [] } });
    const public_ids = [];

    attachmentsMsg.forEach(({ attachments }) => attachments.forEach(({ public_id }) => public_ids?.push(public_id)));

    await Promise.all([deleteFilesFromCloudinary(public_ids), chat.deleteOne(), messageModel.deleteMany({ chat: chatId })]);

    emitEvent(req, refetch_chats, members);
    return response(res, "Chat deleted successfully", 200);
  } catch (error) {
    response(res, "Error while deleting chat.", 500, error.message);
  }
};

const getMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    required(res, { chatId });

    const { page = 1 } = req.query;
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const [messages, totalMessagesCount] = await Promise.all([
      messageModel.find({ chat: chatId }).sort({ createdAt: -1 }).skip(skip).limit(resultPerPage).populate("sender", "name").lean(),
      messageModel.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    response(res, "", 200, [messages.reverse(), totalPages]);
  } catch (error) {
    response(res, "Error while getting messages.", 500, error.message);
  }
};

export { addMembers, deleteChat, getChatDetails, getMessages, groupChat, leaveGroup, myChat, myGroups, removeMembers, renameGroup, sendAttachment };
