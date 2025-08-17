// src/pages/History.tsx
import { useEffect, useState } from "react";
import { getEvaluationHistory } from "../services/api";
import { EvaluationHistoryResponse } from "../types/evaluation";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, FileText, Inbox } from "lucide-react";

// A dedicated loading component for a better initial state
const HistorySkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className="h-16 w-full rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
        ))}
    </div>
);

export default function History() {
    const [history, setHistory] = useState<EvaluationHistoryResponse | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        getEvaluationHistory(page, 10)
            .then(setHistory)
            .finally(() => setLoading(false));
    }, [page]);

    const PaginationControls = () => (
        <div className="flex items-center justify-end space-x-4 pt-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {history?.data.page} of {history?.data.totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!history || page >= history.data.totalPages}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-5 space-y-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="font-bold">
                        Past Evaluations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading && !history ? (
                        <HistorySkeleton />
                    ) : !history || history.data.evaluations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 py-16">
                            <Inbox className="h-16 w-16 mb-4" />
                            <h3 className="text-xl font-semibold">
                                No History Found
                            </h3>
                            <p>
                                Run a new evaluation to see your history here.
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50%]">
                                            Query
                                        </TableHead>
                                        <TableHead>Winner</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.data.evaluations.map(ev => (
                                        <TableRow key={ev._id}>
                                            <TableCell className="font-medium truncate max-w-sm">
                                                {ev.query}
                                            </TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-300">
                                                {ev.finalRanking?.[0]
                                                    ?.agentName ?? "N/A"}
                                            </TableCell>
                                            <TableCell className="text-slate-500 dark:text-slate-400">
                                                {new Date(
                                                    ev.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link
                                                        to={`/history/${ev._id}`}
                                                    >
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Details
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <PaginationControls />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
