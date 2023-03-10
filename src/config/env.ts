import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL!;
const SECRET_KEY = process.env.SECRET_KEY!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export {
  PORT,
  MONGODB_URL,
  SECRET_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FRONTEND_URL,
};
