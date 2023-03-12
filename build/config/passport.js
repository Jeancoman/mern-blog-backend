import passport from "passport";
import bcrypt from "bcrypt";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UserService from "../services/user.js";
import { SECRET_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./env.js";
import logger from "../utils/logger.js";
import { generateFromEmail } from "unique-username-generator";
passport.use("local-signup", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    session: false,
}, async (username, password, done) => {
    try {
        const userExists = await UserService.findByUserName(username);
        if (userExists) {
            return done(null, false);
        }
        const user = await UserService.createWithPassword(username, password);
        return done(null, user);
    }
    catch (error) {
        logger.error(error);
        return done(error, false);
    }
}));
passport.use("local-login", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    session: false,
}, async (username, password, done) => {
    try {
        const user = await UserService.findByUserName(username);
        if (!user) {
            return done(null, false);
        }
        if (user.password) {
            const correctPassword = await bcrypt.compare(password, user.password);
            if (correctPassword) {
                return done(null, user);
            }
        }
        return done(null, false);
    }
    catch (error) {
        logger.error(error);
        return done(error, false);
    }
}));
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: SECRET_KEY,
}, async (jwtPayload, done) => {
    try {
        const user = jwtPayload.user;
        return done(null, user);
    }
    catch (error) {
        logger.error(error);
        return done(error, false);
    }
}));
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/redirect",
    passReqToCallback: true,
}, async (_req, _accessToken, _refreshToken, profile, done) => {
    try {
        const username = generateFromEmail(profile.emails[0].value);
        const userExists = await UserService.findByUserName(username);
        if (userExists) {
            return done(null, userExists);
        }
        const user = await UserService.createWithOAuth2(username, profile.displayName, profile.picture);
        return done(null, user);
    }
    catch (error) {
        logger.error(error);
        return done(error, false);
    }
}));
