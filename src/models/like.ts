import mongoose, { Schema } from "mongoose";
import { Like } from "../types";

const LikeSchema = new mongoose.Schema<Like>({
  anyId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Like = mongoose.model("Like", LikeSchema);

export default Like;
