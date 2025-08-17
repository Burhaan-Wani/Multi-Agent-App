import axiosInstance from "@/lib/axios";
import { create } from "zustand";

type State = {
    user: {
        _id: string;
        provider: "GITHUB" | "GOOGLE" | "EMAIL";
        providerId: string;
        name: string;
        email: string;
        avatar?: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    } | null;
    loading: boolean;
    error: string;
};

type Actions = {
    setUser: (user: State["user"]) => void;
    setLoading: (value: boolean) => void;
    setError: (value: string) => void;
    logout: () => Promise<void>;
};
export const useAuthStore = create<State & Actions>(set => ({
    user: null,
    loading: false,
    error: "",
    setLoading: value => set({ loading: value }),
    setError: value => set({ error: value }),
    setUser: user => set({ user: user }),
    logout: async () => {
        await axiosInstance.post(
            "/auth/logout",
            {},
            {
                withCredentials: true,
            }
        );
        set({ user: null });
    },
}));
