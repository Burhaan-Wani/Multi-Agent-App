// src/pages/Home.tsx
import React, { useState } from "react";
import { Metric, EvaluateResponse } from "../types/evaluation";
import { submitPeerEvaluation } from "../services/api";
import { Button } from "@/components/ui/button";
import EvalResult from "../components/EvalResult";
import MetricsEditor from "../components/MetricEditor";
import { Loader2, SlidersHorizontal, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Metrics } from "@/lib/constants";

export default function Home() {
    const [query, setQuery] = useState("");
    const [metrics, setMetrics] = useState<Metric[]>(Metrics);
    const [result, setResult] = useState<EvaluateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        if (!query.trim()) {
            setError("Query cannot be empty");
            setLoading(false);
            return;
        }

        try {
            const res = await submitPeerEvaluation({ query, metrics });
            setResult(res);
        } catch (err) {
            console.error(err);
            setError("Evaluation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full">
            {/* Collapsible Left Sidebar */}
            <aside
                className={`transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden ${
                    isSidebarOpen ? "w-80" : "w-0"
                }`}
            >
                <div className="p-4 h-full flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 flex-shrink-0">
                        <SlidersHorizontal /> Evaluation Metrics
                    </h2>
                    {/* --- CUSTOM SCROLLBAR ADDED HERE --- */}
                    <div className="px-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <MetricsEditor
                            metrics={metrics}
                            setMetrics={setMetrics}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content & Input Form */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Scrollable Results Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500 dark:text-slate-400">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                            <p className="text-lg">
                                Evaluating models, please wait...
                            </p>
                        </div>
                    )}
                    {result && <EvalResult result={result} metrics={metrics} />}
                    {!loading && !result && (
                        <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                            <Sparkles className="h-16 w-16 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-300">
                                Welcome to PeerEval
                            </h2>
                            <p>
                                Enter a query in the input box below to begin an
                                evaluation.
                            </p>
                        </div>
                    )}
                </main>

                {/* Sticky Input Form Footer */}
                <footer className="px-6 pb-6 pt-4 border-t border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur z-10">
                    <div className="max-w-3xl mx-auto">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3"
                        >
                            <Textarea
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Explain what is LLM?"
                                className="min-h-[80px] text-base resize-none bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                            {error && (
                                <p className="text-red-500 text-sm pl-1">
                                    {error}
                                </p>
                            )}
                            <div className="flex justify-between items-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        setIsSidebarOpen(!isSidebarOpen)
                                    }
                                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                >
                                    <SlidersHorizontal
                                        size={16}
                                        className="mr-2"
                                    />
                                    {isSidebarOpen
                                        ? "Hide Metrics"
                                        : "Edit Metrics"}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                >
                                    {loading && (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    {loading ? "Evaluating..." : "Evaluate"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </footer>
            </div>
        </div>
    );
}
