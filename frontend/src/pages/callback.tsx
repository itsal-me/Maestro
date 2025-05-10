"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { apiService } from "@/lib/api";
import { Music, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function CallbackPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState<string | null>(null);
    const [stage, setStage] = useState<
        | "connecting"
        | "authenticating"
        | "loading_profile"
        | "error"
        | "success"
    >("connecting");

    useEffect(() => {
        const processCallback = async () => {
            try {
                setStage("connecting");
                const code = new URLSearchParams(location.search).get("code");

                if (!code) {
                    setStage("error");
                    throw new Error("Authorization code not found");
                }

                setStage("authenticating");
                const response = await apiService.handleCallback(code);

                if (response.data.error) {
                    setStage("error");
                    throw new Error(response.data.error);
                }

                setStage("loading_profile");
                const { user_id, spotify_id, access_token, token_expires } =
                    response.data;

                // Store user data in localStorage
                const userData = {
                    id: user_id,
                    spotify_id,
                    access_token,
                    token_expires,
                };

                localStorage.setItem("maestro_user", JSON.stringify(userData));

                // Show success state briefly before redirecting
                setStage("success");

                toast("Welcome to Maestro!");

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } catch (error) {
                console.error("Callback error:", error);
                setStage("error");
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to authenticate with Spotify"
                );

                toast(
                    error instanceof Error
                        ? error.message
                        : "Failed to authenticate with Spotify"
                );

                // Auto-redirect after 5 seconds on error
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            }
        };

        processCallback();
    }, [location, navigate]);

    const stageMessages = {
        connecting: "Establishing connection to Spotify...",
        authenticating: "Authenticating your account...",
        loading_profile: "Loading your profile data...",
        success: "Authentication successful!",
        error: "Authentication failed",
    };

    const stageIcons = {
        connecting: (
            <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
        ),
        authenticating: (
            <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
        ),
        loading_profile: (
            <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
        ),
        success: <CheckCircle className="h-8 w-8 text-spotify-green" />,
        error: <XCircle className="h-8 w-8 text-destructive" />,
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-zinc-900 p-4">
            <Card className="w-full max-w-md p-8 space-y-8 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-spotify-green rounded-full p-3 mb-4">
                        <Music className="h-8 w-8 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        Spotify Authentication
                    </h1>
                </div>

                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
                    <div className="flex justify-center mb-2">
                        {stageIcons[stage]}
                    </div>
                    <p className="text-lg font-medium text-white">
                        {stageMessages[stage]}
                    </p>

                    {stage === "error" && error && (
                        <div className="mt-4 text-center">
                            <p className="text-destructive mb-2">{error}</p>
                            <p className="text-sm text-zinc-400">
                                Redirecting to login page in 5 seconds...
                            </p>
                        </div>
                    )}

                    {stage === "success" && (
                        <div className="mt-4 text-center">
                            <p className="text-spotify-green mb-2">
                                Successfully authenticated with Spotify!
                            </p>
                            <p className="text-sm text-zinc-400">
                                Redirecting to dashboard...
                            </p>
                        </div>
                    )}

                    {(stage === "connecting" ||
                        stage === "authenticating" ||
                        stage === "loading_profile") && (
                        <div className="flex space-x-2 mt-4">
                            <div className="h-2 w-2 bg-spotify-green rounded-full animate-pulse"></div>
                            <div className="h-2 w-2 bg-spotify-green rounded-full animate-pulse delay-150"></div>
                            <div className="h-2 w-2 bg-spotify-green rounded-full animate-pulse delay-300"></div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
