import { peerEvaluateLLMResponses } from "../agents/evaluatorAgents.js";
import { runAllLLMAgents } from "../agents/llmAgentRunner.js";
import EvaluationModel from "../models/Evaluation.model.js";
import Metric, { IMetric } from "../models/metric.model.js";
import {
    callDeepSeek,
    callGeminiFlash,
    callGeminiPro,
} from "../services/llmServices.js";
import { aggregatePeerScores } from "../utils/aggregatePeerScores.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitPeerEvaluation = asyncHandler(async (req, res, next) => {
    const { query, metrics } = req.body;
    const userId = req.user._id;

    if (!query || !metrics) {
        return next(new AppError("Query and metrics are required", 400));
    }

    // 1. Generate one response per LLM
    const agentResponses = await runAllLLMAgents(query);

    // 2. Peer evaluate - each LLM evaluates other's answers
    const peerEvaluations = await peerEvaluateLLMResponses(
        query,
        agentResponses,
        metrics
    );

    // 3. Aggregate peer scores into final ranking
    const leaderboard = aggregatePeerScores(peerEvaluations, agentResponses);
    const bestResponse = leaderboard[0] || null;

    // 4. Store in DB
    const metricDocs: IMetric[] = metrics.map((m: any) => new Metric(m));
    const evalDoc = await EvaluationModel.create({
        user: userId,
        query,
        agentResponses,
        agentEvaluations: peerEvaluations,
        metrics: metricDocs,
        finalRanking: leaderboard,
        createdAt: new Date(),
    });
    res.status(201).json({
        status: "success",
        data: {
            query,
            responses: agentResponses,
            peerEvaluations,
            leaderboard,
            bestResponse,
            dbRecordId: evalDoc._id,
        },
    });
});

export const getEvaluationHistory = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    // pagination params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Query evaluations for this user, sorted by most recent
    const evaluations = await EvaluationModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("query createdAt finalRanking agentResponses")
        .exec();

    const totalCount = await EvaluationModel.countDocuments({ user: userId });

    res.status(200).json({
        status: "success",
        data: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            evaluations,
        },
    });
});

export const improveBestResponse = asyncHandler(async (req, res, next) => {
    const { query, bestResponse } = req.body;
    if (!query || !bestResponse) {
        return next(new AppError("Query and bestResponse are required", 400));
    }

    const prompt = `
The user asked: "${query}".

The current best response is:
"${bestResponse.response}"

Can you suggest improvements—make it more accurate, clear, and helpful—while maintaining the original intent?
Only output the improved response text.
    `.trim();

    let improvedText = await callGeminiFlash(
        "gemini-2.5-pro",
        "You are an expert assistant improving responses.",
        prompt
    );

    res.status(200).json({
        status: "success",
        data: {
            improvedResponse: improvedText.trim(),
        },
    });
});
