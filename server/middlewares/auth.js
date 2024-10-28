import JWT from "jsonwebtoken";
import { adminKey } from "../app.js";
import { response } from "./responses.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) return response(res, "Please login to access this route!", 401);

    const decode = JWT.verify(token, process.env.SECRET_KEY);
    if (!decode) return response(res, "Token does not match");

    req.user = decode._id;
    req.token = token;

    next();
  } catch (error) {
    response(res, "Error while verifying token!", 403, error.message);
  }
};

const isAdmin = (req, res, next) => {
  try {
    const token = req.cookies["admin"];
    if (!token) return response(res, "Only admin can access this route.", 401);

    const secretKey = JWT.verify(token, process.env.SECRET_KEY);
    if (!secretKey) return response(res, "Token does not match");

    const isMatched = secretKey === adminKey;
    if (!isMatched) return response(res, "Invalid Admin Key", 401);

    next();
  } catch (error) {
    response(res, "Error while verifying token!", 403, error.message);
  }
};

export { authMiddleware, isAdmin };
