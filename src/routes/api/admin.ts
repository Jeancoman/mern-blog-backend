import express from "express";
import passport from "passport";
import PostService from "../../services/post";
import { User } from "../../types";

const router = express.Router();

router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;

    if (user?.userType !== "ADMIN") {
      res.status(403).json("Not authorized");
    }

    const deleted = await PostService.deleteById(req.params.id);

    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json("Post not found");
    }
  }
);

router.patch(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const user = req.user as User;

    if (user?.userType !== "ADMIN") {
      res.status(403).json("Not authorized");
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

    const post = await PostService.updateById(
      req.params.id,
      body.title,
      body.content,
      body.published
    );

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json("Post not found");
    }
  }
);

export default router;
