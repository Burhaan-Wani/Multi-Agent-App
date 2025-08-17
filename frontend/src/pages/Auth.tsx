import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Auth/Login";
import Signup from "@/components/Auth/Signup";
import { Bot } from "lucide-react";

const Auth = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
            <div className="flex justify-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Bot size={24} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">
                        PeerEval
                    </span>
                </div>
            </div>

            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2 bg-slate-200 dark:bg-slate-800">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-6">
                    <Login />
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                    <Signup />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Auth;
