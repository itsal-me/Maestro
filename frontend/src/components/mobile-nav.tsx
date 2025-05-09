"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import {
    Home,
    BarChart2,
    Music,
    ListMusic,
    LogOut,
    Menu,
    User,
} from "lucide-react";

interface MobileNavProps {
    className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
    const { spotifyData, logout } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <Home className="h-5 w-5" />,
        },
        {
            name: "Analysis",
            path: "/analysis",
            icon: <BarChart2 className="h-5 w-5" />,
        },
        {
            name: "Generate Playlist",
            path: "/generate",
            icon: <Music className="h-5 w-5" />,
        },
        {
            name: "My Playlists",
            path: "/playlists",
            icon: <ListMusic className="h-5 w-5" />,
        },
    ];

    return (
        <div
            className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-black border-b border-border h-16",
                className
            )}
        >
            <div className="flex items-center justify-between h-full px-4">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="bg-spotify-green rounded-full p-1.5">
                        <Music className="h-5 w-5 text-black" />
                    </div>
                    <span className="text-lg font-bold text-white">
                        Maestro
                    </span>
                </Link>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>

                    <SheetTitle className="sr-only"></SheetTitle>

                    <SheetContent
                        side="left"
                        className="p-0 bg-black border-r border-border w-64"
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-6">
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2"
                                    onClick={() => setOpen(false)}
                                >
                                    <div className="bg-spotify-green rounded-full p-2">
                                        <Music className="h-6 w-6 text-black" />
                                    </div>
                                    <span className="text-xl font-bold text-white">
                                        Maestro
                                    </span>
                                </Link>
                            </div>

                            {spotifyData && (
                                <div className="px-4 py-3 mb-6 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                                        {spotifyData.images &&
                                        spotifyData.images[0] ? (
                                            <img
                                                src={
                                                    spotifyData.images[0].url ||
                                                    "/placeholder.svg"
                                                }
                                                alt={spotifyData.display_name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-full w-full p-2 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-white truncate">
                                            {spotifyData.display_name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <nav className="flex-1 px-3 space-y-1">
                                {navItems.map((item) => {
                                    const isActive =
                                        location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-spotify-green text-black"
                                                    : "text-muted-foreground hover:text-white hover:bg-muted"
                                            )}
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 mt-auto">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-muted-foreground hover:text-white"
                                    onClick={() => {
                                        logout();
                                        setOpen(false);
                                    }}
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
