import {
    EvaluationHistoryResponse,
    EvaluateRequest,
    EvaluateResponse,
} from "../types/evaluation";
import axiosInstance from "@/lib/axios";

export async function submitPeerEvaluation(data: EvaluateRequest) {
    const res = await axiosInstance.post<EvaluateResponse>(
        "/evaluations",
        data
    );
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
