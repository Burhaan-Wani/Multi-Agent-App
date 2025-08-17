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
    updateAvatar: (file: File) => Promise<void>;
    updateProfile: (
        data: Pick<NonNullable<State["user"]>, "name" | "email">
    ) => Promise<void>;
    updatePassword: (data: {
        currentPassword: string;
        newPassword: string;
    }) => Promise<void>;
};
export const useAuthStore = create<State & Actions>(set => ({
    user: null,
    loading: false,
    error: "",
    setLoading: value => set({ loading: value }),
    setError: value => set({ error: value }),
    setUser: user => set({ user: user }),
    logout: async () => {
        set({ loading: true });
        await axiosInstance.post(
            "/auth/logout",
            {},
            {
                withCredentials: true,
            }
        );
        set({ user: null });
        set({ loading: false });
    },
    updateAvatar: async file => {
        const formData = new FormData();
        formData.append("avatar", file);
        const res = await axiosInstance.post("/user/upload", formData, {
            withCredentials: true,
        });

        set({ user: res.data.data.user });
    },
    updateProfile: async data => {
        const res = await axiosInstance.post("/user/update-profile", data, {
            withCredentials: true,
        });

        set({ user: res.data.data.user });
    },
    updatePassword: async data => {
        await axiosInstance.post("/user/update-password", data, {
            withCredentials: true,
        });
    },
}));
