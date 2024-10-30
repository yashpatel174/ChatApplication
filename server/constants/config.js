import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:4173", process.env.FRONTEND],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const cookieToken = "token";

export { corsOptions, cookieToken };
