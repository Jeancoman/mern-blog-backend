import express from "express";
import passport from "passport";
import LikeService from "../../services/like";
import PostService from "../../services/post";
import CommentService from "../../services/comment";
import { User } from "../../types";

const router = express.Router();

router.get("/", async (_req, res) => {
  const posts = await PostService.findAll();
  if (posts.length > 0) {
    res.status(200).json(posts);
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
      res.status(400).json("Title missing from request body").end();
    }

    if (!body.content) {
      res.status(400).json("Content missing from request body").end();
    }

    if (!body.published) {
      res.status(400).json("Published status missing from request body").end();
    }

    const post = await PostService.create(
      body.title,
      body.content,
      body.published,
      user._id.toString()
    );

    if (post) {
      res.status(201).json(post);
    } else {
      res.status(500).json("Post could not be created");
    }
  }
);

router.get("/:id", async (req, res) => {
  const post = await PostService.findByIdAndReturnUser(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json("Post not found");
  }
});

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const post = await PostService.findByIdAndReturnUser(req.params.id);

    if (!post) {
      res.status(404).json("Post not found").end();
    }
    //@ts-ignore
    if (post.user._id !== user._id && user.userType !== "ADMIN") {
      res.status(403).json("Not authorized").end();
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
      res.status(404).json("Post not found").end();
    }
    //@ts-ignore
    if (post.user._id !== user._id && user.userType !== "ADMIN") {
      res.status(403).json("Not authorized").end();
    }

    if (!body.title) {
      res.status(400).json("Title missing from request body").end();
    }

    if (!body.content) {
      res.status(400).json("Content missing from request body").end();
    }

    if (!body.published) {
      res.status(400).json("Published status missing from request body").end();
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
  }
);

router.get("/:id/likes", async (req, res) => {
  const post = await PostService.findById(req.params.id);

  if (!post) {
    res.status(404).json("Post not found").end();
  }

  const likes = await LikeService.findAllByAnyId(req.params.id);

  if (likes) {
    res.status(200).json(likes);
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

    if (body.like) {
      const like = await LikeService.increment(postId, user._id.toString());
      if (like) {
        res.status(200).json("Like added to post");
      }
    } else if (body.dislike) {
      const like = await LikeService.decrement(postId, user._id.toString());
      if (like) {
        res.status(204).json("Like removed from post");
      }
    }
  }
);

router.get("/:id/comments", async (req, res) => {
  const post = await PostService.findById(req.params.id);

  if (!post) {
    res.status(404).json("Post not found").end();
  }

  const comments = await CommentService.findAllByAnyId(req.params.id);

  if (comments) {
    res.status(200).json(comments);
  } else {
    res.status(404).json("Post has no comments");
  }
});

router.post(
  "/:id/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const post = await PostService.findById(req.params.id);
    const user = req.user as User;

    if (!post) {
      res.status(404).json("Post not found").end();
    }

    if (!body.content) {
      res.status(400).json("Content missing from request body").end();
    }

    const comment = await CommentService.create(
      body.content,
      user._id.toString(),
      req.params.id
    );

    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(500).json("Comment could not be created");
    }
  }
);

export default router;
