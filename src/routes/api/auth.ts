import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { FRONTEND_URL, SECRET_KEY } from "../../config/env";

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("local-signup", { session: false }),
  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);

router.post(
  "/login",
  passport.authenticate("local-login", {
    session: false
  }),
  (req, res) => {
    const user = req.user;
    // @ts-ignore
    const { password, ...other } = user._doc;
    jwt.sign({ user: other }, SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        return res.status(401).json("Login unsucessful");
      }
      res.status(200).json({
        token,
      });
    });
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
    successRedirect: FRONTEND_URL,
    failureRedirect: `${FRONTEND_URL}/login`,
  }),
  (req, res) => {
    const user = req.user;
    // @ts-ignore
    const { password, ...other } = user._doc;
    jwt.sign({ user: other }, SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        return res.status(401).json("Login unsucessful");
      }
      res.status(200).json({
        token,
      });
    });
  }
);

export default router;
