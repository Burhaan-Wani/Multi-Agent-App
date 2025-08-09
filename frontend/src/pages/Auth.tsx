import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Auth/Login";
import Signup from "@/components/Auth/Signup";

const Auth = () => {
    return (
        <>
            <div className="flex justify-center items-center min-h-screen">
                <div>
                    <Tabs defaultValue="login" className="w-[400px]">
                        <TabsList className="w-full">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Signup</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <Login />
                        </TabsContent>
                        <TabsContent value="signup">
                            <Signup />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default Auth;
