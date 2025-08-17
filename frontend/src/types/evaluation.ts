/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Metric {
    name: string;
    description: string;
    weight: number;
}

export interface AgentResponse {
    agentName: string;
    provider: string;
    model: string;
    response: string;
}

export interface LeaderboardItem {
    agentName: string;
    provider: string;
    totalScore: number;
    averageScore: number;
    numJudges: number;
}

export interface EvaluateRequest {
    query: string;
    metrics: Metric[];
}

export interface EvaluateResponse {
    status: "success" | "fail" | "error";
    data: {
        query: string;
        responses: AgentResponse[];
        peerEvaluations: any;
        leaderboard: LeaderboardItem[];
        bestResponse: LeaderboardItem | null;
        dbRecordId: string;
    };
}

// For Evaluation History
export interface EvaluationHistoryResponse {
    status: "success" | "fail" | "error";
    data: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        evaluations: Array<{
            _id: string;
            query: string;
            createdAt: string;
            finalRanking: LeaderboardItem[];
            agentResponses: AgentResponse[];
            bestResponse?: LeaderboardItem;
        }>;
    };
}

export interface improvedResponse {
    status: "success";
    data: {
        improvedResponse: string;
    };
}
