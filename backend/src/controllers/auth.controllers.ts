import passport from "passport";
import { providerEnum } from "../enums/providerEnum.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res, next) => {
    console.log("hi");
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("User with this email already exists", 400));
    }

    await User.create({
        provider: providerEnum.EMAIL,
        providerId: email,
        name,
        email,
        password,
    });

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
    });
});

export const login = asyncHandler(async (req, res, next) => {
    passport.authenticate(
        "local",
        (
            err: Error | null,
            user: Express.User | false,
            info: { message: string } | undefined
        ) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log("1");
                return res.status(400).json({
                    status: "fail",
                    message: info?.message || "Invalide email or password",
                });
            }
            req.logIn(user, err => {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({
                    status: "success",
                    message: "User logged In successfully",
                    data: { user },
                });
            });
        }
    )(req, res, next);
});

export const logout = asyncHandler((req, res, next) => {
    req.logOut(err => {
        if (err) {
            return next(new AppError("Failed to logout.", 400));
        }
    });
    req.session = null;
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
});

export const me = asyncHandler(async (req, res, next) => {
    const user = req.user.omitPassword();
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});
