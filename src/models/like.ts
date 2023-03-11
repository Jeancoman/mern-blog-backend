import mongoose, { Schema } from "mongoose";
import { Like } from "../types";

const LikeSchema = new mongoose.Schema<Like>({
  any: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
});

const Like = mongoose.model("Like", LikeSchema);

export default Like;
