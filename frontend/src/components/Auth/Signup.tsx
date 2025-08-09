import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
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
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import GoogleOrGitHub from "./GoogleOrGitHub";

interface IFormData {
    name?: string;
    email?: string;
    password?: string;
}
const Signup = () => {
    const [formData, setFormData] = useState<IFormData | null>({
        name: "",
        email: "",
        password: "",
    });
    const { loading, error, setLoading, setError } = useAuthStore(
        state => state
    );

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError("");
    };

    const register = async function () {
        try {
            setError("");
            setLoading(true);
            const res = await axiosInstance.post("/auth/register", formData, {
                withCredentials: true,
            });
            if (res.data.status === "success") {
                toast("Registration successful");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                });
            }
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof AxiosError) {
                setError(error?.response?.data.message);
            } else if (error instanceof Error) {
                console.log("Unknown Error", error);
                setError(error?.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Card className="w-[400px] flex flex-col gap-4">
                <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                    <CardTitle className="text-2xl font-bold">
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-1xl">
                        Enter your email below to create you account
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <GoogleOrGitHub />
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card text-muted-foreground px-2">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                        >
                            Name
                        </Label>
                        <Input
                            value={formData?.name}
                            onChange={handleFormChange}
                            name="name"
                            className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                            type="text"
                            placeholder="John Doe"
                            id="name"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="email-create-account"
                            className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                        >
                            Email
                        </Label>
                        <Input
                            value={formData?.email}
                            onChange={handleFormChange}
                            name="email"
                            className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                            type="email"
                            placeholder="johndoe@gmail.com"
                            id="email-create-account"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="password"
                            className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                        >
                            Password
                        </Label>
                        <Input
                            value={formData?.password}
                            onChange={handleFormChange}
                            name="password"
                            className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                            type="password"
                            placeholder="*********"
                            id="password"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </CardContent>
                <CardFooter className="flex items-center [.border-t]:pt-6">
                    <Button
                        disabled={loading}
                        onClick={register}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full"
                    >
                        {loading && <Loader className="animate-spin" />}
                        {loading ? "Creating..." : "Create account"}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default Signup;
