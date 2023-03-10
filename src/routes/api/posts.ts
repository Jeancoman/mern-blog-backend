import express from "express";
import PostService from "../../services/post";

const router = express.Router();

router.get("/", async (_req, res) => {
  const posts = await PostService.findAll();
  if (posts.length > 0) {
    res.status(200).json(posts);
  } else {
    res.status(404).json("Posts not found");
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  if (!body.title) {
    res.status(400).json("Title missing from request body");
  }

  if (!body.content) {
    res.status(400).json("Content missing from request body");
  }

  if (!body.published) {
    res.status(400).json("Published status missing from request body");
  }

  if (!body.userId) {
    res.status(400).json("User ID missing from request body");
  }

  const post = await PostService.create(
    body.title,
    body.content,
    body.published,
    body.userId
  );

  if (post) {
    res.status(201).json(post);
  } else {
    res.status(500).json("Post could not be created");
  }
});

router.get("/:id", async (req, res) => {
  const post = await PostService.findById(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json("Post not found");
  }
});

router.delete("/:id", async (req, res) => {
  const post = await PostService.findById(req.params.id);

  if (!post) {
    res.status(404).json("Post not found");
  }

  const deleted = await PostService.deleteById(post?.id);

  if (deleted) {
    res.status(204).end();
  }
});

router.patch("/:id", async (req, res) => {
  const body = req.body;
  const post = await PostService.findById(req.params.id);

  if (!post) {
    res.status(404).json("Post not found");
  }

  if (!body.title) {
    res.status(400).json("Title missing from request body");
  }

  if (!body.content) {
    res.status(400).json("Content missing from request body");
  }

  if (!body.published) {
    res.status(400).json("Published status missing from request body");
  }

  const updated = await PostService.updateById(
    post?.id,
    body.title,
    body.content,
    body.published
  );

  if (updated) {
    res.status(200).json(post);
  } else {
    res.status(500).json("Post could not be updated");
  }
});

export default router;
