import express from "express";
import {
    getEvaluationHistory,
    submitPeerEvaluation,
} from "../controllers/evaluation.controllers.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);
router.post("/", submitPeerEvaluation);
router.get("/history", getEvaluationHistory);

export default router;
