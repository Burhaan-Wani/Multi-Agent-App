import { Routes, Route } from "react-router";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import axiosInstance from "./lib/axios";
import { ProtectRoute, PublicRoute } from "./components/PublicAndProtectRoute";
import Home from "./pages/Home";
import History from "./pages/History";
import Layout from "./layouts/Layout";
import Profile from "./pages/Profile";
import EvaluationDetail from "./pages/EvaluationDetail";

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
                    element={
                        <ProtectRoute>
                            <Layout />
                        </ProtectRoute>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/my-profile" element={<Profile />} />
                    <Route path="/history/:id" element={<EvaluationDetail />} />
                </Route>
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
