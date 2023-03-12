import Like from "../models/like.js";
const increment = async (any, user) => {
    const like = await Like.create({ any, user });
    return like;
};
const decrement = async (any, user) => {
    const like = await Like.findOneAndDelete({ any, user }).exec();
    return like;
};
const findAllByAnyId = async (anyId) => {
    const likes = await Like.find({ any: anyId }).exec();
    return likes;
};
const LikeService = {
    increment,
    decrement,
    findAllByAnyId,
};
export default LikeService;
