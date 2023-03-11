import Like from "../models/like";

const increment = async (any: string, user: string) => {
  const like = await Like.create({ any, user });
  return like;
};

const decrement = async (any: string, user: string) => {
  const like = await Like.findOneAndDelete({ any, user }).exec();
  return like;
};

const findAllByAnyId = async (anyId: string) => {
  const likes = await Like.find({ any: anyId }).exec();
  return likes;
};

const LikeService = {
  increment,
  decrement,
  findAllByAnyId,
};

export default LikeService;
