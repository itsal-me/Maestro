import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="maestro-theme">
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
);
