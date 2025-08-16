import { peerEvaluateLLMResponses } from "../agents/evaluatorAgents.js";
import { runAllLLMAgents } from "../agents/llmAgentRunner.js";
import EvaluationModel from "../models/Evaluation.model.js";
import Metric, { IMetric } from "../models/metric.model.js";
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
