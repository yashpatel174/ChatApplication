import { response } from "./responses.js";
import JWT from "jsonwebtoken";

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

export { authMiddleware };
