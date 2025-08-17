// src/pages/Profile.tsx
import React, { useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
    const { user, updateAvatar, updateProfile, updatePassword } =
        useAuthStore();
    const disable = !(user?.providerId === user?.email);
    const [loading, setLoading] = useState<boolean>(false);
    // Ref for the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for the image preview
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // State for the profile form
    const [profileData, setProfileData] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
    });

    // State for the password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        setLoading(true);
        await updateAvatar(avatarFile);

        toast.success("Avatar updated!");
        setAvatarPreview(null); // Clear preview after upload
        setAvatarFile(null);
        setLoading(false);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await updateProfile(profileData);
        toast.success("Profile updated!");
        setLoading(false);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const keys: (keyof typeof passwordData)[] = [
            "currentPassword",
            "newPassword",
            "confirmPassword",
        ];
        if (keys.every(key => passwordData[key] === "")) {
            toast.error("All fields are required");
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        try {
            setLoading(true);
            await updatePassword(passwordData);
            toast.success("Password updated!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.log(error);
            toast.error("Old password is required");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Account Settings
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: User Info Card with Image Upload */}
                    <div className="md:col-span-1">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardContent className="p-6 text-center">
                                <div className="relative flex justify-center mb-4 group">
                                    <Avatar className="h-24 w-24 border-2 border-slate-200 dark:border-slate-700">
                                        <AvatarImage
                                            src={
                                                avatarPreview ??
                                                user?.avatar ??
                                                ""
                                            }
                                            alt={user?.name ?? "User"}
                                        />
                                        <AvatarFallback className="text-3xl">
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase() ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        onClick={handleAvatarClick}
                                        className="w-[95px] h-[95px] left-[66px] absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <Camera className="h-8 w-8 rounded-full text-white" />
                                    </div>
                                    <Input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        accept="image/png, image/jpeg, image/gif"
                                        className="hidden"
                                    />
                                </div>
                                {avatarPreview && (
                                    <Button
                                        onClick={handleAvatarUpload}
                                        size="sm"
                                        className="cursor-pointer mb-4 bg-blue-600 hover:bg-blue-700"
                                    >
                                        {loading ? (
                                            <>
                                                <span>
                                                    <Loader className=" animate-spin" />{" "}
                                                </span>
                                                Uploading...
                                            </>
                                        ) : (
                                            "Upload Photo"
                                        )}
                                    </Button>
                                )}
                                <h2 className="text-xl font-semibold">
                                    {user?.name}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {user?.email}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Settings Forms */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue="profile">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-200 dark:bg-slate-800">
                                <TabsTrigger
                                    className="cursor-pointer"
                                    value="profile"
                                >
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger
                                    className="cursor-pointer"
                                    value="password"
                                >
                                    Password
                                </TabsTrigger>
                            </TabsList>

                            {/* Profile Tab */}
                            <TabsContent value="profile" className="mt-6">
                                <form onSubmit={handleProfileSubmit}>
                                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle>
                                                Public Profile
                                            </CardTitle>
                                            <CardDescription>
                                                Update your personal
                                                information.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Full Name
                                                </Label>
                                                <Input
                                                    disabled={disable}
                                                    id="name"
                                                    name="name"
                                                    value={profileData.name}
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    disabled={disable}
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="border-t border-slate-200 dark:border-slate-800 px-6 py-4">
                                            <Button
                                                disabled={disable}
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {loading ? (
                                                    <>
                                                        <span>
                                                            <Loader className="animate-spin" />
                                                        </span>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </TabsContent>

                            {/* Password Tab */}
                            <TabsContent value="password" className="mt-6">
                                <form onSubmit={handlePasswordSubmit}>
                                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle>
                                                Change Password
                                            </CardTitle>
                                            <CardDescription>
                                                Update your password. Make sure
                                                it's a strong one.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">
                                                    Current Password
                                                </Label>
                                                <Input
                                                    disabled={disable}
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type="password"
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">
                                                    New Password
                                                </Label>
                                                <Input
                                                    disabled={disable}
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">
                                                    Confirm New Password
                                                </Label>
                                                <Input
                                                    disabled={disable}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="border-t border-slate-200 dark:border-slate-800 px-6 py-4">
                                            <Button
                                                disabled={disable}
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {loading ? (
                                                    <>
                                                        <span>
                                                            <Loader className="animate-spin" />
                                                        </span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    "Update Password"
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
