"use client";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import {
    Music,
    Menu,
    LayoutDashboard,
    User,
    ListMusic,
    PlusCircle,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

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
                        <>
                            {/* Mobile Navigation */}
                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Menu className="h-5 w-5" />
                                            <span className="sr-only">
                                                Toggle menu
                                            </span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="w-[250px] sm:w-[300px]"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>
                                                <Link
                                                    to="/"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Music className="h-5 w-5 text-primary" />
                                                    <span className="font-bold">
                                                        Maestro
                                                    </span>
                                                </Link>
                                            </SheetTitle>
                                        </SheetHeader>
                                        <nav className="flex flex-col gap-4 mt-8">
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
                                            >
                                                <LayoutDashboard className="h-5 w-5" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/analysis"
                                                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
                                            >
                                                <User className="h-5 w-5" />
                                                Analysis
                                            </Link>
                                            <Link
                                                to="/playlists"
                                                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
                                            >
                                                <ListMusic className="h-5 w-5" />
                                                Playlists
                                            </Link>
                                            <Link
                                                to="/generate"
                                                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                                Generate Playlist
                                            </Link>
                                            <hr className="my-2" />
                                            <Button
                                                variant="outline"
                                                onClick={handleLogout}
                                                className="justify-start"
                                            >
                                                Logout
                                            </Button>
                                        </nav>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* Desktop Logout Button */}
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="hidden md:flex"
                            >
                                Logout
                            </Button>
                        </>
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
