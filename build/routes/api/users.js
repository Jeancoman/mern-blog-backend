import express from "express";
import passport from "passport";
import PostService from "../../services/post.js";
import UserService from "../../services/user.js";
const router = express.Router();
router.post("/", async (req, res) => {
    const body = req.body;
    if (!body.userName) {
        return res.status(400).json("Username is missing from request body").end();
    }
    if (!body.password) {
        return res.status(400).json("Password is missing from request body").end();
    }
    const user = await UserService.createWithPassword(body.userName, body.password);
    if (user) {
        return res.status(201).json(user);
    }
    else {
        res.status(500).json("User could not be created");
    }
});
router.get("/:username", async (req, res) => {
    const user = await UserService.findByUserName(req.params.username);
    if (user) {
        return res.status(200).json(user);
    }
    else {
        res.status(404).json("User not found");
    }
});
router.get("/:username/public/posts", async (req, res) => {
    const user = await UserService.findByUserName(req.params.username);
    if (!user) {
        return res.status(404).json("User not found").end();
    }
    // @ts-ignore
    const posts = await PostService.findAllPublishedByUserId(user._id.toString());
    if (posts) {
        return res.status(200).json(posts);
    }
    else {
        return res.status(404).json("Posts not found");
    }
});
router.get("/:username/protected/posts", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const reqUser = req.user;
    const user = await UserService.findByUserName(req.params.username);
    if (!user) {
        return res.status(404).json("User not found").end();
    }
    if (reqUser._id.toString() !== user?._id.toString() && reqUser.userType !== "ADMIN") {
        // @ts-ignore
        const posts = await PostService.findAllPublishedByUserId(user._id.toString());
        if (posts) {
            return res.status(200).json(posts);
        }
        else {
            return res.status(404).json("Posts not found");
        }
    }
    // @ts-ignore
    const posts = await PostService.findAllByUserId(user._id);
    if (posts) {
        return res.status(200).json(posts);
    }
    else {
        res.status(404).json("Posts not found");
    }
});
export default router;