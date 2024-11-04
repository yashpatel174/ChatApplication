import bcrypt from "bcrypt";
import { new_request, refetch_chats } from "../constants/events.js";
import { otherMember } from "../lib/helper.js";
import { required, response } from "../middlewares/responses.js";
import { chatModel } from "../models/chatModel.js";
import { requestModel } from "../models/requestModel.js";
import { userModel } from "../models/userModel.js";
import { cookieOptions, emitEvent, sendToken, uploadFileCloudinary } from "../utils/features.js";

//* User Register
const register = async (req, res) => {
  try {
    const { name, userName, password, bio } = req.body;
    const file = req.file;
    required(res, { file }, { name }, { userName }, { password }, { bio });
    const result = await uploadFileCloudinary([file]);

    const avatar = {
      public_id: result[0]?.public_id,
      url: result[0]?.url,
    };

    const existingUser = await userModel.findOne({ userName });
    if (existingUser) return response(res, "This user is already registered!", 400);

    const user = new userModel({ name, userName, password, avatar, bio });
    if (!user) return response(res, "Error while registering user", 500);

    await user.save();
    response(res, "User registered successfully!", 200, user);
  } catch (error) {
    console.log(error.message);
    if (error.code === 11000) {
      const err = Object.keys(error.keyPattern).join(",");
      response(res, `Duplicate field -${err}`, 500);
    }
    response(res, "Error while registering user", 500, error.message);
  }
};

//* User Login
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    required(res, { userName }, { password });

    const user = await userModel.findOne({ userName }).select("+password");
    if (!user) return response(res, "This user is not registered!", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return response(res, "Invalid Credentials.", 403);

    sendToken(res, user, 200, `Welcome ${user.name}!`);
  } catch (error) {
    response(res, "Error while Logging in", 500, error.message);
  }
};

//* User Logout
const logout = (req, res) => {
  try {
    res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
    response(res, "Logged out successfully!", 200);
  } catch (error) {
    response(res, "Error while Logging out", 500, error.message);
  }
};

//* User Profile
const userProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);
    if (!user) return response(res, "User not found", 404);
    response(res, "User data fetched successfully!", 200, user);
  } catch (error) {
    response(res, "Error while getting profile", 500, error.message);
  }
};

//* Search User
const searchUser = async (req, res) => {
  try {
    const { name = "" } = req.query;

    // Fetch all individual (non-group) chats where the current user is a member
    const myChats = await chatModel.find({ groupChat: false, members: req.user._id });

    // Extract all members from these chats, excluding the current user
    const allUsersFromChat = myChats.flatMap((c) => c.members).filter((id) => !id.equals(req.user._id));

    // Query to get all other users who are not in `allUsersFromChat`
    const allOtherUsers = await userModel.find({
      _id: { $nin: allUsersFromChat.concat(req.user._id) }, // Exclude users in chat history and current user
      name: { $regex: name, $options: "i" }, // Match users by name
    });

    const users = allOtherUsers?.map(({ _id, name, avatar }) => ({ _id, name, avatar: avatar.url }));

    response(res, "Logged out successfully!", 200, users);
  } catch (error) {
    response(res, "Error while searching the user!", 500, error.message);
  }
};

//* Send Request
const sendRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    const request = await requestModel.findOne({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user },
      ],
    });

    if (request) return response(res, "Request already sent", 400);

    const newRequest = new requestModel({
      sender: req.user,
      receiver: userId,
    });
    await newRequest.save();

    emitEvent(req, new_request, [userId]);
    response(res, "Friend request sent!", 200);
  } catch (error) {
    response(res, "Error while searching the user!", 500, error.message);
  }
};

//* Accept the Request
const acceptRequest = async (req, res) => {
  try {
    const { requestId, accept } = req.body;
    required(res, { requestId }, { accept });

    const request = await requestModel.findById(requestId).populate("sender", "name").populate("receiver", "name");
    if (!request) response(res, "Request not found", 404);

    if (request.receiver._id.toString() !== req.user.toString()) return response(res, "You are not authorized to accept this request", 401);

    if (!accept) {
      await request.deleteOne();
      return response(res, "Friend Request Rejected", 200);
    }

    const members = [request.sender._id, request.receiver._id];
    await Promise.all([
      chatModel.create({
        name: `${request.sender.name}-${request.receiver.name}`,
        members,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, refetch_chats, members);
    response(res, "Friend Request Accepted", 200, { senderId: request.sender._id });
  } catch (error) {
    response(res, "Error while accepting request", 500, error.message);
  }
};

//* Notifications
const notifications = async (req, res) => {
  try {
    const request = await requestModel.find({ receiver: req.user }).populate("sender", "name avatar");
    if (!request) return response(res, "Request not found", 404);

    const allRequest = request?.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));
    return response(res, "", 200, allRequest);
  } catch (error) {
    response(res, "Error while receiving notifications", 500, error.message);
  }
};

//* Get My Friends
const getFriends = async (req, res) => {
  try {
    const chatId = req.query.chatId;
    required(res, { chatId });

    const chat = await chatModel.find({ members: req.user, groupChat: false }).popular("members", "name avatar");

    const friends = chat?.map(({ members }) => {
      const otherUser = otherMember(members, req.user);
      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });

    if (chatId) {
      const chat = await chatModel.findById(chatId);
      if (!chat) return response(res, "Chat not found", 404);
      const availableFriends = friends.filter((friend) => !chat.members?.includes(friend._id));
      return response(res, "", 200, availableFriends);
    } else {
      return response(res, "", 200, friends);
    }
  } catch (error) {
    console.log(error.message);

    response(res, "Error while getting friends", 500, error.message);
  }
};

export { acceptRequest, getFriends, login, logout, notifications, register, searchUser, sendRequest, userProfile };
