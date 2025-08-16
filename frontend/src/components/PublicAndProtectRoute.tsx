import { useAuthStore } from "@/store/authStore";
import { Loader } from "lucide-react";
import { ReactNode } from "react";
import { Navigate } from "react-router";

const ProtectRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuthStore(state => state);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }
    if (!user) {
        <Navigate to={"/auth"} replace />;
    }

    return <>{children}</>;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuthStore(state => state);
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }
    return user ? <Navigate to={"/"} /> : <>{children}</>;
};
export { PublicRoute, ProtectRoute };
