import mongoose, { Schema } from "mongoose";
import { Post } from "../types";

const PostSchema = new mongoose.Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    published: Boolean,
    views: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
