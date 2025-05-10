"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { api, apiService } from "@/lib/api";

interface User {
    id: number;
    spotify_id: string;
    display_name: string;
    images: { url: string }[];
    access_token: string;
    token_expires: string;
    refresh_token: string;
}

interface SpotifyData {
    display_name: string;
    email: string;
    images: { url: string }[];
    top_tracks: { items: any[] };
    top_artists: { items: any[] };
    recently_played: { items: any[] };
    followers: number;
}

interface AuthContextType {
    user: User | null;
    spotifyData: SpotifyData | null;
    isLoading: boolean;
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isAuthenticated: boolean;
    // setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    login: () => void;
    logout: () => void;
    refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem("maestro_user");
            if (!storedUser) return setIsLoading(false);

            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // Fetch user profile data
                if (parsedUser?.id) {
                    const profileResponse = await apiService.getUserProfile(
                        parsedUser.id
                    );
                    setSpotifyData({
                        display_name: profileResponse.data.display_name,
                        email: profileResponse.data.email,
                        followers: profileResponse.data.followers,
                        images: profileResponse.data.images,
                        top_tracks: profileResponse.data.top_tracks,
                        top_artists: profileResponse.data.top_artists,
                        recently_played: profileResponse.data.recently_played,
                    });
                }

                // Check if token is expired
                const tokenExpires = new Date(parsedUser.token_expires);
                if (tokenExpires < new Date()) {
                    // await refreshToken();
                    logout();
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem("maestro_user");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const login = async () => {
        try {
            const response = await api.get("/auth/spotify/");
            if (response.data && response.data.auth_url) {
                window.location.href = response.data.auth_url;
            }
        } catch (error) {
            console.error("Login error:", error);
            toast("Could not connect to Spotify. Please try again.");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("maestro_user");

        toast("You have been successfully logged out.");
    };

    const refreshToken = async () => {
        if (!user || !user.refresh_token) return;

        try {
            setIsLoading(true);
            const response = await api.post("/auth/spotify/refresh-token/", {
                refresh_token: user.refresh_token,
            });

            if (response.data && response.data.access_token) {
                const updatedUser = {
                    ...user,
                    access_token: response.data.access_token,
                    token_expires: new Date(
                        Date.now() + 3600 * 1000
                    ).toISOString(),
                };
                setUser(updatedUser);
                localStorage.setItem(
                    "maestro_user",
                    JSON.stringify(updatedUser)
                );
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            // If refresh fails, log the user out
            logout();
            toast("Please log in again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                spotifyData,
                isLoading,
                // setIsLoading,
                isAuthenticated: !!user,
                // setIsAuthenticated,
                login,
                logout,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
