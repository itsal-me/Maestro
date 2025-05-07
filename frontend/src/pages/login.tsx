"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export default function LoginPage() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <div className="w-full max-w-md p-8 space-y-8 rounded-lg border bg-card text-card-foreground">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Music className="h-12 w-12 text-primary" />
                    <h1 className="text-2xl font-bold">Welcome to Maestro</h1>
                    <p className="text-sm text-muted-foreground">
                        Connect with Spotify to discover your music personality
                        and get AI-generated playlists.
                    </p>
                </div>
                <Button className="w-full" size="lg" onClick={login}>
                    Login with Spotify
                </Button>
            </div>
        </div>
    );
}
