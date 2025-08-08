import express from "express";
import passport from "passport";
import config from "../config/app.config.js";
import {
    login,
    logout,
    me,
    register,
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const failedGithubUrl = `${config.FRONTEND_GITHUB_CALLBACK_URL}?status=failure`;
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, me);

// GOOGLE
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: failedUrl,
    }),
    (req, res) => {
        res.redirect(config.FRONTEND_URL);
    }
);

// GITHUB
router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"],
    })
);

router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: failedGithubUrl,
    }),
    (req, res) => {
        res.redirect(config.FRONTEND_URL);
    }
);

export default router;
