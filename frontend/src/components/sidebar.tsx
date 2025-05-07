import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, Music, PlusCircle } from "lucide-react";

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Analysis",
        href: "/analysis",
        icon: User,
    },
    {
        title: "Playlists",
        href: "/playlists",
        icon: Music,
    },
    {
        title: "Generate Playlist",
        href: "/generate",
        icon: PlusCircle,
    },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r">
            <div className="flex flex-col gap-2 p-6">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                            location.pathname === item.href
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
