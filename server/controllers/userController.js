import { userModel } from "../models/userModel.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import bcrypt from "bcrypt";
import { response, required } from "../middlewares/responses.js";

//* User Register
const register = async (req, res) => {
  try {
    const { name, userName, password, bio } = req.body;
    required(res, { name }, { userName }, { password }, { bio });

    const avatar = {
      public_id: "32132100",
      url: "http://localhost:8080/user/login",
    };

    const existingUser = await userModel.findOne({ userName });
    if (existingUser) return response(res, "This user is already registered!", 400);

    const user = new userModel({ name, userName, password, avatar, bio });
    if (!user) return response(res, "Error while registering user", 500);

    await user.save();
    response(res, "User registered successfully!", 200, user);
  } catch (error) {
    if (error.code === 11000) {
      response(res, "Duplicate key error", 500);
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
const searchUser = (req, res) => {
  try {
    const { name } = req.query;

    response(res, "Logged out successfully!", 200);
  } catch (error) {
    response(res, "Error while searching the user!", 500, error.message);
  }
};




export { register, login, userProfile, logout, searchUser };
