"use client";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Music } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Music className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Maestro</span>
                </Link>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {isAuthenticated ? (
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link to="/login">Login with Spotify</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
