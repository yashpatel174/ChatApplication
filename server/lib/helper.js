import { userSocketId } from "../app.js";
import { response } from "../middlewares/responses.js";

export const otherMember = (members, userId) => {
  return members.find((m) => m._id.toString() !== userId.toString());
};

export const getSockets = async (users = []) => {
  try {
    return users?.map((user) => userSocketId.get(user._id.toString()));
  } catch (error) {
    console.log(error.message);
  }
};

export const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
