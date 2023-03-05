import { Post, User } from "../config/database";
const createPost = async (UserId, title, content, status) => {
    try {
        const post = await Post.create({
            title,
            content,
            status,
            // @ts-ignore
            UserId,
        });
        return post;
    }
    catch {
        return null;
    }
};
const updatePost = async (id, title, content, status) => {
    try {
        const post = await Post.update({
            title,
            content,
            status,
        }, {
            where: {
                id,
            },
            returning: true,
        });
        return post;
    }
    catch {
        return null;
    }
};
const deletePost = async (id) => {
    try {
        const post = await Post.destroy({
            where: {
                id,
            },
        });
        return post;
    }
    catch {
        return 0;
    }
};
const findPostsByUserId = async (UserId) => {
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
    }
    catch {
        return null;
    }
};
const findPostById = async (id) => {
    try {
        const post = await Post.findOne({
            where: {
                id,
            },
            order: [["createdAt", "DESC"]],
            include: User.scope("withoutPassword"),
        });
        return post;
    }
    catch {
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
export { createPost, updatePost, deletePost, findPostsByUserId, findPostById, findPosts, };
