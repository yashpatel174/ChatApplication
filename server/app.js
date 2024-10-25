import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { database } from "./utils/features.js";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";

const app = express();

// Env configureation
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/users", userRoute);
app.use("/chats", chatRoute);

database(process.env.DB);

// Server listen
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
