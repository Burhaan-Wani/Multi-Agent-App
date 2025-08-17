import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider attribute={"class"} defaultTheme="system">
                <App />
                <Toaster />
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
);
