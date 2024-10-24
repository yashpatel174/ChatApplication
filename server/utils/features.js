import mongoose from "mongoose";
import JWT from "jsonwebtoken";

const cookieOption = { maxAge: 15 * 24 * 60 * 60 * 1000, sameSight: "none", httpOnly: true, secure: true };

export const database = (uri) => {
  try {
    mongoose.connect(uri).then(console.log("Connected to database successfully!"));
  } catch (error) {
    console.log(error.message);
  }
};

export const sendToken = (res, user, code, message) => {
  try {
    const token = JWT.sign({ _id: user._id }, process.env.SECRET_KEY, { duration: process.env.EXPIRE });

    return res.status(code).cookie("token", token, cookieOption).send({
      success: true,
      message: message,
      result: user,
    });
  } catch (error) {
    res.send({ message: message, error: error.message });
  }
};
