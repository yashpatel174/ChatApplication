import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { database } from "./utils/features.js";
import { v2 as cloudinary } from "cloudinary";
import { corsOptions } from "./constants/config.js";
import { chat_joined, chat_leave, new_message, new_message_alert, online_users, start_typing, stop_typing } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { socketAuth } from "./middlewares/auth.js";
import { messageModel } from "./models/messageModel.js";

import adminRoute from "./routes/adminRoute.js";
import chatRoute from "./routes/chatRoute.js";
import userRoute from "./routes/userRoute.js";

// Env configureation
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });
app.set("io", io);
export const userSocketId = new Map();
export const onlineUsers = new Set();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// SecretKey
export const adminKey = process.env.ADMIN_KEY || "laushmcfoq";

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/admin", adminRoute);

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => await socketAuth(err, socket, next));
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketId.set(user._id.toString(), socket.id);
  socket.on(new_message, async ({ chatId, members, message }) => {
    const messageForRealtime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const dbMessage = { content: message, sender: user._id, chat: chatId };
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(new_message, {
      chatId,
      message: messageForRealtime,
    });
    io.to(membersSocket).emit(new_message_alert, { chatId });
    try {
      const message = new messageModel(dbMessage);
      await message.save();
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on(start_typing, ({ members, chatId }) => {
    const membersSocket = getSockets(members);
    socket.to(membersSocket).emit(start_typing, { chatId });
  });

  socket.on(stop_typing, ({ members, chatId }) => {
    const membersSocket = getSockets(members);
    socket.to(membersSocket).emit(stop_typing, { chatId });
  });

  socket.on(chat_joined, ({ userId, members }) => {
    onlineUsers.add(userId.toString());
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(online_users, Array.from(onlineUsers));
  });

  socket.on(chat_leave, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(online_users, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    userSocketId.delete(user._id.toString());
  });
});

database(process.env.DB);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Server listen
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});
