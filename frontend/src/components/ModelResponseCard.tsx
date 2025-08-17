// src/components/ModelResponseCard.tsx
import { useState } from "react";
import { AgentResponse } from "@/types/evaluation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Sparkles, Loader2 } from "lucide-react";
import { improveResponse } from "@/services/api";
import { toast } from "sonner";

type Props = {
    response: AgentResponse & { responseTime: string; tokens: number };
    isBestResponse: boolean;
    query: string;
};

export default function ModelResponseCard({
    response,
    isBestResponse,
    query,
}: Props) {
    const [improvedResponse, setImprovedResponse] = useState<string | null>(
        null
    );
    const [isImproving, setIsImproving] = useState(false);

    const handleImproveClick = async () => {
        setIsImproving(true);
        setImprovedResponse(null);
        try {
            const res = await improveResponse(query, response);
            console.log(res);
            setImprovedResponse(res.data.improvedResponse);
        } catch (error) {
            console.log(error);
            toast.error("Failed to generate improvement. Please try again.");
        } finally {
            setIsImproving(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                        {response.agentName}
                    </CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {response.provider}
                    </p>
                </div>
                {isBestResponse && (
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
                    {response.response}
                </p>

                {isImproving && (
                    <div className="text-center py-6 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating improvement...</span>
                    </div>
                )}
                {improvedResponse && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <h4 className="font-semibold text-md flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                            Suggested Improvement
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {improvedResponse}
                        </p>
                    </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>Response time: {response.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText size={14} />
                            <span>Tokens: {response.tokens}</span>
                        </div>
                    </div>
                    {isBestResponse && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleImproveClick}
                            disabled={isImproving}
                        >
                            {isImproving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Improve
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
