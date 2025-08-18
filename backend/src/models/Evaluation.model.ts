// models/Evaluation.ts

import mongoose, { Schema, Document, Types } from "mongoose";
import { IMetric } from "./metric.model.js";

interface AgentResponse {
    agentName: string;
    provider: string;
    model: string;
    response: string;
}

interface EvaluationScore {
    [metricName: string]: {
        score: number;
        rationale: string;
    };
}

interface AgentEvaluationResult {
    scores: EvaluationScore;
    totalScore: number;
    rank: number;
}

export interface IFinalRanking {
    agentName: string;
    provider: string;
    totalScore: number;
    averageScore: number;
    numJudges: number;
}

export interface IEvaluation extends Document {
    user: Types.ObjectId;
    query: string;
    agentResponses: AgentResponse[];
    agentEvaluations: {
        [providerName: string]: { [agentName: string]: AgentEvaluationResult };
    };
    metrics: Types.DocumentArray<IMetric>;
    finalRanking?: IFinalRanking[];
    createdAt: Date;
}

const AgentResponseSchema = new Schema<AgentResponse>({
    agentName: { type: String, required: true },
    provider: { type: String, required: true },
    model: { type: String, required: true },
    response: { type: String, required: true },
});

const EvaluationScoreSchema = new Schema(
    {
        score: { type: Number, required: true },
        rationale: { type: String, required: true },
    },
    { _id: false }
);

const AgentEvaluationResultSchema = new Schema(
    {
        scores: { type: Map, of: EvaluationScoreSchema, required: true },
        totalScore: { type: Number, required: true },
        rank: { type: Number, required: true },
    },
    { _id: false }
);

const FinalRankingSchema = new Schema<IFinalRanking>(
    {
        agentName: { type: String, required: true },
        provider: { type: String, required: true },
        totalScore: { type: Number, required: true },
        averageScore: { type: Number, required: true },
        numJudges: { type: Number, required: true },
    },
    { _id: false }
);

const EvaluationSchema: Schema<IEvaluation> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    query: { type: String, required: true },
    agentResponses: { type: [AgentResponseSchema], required: true },

    // --- CORRECTED SCHEMA DEFINITION ---
    agentEvaluations: {
        type: Map, // Outer map: Keys are provider names (strings)
        of: {
            // The value of each provider is another Map
            type: Map,
            of: AgentEvaluationResultSchema, // The inner map's value is the result schema
        },
        required: true,
    },
    // ------------------------------------

    metrics: { type: [Schema.Types.Mixed], required: true },
    finalRanking: { type: [FinalRankingSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IEvaluation>("Evaluation", EvaluationSchema);
