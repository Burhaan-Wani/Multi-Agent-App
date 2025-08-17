// src/pages/EvaluationDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getEvaluationById } from "../services/api";
import { EvaluateResponse } from "../types/evaluation"; // We still need this for the component prop
import EvalResult from "../components/EvalResult";

export default function EvaluationDetail() {
    const { id } = useParams<{ id: string }>();
    const [evaluation, setEvaluation] = useState<EvaluateResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getEvaluationById(id)
            .then(response => {
                const evalRecord = response.data.evaluation;

                // --- FIX IS HERE ---
                // We transform the new API response shape into the shape
                // that the EvalResult component is designed to accept.
                const formattedForComponent: EvaluateResponse = {
                    status: "success",
                    data: {
                        query: evalRecord.query,
                        responses: evalRecord.agentResponses,
                        leaderboard: evalRecord.finalRanking,
                        bestResponse: evalRecord.finalRanking[0] || null,
                        metrics: evalRecord.metrics,
                        // Add dummy values for any other required fields
                        peerEvaluations: {},
                        dbRecordId: evalRecord._id,
                    },
                };
                setEvaluation(formattedForComponent);
            })
            .catch(() => setError("Failed to load evaluation details."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        // ... (loading state is unchanged)
    }

    if (error) {
        // ... (error state is unchanged)
    }

    if (!evaluation) {
        return null;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Evaluation Details
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    A snapshot of the evaluation for the query: "
                    {evaluation.data.query}"
                </p>
            </div>

            <EvalResult
                result={evaluation}
                metrics={evaluation.data.metrics || []}
                isReadOnly={true}
            />
        </div>
    );
}
