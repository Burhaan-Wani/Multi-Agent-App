import express from "express";
import {
    getEvaluationById,
    getEvaluationHistory,
    improveBestResponse,
    submitPeerEvaluation,
} from "../controllers/evaluation.controllers.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);
router.post("/", submitPeerEvaluation);
router.post("/improve", improveBestResponse);
router.get("/history", getEvaluationHistory);
router.get("/:id", getEvaluationById);

export default router;
