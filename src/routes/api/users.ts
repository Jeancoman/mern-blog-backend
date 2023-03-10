import express from "express";
import PostService from "../../services/post";
import UserService from "../../services/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;

  if (!body.userName) {
    res.status(400).json("Username is missing from request body");
  }

  if (!body.password) {
    res.status(400).json("Password is missing from request body");
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
    res.status(404).json("User not found");
  }

  // @ts-ignore
  const posts = await PostService.findAllPublishedByUserId(user._id.toString());

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404).json("Posts not found");
  }
});

router.get("/:username/protected/posts", async (req, res) => {
  const user = await UserService.findByUserName(req.params.username);

  if (!user) {
    res.status(404).json("User not found");
  }

  // @ts-ignore
  const posts = await PostService.findAllPublishedByUserId(user._id.toString());

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404).json("Posts not found");
  }
});

export default router;
