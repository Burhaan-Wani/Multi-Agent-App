// src/pages/Login.tsx
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import GoogleOrGitHub from "./GoogleOrGitHub";
import { AxiosError } from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { loading, error, setLoading, setError, setUser } = useAuthStore();

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const login = async () => {
        try {
            setError("");
            setLoading(true);
            const res = await axiosInstance.post("/auth/login", formData, {
                withCredentials: true,
            });

            if (res.data.status === "success") {
                toast("Login successful");
                setUser(res.data.data.user);
                navigate("/");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(
                    err?.response?.data.message ||
                        "An unexpected error occurred."
                );
            } else if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                    Enter your credentials to access your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <GoogleOrGitHub />
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-300 dark:border-slate-700"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                        name="email"
                        type="email"
                        id="email-login"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input
                        name="password"
                        type="password"
                        id="password-login"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleFormChange}
                        className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={login}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loading ? "Signing In..." : "Sign In"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Login;
