import Post from "../models/post";

const create = async (
  title: string,
  content: string,
  published: boolean,
  user: string
) => {
  const post = await Post.create({
    title,
    content,
    published,
    user,
  });
  return post;
};

const updateById = async (
  id: string,
  title: string,
  content: string,
  published: boolean
) => {
  const post = await Post.findByIdAndUpdate(
    { _id: id },
    {
      title,
      content,
      published,
    }
  );
  return post;
};

const deleteById = async (id: string) => {
  const post = await Post.findByIdAndDelete({ _id: id });
  return post;
};

const findById = async (id: string) => {
  const post = await Post.findById({ _id: id });
  return post;
};

const findByIdAndReturnUser = async (id: string) => {
  const post = await Post.findById({ _id: id })
    .populate("user", "-password")
    .exec();
  return post;
};

const findPublishedByIdAndReturnUser = async (id: string) => {
  const post = await Post.findOne({ _id: id, published: true })
    .populate("user", "-password")
    .exec();
  return post;
};

const findAll = async () => {
  const posts = await Post.find({published: true})
    .populate("user", "-password")
    .sort({ createdAt: "desc" })
    .exec();
  return posts;
};

const findAllPublished = async () => {
  const posts = await Post.find({ published: true })
    .populate("user", "-password")
    .sort({ createdAt: "desc" })
    .exec();
  return posts;
};

const findAllByUserId = async (userId: string) => {
  const posts = await Post.find({ user: userId })
    .populate("user", "-password")
    .sort({ createdAt: "desc" })
    .exec();
  return posts;
};

const findAllPublishedByUserId = async (userId: string) => {
  const posts = await Post.find({ user: userId, published: true })
    .populate("user", "-password")
    .sort({ createdAt: "desc" })
    .exec();
  return posts;
};

const incrementViews = (postId: string) => {
  const post = Post.findByIdAndUpdate({ _id: postId }, { $inc: { views: 1 } }).exec();
  return post;
};

const PostService = {
  create,
  updateById,
  deleteById,
  findById,
  findByIdAndReturnUser,
  findPublishedByIdAndReturnUser,
  findAll,
  findAllPublished,
  findAllByUserId,
  findAllPublishedByUserId,
  incrementViews,
};

export default PostService;
