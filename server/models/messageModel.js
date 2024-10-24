import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: String,
    attachments: [
      {
        public_id: {
          type: stringify,
          required: true,
        },
        url: {
          type: stringify,
          required: true,
        },
      },
    ],
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const messageModel = mongoose.model("Message", messageSchema);
