"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Music } from "lucide-react";

export default function LoginPage() {
    const { isAuthenticated, login, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-zinc-900 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-spotify-green rounded-full p-3 mb-4">
                        <Music className="h-8 w-8 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome to Maestro
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        Connect with Spotify to discover your music personality
                    </p>
                </div>

                <Button
                    onClick={login}
                    disabled={isLoading}
                    className="w-full bg-spotify-green hover:bg-spotify-green/90 text-black font-bold py-3 rounded-full"
                >
                    {isLoading ? "Connecting..." : "Connect with Spotify"}
                </Button>

                <div className="text-center text-sm text-zinc-500">
                    <p>
                        By connecting, you allow Maestro to access your Spotify
                        data to provide personalized insights and playlists.
                    </p>
                </div>
            </div>
        </div>
    );
}
