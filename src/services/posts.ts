import { Post, User } from "../config/database";

const createPost = async (
  UserId: string,
  title: string,
  content: string,
  status: string
) => {
  try {
    const post = await Post.create({
      title,
      content,
      status,
      // @ts-ignore
      UserId,
    });
    return post;
  } catch {
    return null;
  }
};

const updatePost = async (
  id: string,
  title: string,
  content: string,
  status: string
) => {
  try {
    const post = await Post.update(
      {
        title,
        content,
        status,
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    );
    return post;
  } catch {
    return null;
  }
};

const deletePost = async (id: string) => {
  try {
    const post = await Post.destroy({
      where: {
        id,
      },
    });
    return post;
  } catch {
    return 0;
  }
};

const findPublishedPostsByUserId = async (UserId: string) => {
  try {
    const posts = await Post.findAll({
      where: {
        // @ts-ignore
        UserId,
        status: "published",
      },
      order: [["createdAt", "DESC"]],
      include: User.scope("withoutPassword"),
    });
    return posts;
  } catch {
    return null;
  }
};

const findPostsByUserId = async (UserId: string) => {
  try {
    const posts = await Post.findAll({
      where: {
        // @ts-ignore
        UserId,
      },
      order: [["createdAt", "DESC"]],
      include: User.scope("withoutPassword"),
    });
    return posts;
  } catch {
    return null;
  }
};

const findPostById = async (id: string) => {
  try {
    const post = await Post.findOne({
      where: {
        id,
      },
      order: [["createdAt", "DESC"]],
      include: User.scope("withoutPassword"),
    });
    return post;
  } catch {
    return null;
  }
};

const findPosts = async () => {
  const posts = await Post.findAll({
    where: {
      status: "published",
    },
    order: [["createdAt", "DESC"]],
    include: User.scope("withoutPassword"),
  });
  return posts;
};

export {
  createPost,
  updatePost,
  deletePost,
  findPublishedPostsByUserId,
  findPostsByUserId,
  findPostById,
  findPosts,
};
