import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const uploadImage = asyncHandler(async (req, res, next) => {
    const image = await uploadToCloudinary(req.file?.path!);
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            avatar: image.url,
        },
        {
            new: true,
        }
    );
    res.status(201).json({
        status: "success",
        data: {
            user,
        },
    });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return next(new AppError("Name and Email is required", 400));
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            name,
            email,
        },
        {
            new: true,
        }
    ).select("-password");
    res.status(201).json({
        status: "success",
        data: {
            user,
        },
    });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return next(
            new AppError("Current password and new password is required", 400)
        );
    }
    let user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const isCurrentPasswordMatching = user.comparePasswords(currentPassword);
    if (!isCurrentPasswordMatching) {
        return next(new AppError("Current password is incorrect", 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(201).json({
        status: "success",
        data: {
            user: user.omitPassword(),
        },
    });
});
