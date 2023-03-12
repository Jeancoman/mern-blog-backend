import mongoose, { Schema } from "mongoose";
const LikeSchema = new mongoose.Schema({
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
