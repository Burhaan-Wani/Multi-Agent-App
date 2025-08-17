import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import AppError from "./AppError.js";

const uploadToCloudinary = async (filePath: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(filePath); // delete local file after upload

        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (fsErr: unknown) {
            if (fsErr instanceof Error)
                console.warn("⚠️ Failed to delete local file:", fsErr.message);
        }

        // Use AppError instead of generic Error
        throw new AppError("Failed to upload file to Cloudinary", 500);
    }
};

export default uploadToCloudinary;
