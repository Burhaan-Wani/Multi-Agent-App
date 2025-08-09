import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";

const GoogleOrGitHub = () => {
    const handleGitHubLogin = async () => {
        window.location.href = `${
            import.meta.env.VITE_BACKEND_BASE_URL
        }/auth/github`;
    };
    const handleGoogleLogin = async () => {
        window.location.href = `${
            import.meta.env.VITE_BACKEND_BASE_URL
        }/auth/google`;
    };
    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                <Button
                    onClick={handleGitHubLogin}
                    className="cursor-pointer bg-white text-primary border border-primary/10 hover:bg-primary/[0.03] hover:border-1"
                >
                    <FaGithub />
                    GitHub
                </Button>
                <Button
                    onClick={handleGoogleLogin}
                    className="cursor-pointer bg-white text-primary border border-primary/10 hover:bg-primary/[0.03] hover:border-1"
                >
                    <FaGoogle />
                    Google
                </Button>
            </div>
        </>
    );
};

export default GoogleOrGitHub;
