import Post from "../models/post";

const create = async (
  title: string,
  content: string,
  published: boolean,
  userId: string
) => {
  const post = await Post.create({
    title,
    content,
    published,
    userId,
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
    { id },
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
  const post = await Post.findById({ _id: id })
    .populate("user", "-password")
    .exec();
  return post;
};

const findAll = async () => {
  const posts = await Post.find({})
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

const PostService = {
  create,
  updateById,
  deleteById,
  findById,
  findAll,
  findAllPublished,
  findAllByUserId,
  findAllPublishedByUserId,
};

export default PostService;
