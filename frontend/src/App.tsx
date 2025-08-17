import { Routes, Route } from "react-router";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import axiosInstance from "./lib/axios";
import { ProtectRoute, PublicRoute } from "./components/PublicAndProtectRoute";
import Home from "./pages/Home";

const App = () => {
    const { setUser, setLoading } = useAuthStore(state => state);

    useEffect(() => {
        async function fetchMe() {
            try {
                setLoading(true);
                const res = await axiosInstance.get("/auth/me", {
                    withCredentials: true,
                });

                if (res.data.status === "success") {
                    setUser(res.data.data.user);
                }
            } catch (error) {
                console.log(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, [setUser, setLoading]);

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <ProtectRoute>
                                <Home />
                            </ProtectRoute>
                        </>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <>
                            <ProtectRoute>
                                <p>Profile page</p>
                            </ProtectRoute>
                        </>
                    }
                />
                <Route
                    path="/history"
                    element={
                        <>
                            <ProtectRoute>
                                <>History page</>
                            </ProtectRoute>
                        </>
                    }
                />
                <Route
                    path="auth"
                    element={
                        <PublicRoute>
                            <Auth />
                        </PublicRoute>
                    }
                />
            </Routes>
        </>
    );
};

export default App;
