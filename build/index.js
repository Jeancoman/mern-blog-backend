import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createPost, deletePost, findPosts, findPostById, findPostsByUserId, updatePost, } from "./services/posts.js";
import { authenticate, createUser, findUserByUsername } from "./services/users.js";
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;
app.post("/api/auth", (req, res) => {
    const body = req.body;
    if (!body.username) {
        return res.status(400).json({ message: "Username missing" });
    }
    if (!body.password) {
        return res.status(400).json({ message: "Password missing" });
    }
    authenticate(body.username, body.password).then((auth) => {
        if (auth.isValidCredentials) {
            res.status(200).json(auth);
        }
        else {
            res.status(401).json(auth);
        }
    });
});
app.get("/api/users", (req, res) => {
    if (req.query.username) {
        // @ts-ignore
        findUserByUsername(req.query.username).then((user) => {
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: "User not found" });
            }
        });
    }
    else if (req.query.id) {
        // @ts-ignore
        findUserById(req.query.id).then((user) => {
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: "User not found" });
            }
        });
    }
    else {
        res.status(406).json({ message: "Query parameter not acepted" });
    }
});
app.post("/api/users", (req, res) => {
    const body = req.body;
    if (!body.username) {
        return res.status(400).json({ message: "Username missing" });
    }
    if (!body.accountName) {
        return res.status(400).json({ message: "Account name missing" });
    }
    if (!body.password) {
        return res.status(400).json({ message: "Password missing" });
    }
    createUser(body.accountName, body.username, body.password).then((user) => {
        if (user) {
            res.status(201).json(user);
        }
        else {
            res
                .status(500)
                .json({ message: "User could not be created" });
        }
    });
});
app.get("/api/users/:id/posts", (req, res) => {
    findPostsByUserId(req.params.id).then((posts) => {
        if (posts) {
            res.status(200).json(posts);
        }
        else {
            res
                .status(404)
                .json({ message: "This user has no posts or does not exist" });
        }
    });
});
app.get("/api/posts", (_req, res) => {
    findPosts().then((posts) => {
        if (posts.length > 0) {
            res.status(200).json(posts);
        }
        else {
            res.status(404).json({ message: "There are no posts here" });
        }
    });
});
app.post("/api/posts", (req, res) => {
    const body = req.body;
    if (!body.title) {
        return res.status(400).json({ message: "Title missing" });
    }
    if (!body.content) {
        return res.status(400).json({ message: "Content missing" });
    }
    if (!body.status) {
        return res.status(400).json({ message: "Status missing" });
    }
    if (!body.UserId) {
        return res.status(400).json({ message: "User is missing" });
    }
    createPost(body.UserId, body.title, body.content, body.status).then((post) => {
        if (post) {
            res.status(201).json(post);
        }
        else {
            res.status(404).json({ message: "Post could not be created" });
        }
    });
});
app.get("/api/posts/:id", (req, res) => {
    findPostById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ message: "This post does not exist" });
        }
    });
});
app.delete("/api/posts/:id", async (req, res) => {
    const post = await findPostById(req.params.id);
    const sessionId = req.header("X-Session-Id");
    if (!post) {
        return res.status(404).json({ message: "This post does not exist" });
    }
    if (!sessionId) {
        return res
            .status(403)
            .json({ message: "Not authorized to delete this post" });
    }
    // @ts-ignore
    if (sessionId !== post?.getDataValue("UserId")) {
        return res
            .status(403)
            .json({ message: "Not authorized to delete this post" });
    }
    deletePost(post.id).then(() => {
        res.status(204).json({ message: "Operation completed" });
    });
});
app.patch("/api/posts/:id", async (req, res) => {
    const body = req.body;
    const post = await findPostById(req.params.id);
    const sessionId = req.header("X-Session-Id");
    if (!post) {
        return res.status(404).json({ message: "This post does not exist" });
    }
    if (!sessionId) {
        return res
            .status(403)
            .json({ message: "Not authorized to modify this post" });
    }
    // @ts-ignore
    if (sessionId !== post?.getDataValue("UserId")) {
        return res
            .status(403)
            .json({ message: "Not authorized to modify this post" });
    }
    if (!body.title) {
        return res.status(400).json({ message: "Title missing" });
    }
    if (!body.content) {
        return res.status(400).json({ message: "Content missing" });
    }
    if (!body.status) {
        return res.status(400).json({ message: "Status missing" });
    }
    updatePost(post.id, body.title, body.content, body.status).then((post) => {
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(500).json({ message: "Post could not be updated" });
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
