import Comment from "../models/comment";

const create = async (
  content: string,
  user: string,
  any: string,
  superAny?: string
) => {
  if (typeof superAny !== "undefined") {
    const comment = await Comment.create({
      content,
      user,
      any,
      superAny,
    });
    return comment;
  }

  const comment = await Comment.create({
    content,
    user,
    any,
  });
  return comment;
};

const updateById = async (id: string, content: string) => {
  const comment = await Comment.findByIdAndUpdate({ _id: id }, { content, edited: true });
  return comment;
};

const deleteById = async (id: string) => {
  const comment = await Comment.findByIdAndUpdate({ _id: id });
  return comment;
};

const findById = async (id: string) => {
  const comment = await Comment.findById({ _id: id });
  return comment;
};

const findByIdAndReturnUser = async (id: string) => {
  const comment = await Comment.findById({ _id: id })
    .populate("user", "-password")
    .exec();
  return comment;
};

const findAllByAnyId = async (anyId: string) => {
  const comment = await Comment.find({ any: anyId })
    .populate("user", "-password")
    .sort({ createdAt: "desc" })
    .exec();
  return comment;
};

const findAllBySuperAnyId = async (anyId: string) => {
  const comment = await Comment.find({ superAny: anyId })
    .populate("user", "-password")
    .sort({ createdAt: "desc" })
    .exec();
  return comment;
};

const CommentService = {
  create,
  updateById,
  deleteById,
  findById,
  findByIdAndReturnUser,
  findAllByAnyId,
  findAllBySuperAnyId,
};

export default CommentService;
