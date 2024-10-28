import JWT from "jsonwebtoken";
import { adminKey } from "../app.js";
import { required, response } from "../middlewares/responses.js";
import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModel.js";
import { userModel } from "../models/userModel.js";
import { cookieOptions } from "../utils/features.js";

const adminLogin = async (req, res) => {
  try {
    const { secretKey } = req.body;
    required(res, { secretKey });

    const isMatched = secretKey === adminKey;
    if (!isMatched) return response(res, "Invalid Admin Key", 401);

    const token = JWT.sign(secretKey, process.env.SECRET_KEY);

    res.cookie("admin", token, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
    return response(res, "Authenticated Successfully", 200);
  } catch (error) {
    response(res, "Error while logging in", 500, error.message);
  }
};

const adminLogout = async (req, res) => {
  try {
    res.cookie("admin", "", { ...cookieOptions, maxAge: 0 });
    response(res, "Logged out successfully!", 200);
  } catch (error) {
    response(res, "Error while Logging out", 500, error.message);
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({});

    const transformedUsers = await Promise.all(
      users?.map(async ({ name, userName, avatar, _id }) => {
        const [groups, friends] = await Promise.all([chatModel.countDocuments({ groupChat: true, members: _id }), chatModel.countDocuments({ groupChat: false, members: _id })]);
        return {
          name,
          userName,
          avatar: avatar.url,
          _id,
          groups,
        };
      })
    );
    if (!users) return response(res, "Users not found", 404);
    return response(res, "", 200, transformedUsers);
  } catch (error) {
    response(res, "Error while getting users", 500, error.message);
  }
};

const allChats = async (req, res) => {
  try {
    const chats = await chatModel.find({}).populate("members", "name avatar").populate("creator", "name avatar");

    const transformedChats = await Promise.all(
      chats?.map(async ({ members, _id, groupChat, name, creator }) => {
        const totalMessages = await messageModel.countDocuments({ chat: _id });

        return {
          _id,
          groupChat,
          name,
          avatar: members.slice(0, 3)?.map((m) => m.avatar.url),
          members: members?.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
          })),
          creator: {
            name: creator?.name || "none",
            avatar: creator?.avatar.url || "",
            totalMembers: members.length,
            totalMessages,
          },
        };
      })
    );

    return response(res, "", 200, transformedChats);
  } catch (error) {
    response(res, "Error while getting chats", 500, error.message);
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await messageModel.find({}).populate("sender", "name avatar").populate("chat", "groupChat");
    if (!messages) return response(res, "Messages not found", 404);

    const transformedMessages = messages?.map(({ content, attachments, _id, sender, createdAt, chat }) => ({
      _id,
      attachments,
      content,
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return response(res, "", 200, transformedMessages);
  } catch (error) {
    response(res, "Error while getting messages", 500, error.message);
  }
};

const dashboard = async (req, res) => {
  try {
    const [groupsCount, usersCount, messagesCount, chatCount] = await Promise.all([
      chatModel.countDocuments({ groupChat: true }),
      userModel.countDocuments(),
      messageModel.countDocuments(),
      chatModel.countDocuments(),
    ]);

    const today = new Date();
    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);

    const last7daysMessages = await messageModel
      .find({
        createdAt: {
          $gte: last7days,
          $lte: today,
        },
      })
      .select("createdAt");

    const messages = new Array(7).fill(0);
    const daysInMS = 1000 * 60 * 60 * 24;

    last7daysMessages.forEach((message) => {
      const indexApprox = (today.getTime() - message.createdAt.getTime()) / daysInMS;
      const index = Math.floor(indexApprox);
      messages[6 - index]++;
    });

    const stats = { groupsCount, usersCount, messagesCount, chatCount, messagesChart: messages };

    return response(res, "", 200, stats);
  } catch (error) {
    response(res, "Error while getting data", 500, error.message);
  }
};

const adminData = async (req, res) => {
  try {
    return response(res, "", 200, { admin: true });
  } catch (error) {
    response(res, "Error while getting users", 500, error.message);
  }
};

export { adminData, adminLogin, adminLogout, allChats, allMessages, allUsers, dashboard };

