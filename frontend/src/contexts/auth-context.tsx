"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

import { toast } from "sonner";

interface User {
    id: number;
    spotify_id: string;
    access_token: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    setUserData: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem("maestro_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem("maestro_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/spotify/`
            );
            const data = await response.json();

            if (data.auth_url) {
                window.location.href = data.auth_url;
            } else {
                throw new Error("Failed to get Spotify auth URL");
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

    const setUserData = (userData: User) => {
        setUser(userData);
        localStorage.setItem("maestro_user", JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                setUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
