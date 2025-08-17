// src/components/Layout.tsx
import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, LogOut, User, Moon, Sun } from "lucide-react";

export default function Layout() {
    const { user, logout } = useAuthStore();
    const { setTheme, theme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
            <header className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur z-10">
                <div className="grid grid-cols-3 items-center px-4 py-3">
                    {/* Left Section: Logo */}
                    <div className="justify-self-start flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                            <Bot size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            PeerEval
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

            {/* FIX: Added custom scrollbar classes to the main content area */}
            <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <Outlet />
            </main>
        </div>
    );
}
