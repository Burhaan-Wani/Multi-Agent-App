import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(
            new AppError("You are not logged in. Please login first.", 401)
        );
    }
    next();
});
