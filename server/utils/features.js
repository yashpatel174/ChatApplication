import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import { response } from "../middlewares/responses.js";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../lib/helper.js";

export const cookieOptions = { maxAge: 15 * 24 * 60 * 60 * 1000, sameSight: "none", httpOnly: true, secure: true };

export const database = (uri) => {
  try {
    mongoose.connect(uri).then(console.log("Connected to database successfully!"));
  } catch (error) {
    console.log(error.message);
  }
};

export const sendToken = (res, user, code, message) => {
  try {
    const token = JWT.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE });

    return res.status(code).cookie("token", token, cookieOptions).send({
      success: true,
      message: message,
      result: user,
    });
  } catch (error) {
    res.send({ message: message, error: error.message });
  }
};

export const emitEvent = (req, event, user, data) => {
  try {
    console.log("Emit event", event);
  } catch (error) {
    console.log(error.message);
  }
};

export const uploadFileCloudinary = async (files = []) => {
  const uploadPromise = files?.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });
  try {
    const results = await Promise.all(uploadPromise);
    const formattedResults = results?.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (error) {
    console.log("Error while uploading files to cloudinary", error.message);
  }
};

export const deleteFilesFromCloudinary = async (publicIds) => {};
