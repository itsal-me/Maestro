"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { apiService } from "@/lib/api";
import { Music, Calendar, ExternalLink } from "lucide-react";

interface Playlist {
    id: number;
    playlist_id: string;
    name: string;
    description: string;
    generated_at: string;
    mood?: string;
    prompt?: string;
}

export default function PlaylistsPage() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                const response = await apiService.getUserPlaylists(user.id);
                setPlaylists(response.data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
                toast("Failed to load your playlists. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [user, toast]);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Your Playlists</h1>
                    <p className="text-muted-foreground">
                        AI-generated playlists saved to your Spotify
                    </p>
                </div>
                <Button asChild>
                    <Link to="/generate">
                        <Music className="mr-2 h-5 w-5" />
                        Generate New
                    </Link>
                </Button>
            </header>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card
                            key={i}
                            className="bg-zinc-900/60 border-zinc-800"
                        >
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-24 w-full" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : playlists.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {playlists.map((playlist) => (
                        <Card
                            key={playlist.id}
                            className="bg-zinc-900/60 border-zinc-800"
                        >
                            <CardHeader>
                                <CardTitle className="text-spotify-green">
                                    {playlist.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {new Date(
                                            playlist.generated_at
                                        ).toLocaleDateString()}
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-zinc-300 mb-4">
                                    {playlist.description}
                                </p>

                                {playlist.mood && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-zinc-500">
                                            Mood:
                                        </span>
                                        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-xs">
                                            {playlist.mood}
                                        </span>
                                    </div>
                                )}

                                {playlist.prompt && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-zinc-500">
                                            Prompt:
                                        </span>
                                        <p className="text-xs text-zinc-400 italic line-clamp-2">
                                            "{playlist.prompt}"
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    asChild
                                    className="w-full"
                                    variant="outline"
                                >
                                    <a
                                        href={`https://open.spotify.com/playlist/${playlist.playlist_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Open in Spotify
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Music className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">
                        No Playlists Yet
                    </h2>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                        You haven't generated any playlists yet. Create your
                        first AI-powered playlist now!
                    </p>
                    <Button asChild size="lg">
                        <Link to="/generate">Generate Your First Playlist</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
