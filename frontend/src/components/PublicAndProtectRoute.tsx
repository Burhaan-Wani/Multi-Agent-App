import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react"; // Changed to Loader2 for consistency
import { ReactNode } from "react";
import { Navigate } from "react-router";

const ThemedLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
    </div>
);

const ProtectRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuthStore(state => state);

    if (loading) {
        return <ThemedLoader />;
    }

    if (user === null) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};

export default ProtectRoute;

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuthStore(state => state);

    if (loading) {
        return <ThemedLoader />;
    }

    return user ? <Navigate to={"/"} /> : <>{children}</>;
};

export { PublicRoute, ProtectRoute };
