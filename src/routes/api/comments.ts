import express from "express";
import passport from "passport";
import LikeService from "../../services/like";
import CommentService from "../../services/comment";
import { User } from "../../types";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const comment = await CommentService.findByIdAndReturnUser(req.params.id);
  if (comment) {
    res.status(200).json(comment);
  } else {
    res.status(404).json("Comment not found");
  }
});

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const comment = await CommentService.findByIdAndReturnUser(req.params.id);

    if (!comment) {
      res.status(404).json("Comment not found").end();
    }
    //@ts-ignore
    if (comment.user._id !== user._id && user.userType !== "ADMIN") {
      res.status(403).json("Not authorized").end();
    }

    const deleted = await CommentService.deleteById(req.params.id);

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
    const comment = await CommentService.findByIdAndReturnUser(req.params.id);

    if (!comment) {
      res.status(404).json("Comment not found").end();
    }
    //@ts-ignore
    if (comment.user._id !== user._id && user.userType !== "ADMIN") {
      res.status(403).json("Not authorized").end();
    }

    if (!body.content) {
      res.status(400).json("Content missing from request body").end();
    }

    const updated = await CommentService.updateById(
      req.params.id,
      body.content
    );

    if (updated) {
      res.status(200).json(comment);
    } else {
      res.status(500).json("Comment could not be updated");
    }
  }
);

router.get("/:id/likes", async (req, res) => {
  const comment = await CommentService.findById(req.params.id);

  if (!comment) {
    res.status(404).json("Comment not found").end();
  }

  const likes = await LikeService.findAllByAnyId(req.params.id);

  if (likes) {
    res.status(200).json(likes);
  } else {
    res.status(404).json("Comment has no likes");
  }
});

router.post(
  "/:id/likes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const user = req.user as User;

    if (body.like) {
      const like = await LikeService.increment(
        req.params.id,
        user._id.toString()
      );
      if (like) {
        res.status(200).json("Like added to comment");
      }
    } else if (body.dislike) {
      const like = await LikeService.decrement(
        req.params.id,
        user._id.toString()
      );
      if (like) {
        res.status(204).json("Like removed from comment");
      }
    }
  }
);

router.get("/:id/responses", async (req, res) => {
  const comment = await CommentService.findById(req.params.id);

  if (!comment) {
    res.status(404).json("Comment not found").end();
  }

  const responses = await CommentService.findAllBySuperAnyId(req.params.id);

  if (responses) {
    res.status(200).json(responses);
  } else {
    res.status(404).json("Comment has no responses");
  }
});

router.post(
  "/:id/responses",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const comment = await CommentService.findById(req.params.id);
    const user = req.user as User;

    if (!comment) {
      res.status(404).json("Comment not found").end();
    }

    if (!body.content) {
      res.status(400).json("Content missing from request body").end();
    }

    if (!body.superParent) {
      res.status(400).json("Super parent ID missing from request body").end();
    }

    const response = await CommentService.create(
      body.content,
      user._id.toString(),
      req.params.id,
      body.parent
    );

    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json("Response could not be created");
    }
  }
);

export default router;
