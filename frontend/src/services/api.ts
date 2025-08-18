import {
    EvaluationHistoryResponse,
    EvaluateRequest,
    EvaluateResponse,
    AgentResponse,
    improvedResponse,
    SingleEvaluationApiResponse,
} from "../types/evaluation";
import axiosInstance from "@/lib/axios";

export async function submitPeerEvaluation(data: EvaluateRequest) {
    const res = await axiosInstance.post<EvaluateResponse>(
        "/evaluations",
        data
    );
    console.log(res.data.data);
    return res.data;
}

// Fetch paginated evaluation history
export async function getEvaluationHistory(page = 1, limit = 10) {
    const res = await axiosInstance.get<EvaluationHistoryResponse>(
        `/evaluations/history?page=${page}&limit=${limit}`,
        {
            withCredentials: true,
        }
    );
    return res.data;
}

export async function improveResponse(
    query: string,
    bestResponse: AgentResponse
): Promise<improvedResponse> {
    const response = await axiosInstance.post<improvedResponse>(
        "/evaluations/improve",
        { query, bestResponse },
        { withCredentials: true }
    );
    return response.data;
}

export const getEvaluationById = async (
    id: string
): Promise<SingleEvaluationApiResponse> => {
    const response = await axiosInstance.get<SingleEvaluationApiResponse>(
        `/evaluations/${id}`,
        {
            withCredentials: true,
        }
    );
    return response.data;
};
