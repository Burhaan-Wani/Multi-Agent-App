import { useState, FC, ReactNode } from "react";
import { AgentResponse } from "@/types/evaluation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { improveResponse } from "@/services/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    prism,
    tomorrow,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

// Custom component to render code blocks with a header and copy button
const CodeBlock: FC<{ className?: string; children?: ReactNode }> = ({
    className,
    children,
}) => {
    const { theme } = useTheme();
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    };

    if (!match) {
        // For inline code, use a simpler style
        return (
            <code className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded px-1 py-0.5 font-mono text-xs">
                {children}
            </code>
        );
    }

    return (
        <div className="relative my-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-t-md">
                <span className="text-xs font-sans text-slate-500 dark:text-slate-400">
                    {match[1]}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8"
                >
                    {isCopied ? (
                        <Check className="h-4 w-4 text-green-400" />
                    ) : (
                        <Copy className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    )}
                </Button>
            </div>
            <div className="p-4 overflow-x-auto">
                <SyntaxHighlighter
                    style={theme === "dark" ? tomorrow : prism}
                    language={match[1]}
                    PreTag="div"
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

type Props = {
    response: AgentResponse & { responseTime: string; tokens: number };
    isBestResponse: boolean;
    query: string;
    isReadOnly: boolean;
};

export default function ModelResponseCard({
    response,
    isBestResponse,
    query,
    isReadOnly,
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
            <CardContent className="prose prose-base lg:prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // We only override the 'code' component for syntax highlighting
                        code: CodeBlock,
                    }}
                >
                    {response.response}
                </ReactMarkdown>

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
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{ code: CodeBlock }}
                        >
                            {improvedResponse}
                        </ReactMarkdown>
                    </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 not-prose">
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
                    {!isReadOnly && isBestResponse && (
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
