import { userModel } from "../models/userModel.js";
import { sendToken } from "../utils/features.js";
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
    console.log(isMatch);

    sendToken(res, user, 200, `Welcome ${user.name}!`);
  } catch (error) {
    console.log(error.message);
    response(res, "Error while Logging in", 500, error.message);
  }
};

//* User Profile
const myProfile = (req, res) => {
  try {
    const user = req.user;
    if (!user) return res;
    response(res, "User data fetched successfully!", 200, user);
  } catch (error) {
    response(res, "Error while getting profile", 500, error.message);
  }
};

export { register, login, myProfile };
