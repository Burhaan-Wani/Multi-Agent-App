import express from "express";
import cors from "cors";
import session from "cookie-session";
import passport from "passport";

import "./config/passport.config.js";
import config from "./config/app.config.js";

import authRoutes from "./routes/auth.routes.js";
import { errorHandlingMiddleware } from "./middlewares/errorhandling.middleware.js";

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(
    cors({
        origin: [config.FRONTEND_URL],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);
app.use(
    session({
        name: "session",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        keys: [config.SESSION_SECRET],
        sameSite: "lax",
        secure: config.NODE_ENV === "production",
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        (req.session as Record<string, any>).regenerate = (cb: Function) =>
            cb();
    }
    if (req.session && !req.session.save) {
        (req.session as Record<string, any>).save = (cb: Function) => cb();
    }
    next();
});

// ROUTES
const BASE_PATH = config.BASE_PATH;
app.use(`${BASE_PATH}/auth`, authRoutes);

// ERROR HANDLING MIDDLEWARE
app.use(errorHandlingMiddleware);

export default app;
