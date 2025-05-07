"use client";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function CallbackPage() {
    // const [isProcessing, setIsProcessing] = useState(true);
    const { setUserData } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const processCallback = async () => {
            try {
                const code = new URLSearchParams(location.search).get("code");

                if (!code) {
                    throw new Error("Authorization code not found");
                }

                // Call the backend callback endpoint
                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_URL
                    }/auth/spotify/callback/?code=${code}`
                );
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                // Set user data in context
                setUserData({
                    id: data.user_id,
                    spotify_id: data.spotify_id,
                    access_token: data.access_token,
                });

                toast("You have successfully connected your Spotify account.");

                navigate("/dashboard");
            } catch (error) {
                console.error("Callback error:", error);
                toast(
                    error instanceof Error
                        ? error.message
                        : "Failed to authenticate with Spotify"
                );
                navigate("/login");
            }
            // finally {
            //     setIsProcessing(false);
            // }
        };

        processCallback();
    }, [location, navigate, setUserData, toast]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <h1 className="text-2xl font-bold mb-2">
                    Connecting to Spotify
                </h1>
                <p className="text-muted-foreground">
                    Please wait while we connect your account...
                </p>
            </div>
        </div>
    );
}
