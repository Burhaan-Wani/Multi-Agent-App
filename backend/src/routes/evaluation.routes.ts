import express from "express";
import { submitPeerEvaluation } from "../controllers/evaluation.controllers.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, submitPeerEvaluation);
export default router;
