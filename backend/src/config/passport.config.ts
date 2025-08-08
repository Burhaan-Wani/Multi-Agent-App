import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";

import User, { UserDocument } from "../models/user.model.js";
import { providerEnum } from "../enums/providerEnum.js";
import config from "./app.config.js";
import AppError from "../utils/AppError.js";

passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password", session: true },
        async (email, password, done) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePasswords(password))) {
                throw new AppError("Email or Password is incorrect", 400);
            }
            done(null, user.omitPassword());
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            const { sub: googleId, email, picture } = profile._json;
            let user = await User.findOne({
                provider: providerEnum.GOOGLE,
                providerId: googleId,
            });
            if (!user) {
                user = await User.create({
                    providerId: googleId,
                    provider: providerEnum.GOOGLE,
                    name: profile.displayName,
                    email,
                    avatar: picture ?? "",
                });
            }
            return done(null, user);
        }
    )
);

passport.use(
    new GithubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL,
            scope: ["user:email"],
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: (error: any, user: Express.User | false) => void
        ) => {
            let user = await User.findOne({
                provider: providerEnum.GITHUB,
                providerId: profile.id,
            });
            if (!user) {
                user = await User.create({
                    provider: providerEnum.GITHUB,
                    providerId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0].value ?? "",
                    avatar: profile.photos?.[0].value ?? "",
                });
            }
            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => done(null, (user as UserDocument)._id));

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
