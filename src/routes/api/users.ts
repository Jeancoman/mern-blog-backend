import express from "express";
import passport from "passport";
import PostService from "../../services/post";
import UserService from "../../services/user";
import { User } from "../../types";

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;

  if (!body.userName) {
    res.status(400).json("Username is missing from request body").end();
  }

  if (!body.password) {
    res.status(400).json("Password is missing from request body").end();
  }

  const user = await UserService.createWithPassword(
    body.userName,
    body.password
  );

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(500).json("User could not be created");
  }
});

router.get("/:username", async (req, res) => {
  const user = await UserService.findByUserName(req.params.username);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json("User not found");
  }
});

router.get("/:username/public/posts", async (req, res) => {
  const user = await UserService.findByUserName(req.params.username);

  if (!user) {
    res.status(404).json("User not found").end();
  }
  // @ts-ignore
  const posts = await PostService.findAllPublishedByUserId(user._id.toString());

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404).json("Posts not found");
  }
});

router.get("/:username/protected/posts", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const reqUser = req.user as User;
  const user = await UserService.findByUserName(req.params.username);

  if (!user) {
    res.status(404).json("User not found").end();
  }

  if(reqUser.userName !== req.params.username && reqUser.userType !== "ADMIN"){
    res.status(403).json("Not authorized").end();
  }

  // @ts-ignore
  const posts = await PostService.findAllByUserId(user._id);

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404).json("Posts not found");
  }
});

export default router;
