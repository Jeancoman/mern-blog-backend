import mongo from "./config/mongo";
import "./config/passport";
import express from "express";
import cors from "cors";
import { default as authRouter } from "./routes/api/auth";
import { default as userRouter } from "./routes/api/users";
import { default as postRouter } from "./routes/api/posts";
import { default as commentRouter } from "./routes/api/comments";

mongo.connect();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

export default app;