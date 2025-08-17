// src/components/EvalResult.tsx
import {
    EvaluateResponse,
    AgentResponse,
    Metric,
    LeaderboardItem,
} from "../types/evaluation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Bot,
    Clock,
    FileText,
    Trophy,
    CheckCircle2,
    BarChart2,
    SlidersHorizontal,
} from "lucide-react";

const addMockData = (responses: AgentResponse[]) => {
    return responses.map(r => ({
        ...r,
        responseTime: (Math.random() * (1.5 - 0.5) + 0.5).toFixed(1) + "s",
        tokens: Math.floor(Math.random() * (350 - 150) + 150),
    }));
};

const LeaderboardCard = ({
    leaderboard,
}: {
    leaderboard: LeaderboardItem[];
}) => {
    const rankColors = [
        "bg-gradient-to-r from-green-500 to-emerald-500",
        "bg-slate-500 dark:bg-slate-600",
        "bg-slate-400 dark:bg-slate-700",
    ];
    return (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="text-yellow-400" />
                    Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {leaderboard.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 text-sm"
                    >
                        <div
                            className={`w-7 h-7 flex items-center justify-center rounded-md text-white font-bold ${
                                rankColors[index] ??
                                "bg-slate-300 dark:bg-slate-800"
                            }`}
                        >
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">
                                {item.agentName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.provider}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">
                                {item.totalScore.toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Avg: {item.averageScore.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const BestResponseCard = ({
    bestResponse,
}: {
    bestResponse: AgentResponse | null;
}) => {
    if (!bestResponse) return null;
    return (
        <Card className="bg-green-50 dark:bg-green-900/40 border-green-300 dark:border-green-500/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
                    <CheckCircle2 />
                    Best Response
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white">
                        {bestResponse.agentName}
                    </span>{" "}
                    from{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {bestResponse.provider}
                    </span>{" "}
                    achieved the highest average score.
                </p>
            </CardContent>
        </Card>
    );
};

const StatsCard = ({ leaderboard }: { leaderboard: LeaderboardItem[] }) => {
    const totalJudges = leaderboard[0]?.numJudges ?? 0;
    const avgScore =
        leaderboard.reduce((acc, curr) => acc + curr.averageScore, 0) /
        leaderboard.length;
    const scoreRange = { min: 9.55, max: 9.75 };
    return (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart2 className="text-slate-500 dark:text-slate-400" />
                    Evaluation Stats
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {totalJudges}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Total Judges
                        </p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {isNaN(avgScore) ? "0.00" : avgScore.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Avg Score
                        </p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">
                            Score Distribution
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{`${scoreRange.min.toFixed(
                            2
                        )} - ${scoreRange.max.toFixed(2)}`}</p>
                    </div>
                    <Progress
                        value={80}
                        className="[&>*]:bg-gradient-to-r [&>*]:from-blue-500 [&>*]:to-teal-400"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

const MetricsDisplayCard = ({ metrics }: { metrics: Metric[] }) => (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <SlidersHorizontal className="text-slate-500 dark:text-slate-400" />
                Evaluation Metrics
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {metrics.map(metric => (
                <div
                    key={metric.name}
                    className="flex justify-between items-center text-sm"
                >
                    <p className="text-slate-700 dark:text-slate-300">
                        <span className="text-blue-500 dark:text-blue-400 mr-2">
                            •
                        </span>
                        {metric.name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 font-mono">
                        {(metric.weight * 100).toFixed(0)}%
                    </p>
                </div>
            ))}
        </CardContent>
    </Card>
);

type Props = { result: EvaluateResponse; metrics: Metric[] };

export default function EvalResult({ result, metrics }: Props) {
    const responsesWithMockData = addMockData(result.data.responses);
    const bestResponseInfo = result.data.bestResponse;
    const fullBestResponse = bestResponseInfo
        ? responsesWithMockData.find(
              res => res.agentName === bestResponseInfo.agentName
          ) || null
        : null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2 space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Bot /> Model Responses
                </h2>
                {responsesWithMockData.map((r, idx) => (
                    <Card
                        key={idx}
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg"
                    >
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                                    {r.agentName}
                                </CardTitle>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {r.provider}
                                </p>
                            </div>
                            {fullBestResponse?.agentName === r.agentName && (
                                <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
                                >
                                    Best Response
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {r.response}
                            </p>
                            <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>Response time: {r.responseTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText size={14} />
                                    <span>Tokens: {r.tokens}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <aside className="xl:col-span-1 space-y-8 sticky top-8">
                <LeaderboardCard leaderboard={result.data.leaderboard} />
                <BestResponseCard bestResponse={fullBestResponse} />
                <StatsCard leaderboard={result.data.leaderboard} />
                <MetricsDisplayCard metrics={metrics} />
            </aside>
        </div>
    );
}
