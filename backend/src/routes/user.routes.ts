import express from "express";
import {
    updatePassword,
    updateProfile,
    uploadImage,
} from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.use(isAuthenticated);
router.post("/upload", upload.single("avatar"), uploadImage);
router.post("/update-profile", updateProfile);
router.post("/update-password", updatePassword);

export default router;
