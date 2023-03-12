import express from "express";
import passport from "passport";
import LikeService from "../../services/like";
import PostService from "../../services/post";
import { User } from "../../types";

const router = express.Router();

router.get("/", async (_req, res) => {
  const posts = await PostService.findAll();
  if (posts.length > 0) {
    return res.status(200).json(posts);
  } else {
    res.status(404).json("Posts not found");
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const user = req.user as User;

    if (!body.title) {
      return res.status(400).json("Title missing from request body");
    }

    if (!body.content) {
      return res.status(400).json("Content missing from request body");
    }

    if (typeof body.published === "undefined") {
      return res.status(400).json("Published status missing from request body");
    }

    const post = await PostService.create(
      body.title,
      body.content,
      body.published,
      user._id.toString()
    );

    if (post) {
      return res.status(201).json(post);
    } else {
      res.status(500).json("Post could not be created");
    }
  }
);

router.get("/:id/public", async (req, res) => {
  const post = await PostService.findPublishedByIdAndReturnUser(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json("Post not found");
  }
});

router.get(
  "/:id/protected",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;

    const post = await PostService.findByIdAndReturnUser(req.params.id);

    if (!post) {
      return res.status(404).json("Post not found");
    }

    //@ts-ignore
    if (
      post.user._id.toString() !== user._id.toString() &&
      user.userType !== "ADMIN"
    ) {
      const post = await PostService.findPublishedByIdAndReturnUser(req.params.id);
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json("Post not found");
      }
    }

    if (post) {
      res.status(200).json(post);
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const post = await PostService.findByIdAndReturnUser(req.params.id);

    if (!post) {
      return res.status(404).json("Post not found");
    }
    //@ts-ignore
    if (
      post.user._id.toString() !== user._id.toString() &&
      user.userType !== "ADMIN"
    ) {
      return res.status(403).json("Not authorized");
    }

    const deleted = await PostService.deleteById(req.params.id);

    if (deleted) {
      res.status(204).end();
    }
  }
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const user = req.user as User;
    const post = await PostService.findByIdAndReturnUser(req.params.id);

    if (!post) {
      return res.status(404).json("Post not found");
    }
    //@ts-ignore
    if (
      post.user._id.toString() !== user._id.toString() &&
      user.userType !== "ADMIN"
    ) {
      return res.status(403).json("Not authorized");
    }

    if (!body.title) {
      return res.status(400).json("Title missing from request body");
    }

    if (!body.content) {
      return res.status(400).json("Content missing from request body");
    }

    if (typeof body.published === "undefined") {
      return res.status(400).json("Published status missing from request body");
    }

    const updated = await PostService.updateById(
      post?.id,
      body.title,
      body.content,
      body.published
    );

    if (updated) {
      return res.status(200).json(post);
    } else {
      res.status(500).json("Post could not be updated");
    }
  }
);

router.get("/:id/likes", async (req, res) => {
  const post = await PostService.findById(req.params.id);

  if (!post) {
    return res.status(404).json("Post not found").end();
  }

  const likes = await LikeService.findAllByAnyId(req.params.id);

  if (likes) {
    return res.status(200).json(likes);
  } else {
    res.status(404).json("Post has no likes");
  }
});

router.post(
  "/:id/likes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const user = req.user as User;
    const postId = req.params.id;

    if (body.like === true) {
      const like = await LikeService.increment(postId, user._id.toString());
      if (like) {
        return res.status(200).json("Like added to post");
      }
    } else if (body.dislike === true) {
      const like = await LikeService.decrement(postId, user._id.toString());
      if (like) {
        res.status(204).json("Like removed from post");
      }
    }
  }
);

router.post("/:id/views", (req, res) => {
  const postId = req.params.id;
  const post = PostService.incrementViews(postId);

  if (post) {
    return res.status(200).json(post);
  } else {
    res.status(404).json("Post not found");
  }
});

export default router;
