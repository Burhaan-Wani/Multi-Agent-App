// src/pages/Home.tsx
import React, { useState } from "react";
import { Metric, EvaluateResponse } from "../types/evaluation";
import { submitPeerEvaluation } from "../services/api";
import { Button } from "@/components/ui/button";
import EvalResult from "../components/EvalResult";
import { useAuthStore } from "@/store/authStore";
import MetricsEditor from "../components/MetricEditor";
import { NavLink, useNavigate } from "react-router";
import {
    Loader2,
    Bot,
    LogOut,
    User,
    Sparkles,
    SlidersHorizontal,
    Moon,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Metrics } from "@/lib/constants";

export default function Home() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { setTheme, theme } = useTheme();

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

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
            {/* HEADER */}
            <header className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur z-10">
                <div className="grid grid-cols-3 items-center px-4 py-3">
                    {/* Left Section: Logo */}
                    <div className="justify-self-start flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                            <Bot size={20} />
                        </div>
                        <span className="flex flex-col text-xl font-bold tracking-tight">
                            PeerEval
                            <span className="text-xs font-medium text-muted-foreground">
                                AI Model Evaluation Platform
                            </span>
                        </span>
                    </div>

                    {/* Center Section: Navigation */}
                    <nav className="hidden md:flex items-center gap-6 justify-self-center">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`
                            }
                        >
                            New Evaluation
                        </NavLink>
                        <NavLink
                            to="/history"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`
                            }
                        >
                            History
                        </NavLink>
                    </nav>

                    {/* Right Section: User Actions */}
                    <div className="justify-self-end flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            <span className="sr-only">Toggle theme</span>
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>
                        {user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer h-9 w-9">
                                        <AvatarImage
                                            src={user.avatar ?? ""}
                                            alt={user.name ?? "User"}
                                        />
                                        <AvatarFallback>
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase() ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                                >
                                    <DropdownMenuLabel className="font-normal text-slate-600 dark:text-slate-400">
                                        Signed in as {user?.name ?? "User"}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
                                    <DropdownMenuItem
                                        onClick={() => navigate("/profile")}
                                    >
                                        <User className="mr-2 h-4 w-4" />{" "}
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />{" "}
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Layout Container */}
            <div className="flex flex-1 overflow-hidden">
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
                        <div className="flex-1 overflow-y-auto pr-2">
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
                        {result && (
                            <EvalResult result={result} metrics={metrics} />
                        )}
                        {!loading && !result && (
                            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                                <Sparkles className="h-16 w-16 mb-4" />
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-300">
                                    Welcome to PeerEval
                                </h2>
                                <p>
                                    Enter a query in the input box below to
                                    begin an evaluation.
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
        </div>
    );
}
