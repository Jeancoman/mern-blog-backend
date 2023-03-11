import mongoose, { Schema } from "mongoose";
import { Comment } from "../types";

const CommentSchema = new mongoose.Schema<Comment>(
  {
    content: {
      type: String,
      required: true,
    },
    nesting: {
      type: Number,
      enum: [0, 1],
      required: true
    },
    edited: {
      type: Boolean,
      required: true,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    any: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    superAny: Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
