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
import { Music, BarChart2, ListMusic, ExternalLink } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const { spotifyData } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [analyses, setAnalyses] = useState<
        {
            personality_type: string;
            description: string;
            generated_at: string;
        }[]
    >([]);
    const [playlists, setPlaylists] = useState<
        { name: string; description: string }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setIsLoading(true);

                // Fetch user analyses
                const analysesResponse = await apiService.getUserAnalyses(
                    user.id
                );
                setAnalyses(analysesResponse.data);

                // Fetch user playlists
                const playlistsResponse = await apiService.getUserPlaylists(
                    user.id
                );
                setPlaylists(playlistsResponse.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast("Failed to load your data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, toast]);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your music personality hub
                </p>
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
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart2 className="h-5 w-5 text-spotify-green" />
                                    Music Personality
                                </CardTitle>
                                <CardDescription>
                                    {analyses.length > 0
                                        ? `Last analyzed: ${new Date(
                                              analyses[0].generated_at
                                          ).toLocaleDateString()}`
                                        : "Discover your music personality"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analyses.length > 0 ? (
                                    <div>
                                        <h3 className="text-xl font-bold text-spotify-green mb-2">
                                            {analyses[0].personality_type}
                                        </h3>
                                        <p className="text-sm text-zinc-400 line-clamp-3">
                                            {analyses[0].description}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-zinc-400 mb-2">
                                            No analysis yet
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link to="/analysis">
                                        {analyses.length > 0
                                            ? "View Analysis"
                                            : "Get Analysis"}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Music className="h-5 w-5 text-spotify-green" />
                                    Generate Playlist
                                </CardTitle>
                                <CardDescription>
                                    Create a custom playlist based on your mood
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-4">
                                    <Music className="h-12 w-12 text-spotify-green mx-auto mb-2" />
                                    <p className="text-zinc-400">
                                        Let AI create the perfect playlist for
                                        any occasion
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link to="/generate">Create Playlist</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ListMusic className="h-5 w-5 text-spotify-green" />
                                    Your Playlists
                                </CardTitle>
                                <CardDescription>
                                    {playlists.length > 0
                                        ? `${
                                              playlists.length
                                          } generated playlist${
                                              playlists.length !== 1 ? "s" : ""
                                          }`
                                        : "No playlists generated yet"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {playlists.length > 0 ? (
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Latest playlist:
                                        </h3>
                                        <p className="text-spotify-green font-medium">
                                            {playlists[0].name}
                                        </p>
                                        <p className="text-sm text-zinc-400 line-clamp-2">
                                            {playlists[0].description}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <ListMusic className="h-12 w-12 text-zinc-600 mx-auto mb-2" />
                                        <p className="text-zinc-400">
                                            Generate your first playlist
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    asChild
                                    className="w-full"
                                    variant={
                                        playlists.length > 0
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    <Link to="/playlists">
                                        {playlists.length > 0
                                            ? "View Playlists"
                                            : "No Playlists Yet"}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {spotifyData && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">
                                Your Top Artists
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {spotifyData?.top_artists?.items?.length > 0 ? (
                                    spotifyData.top_artists.items
                                        .slice(0, 5)
                                        .map((artist) => (
                                            <a
                                                key={artist.id}
                                                href={
                                                    artist.external_urls.spotify
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group"
                                            >
                                                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-hidden transition-all hover:bg-zinc-800/60">
                                                    <div className="aspect-square overflow-hidden">
                                                        {artist.images &&
                                                        artist.images[0] ? (
                                                            <img
                                                                src={
                                                                    artist
                                                                        .images[0]
                                                                        .url ||
                                                                    "/placeholder.svg"
                                                                }
                                                                alt={
                                                                    artist.name
                                                                }
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                                <Music className="h-12 w-12 text-zinc-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="font-medium truncate">
                                                            {artist.name}
                                                        </p>
                                                        <p className="text-xs text-zinc-400 truncate">
                                                            {artist.genres
                                                                .slice(0, 2)
                                                                .join(", ")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        ))
                                ) : (
                                    <p className="text-zinc-400">
                                        No top artists available.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {spotifyData && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Your Top Tracks
                            </h2>
                            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-hidden">
                                <div className="divide-y divide-zinc-800">
                                    {spotifyData.top_tracks.items
                                        .slice(0, 5)
                                        .map((track, index) => (
                                            <a
                                                key={track.id}
                                                href={
                                                    track.external_urls.spotify
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 hover:bg-zinc-800/60 transition-colors"
                                            >
                                                <div className="w-8 text-center text-zinc-500 mr-4">
                                                    {index + 1}
                                                </div>
                                                <div className="h-10 w-10 mr-4 flex-shrink-0">
                                                    {track.album.images &&
                                                    track.album.images[0] ? (
                                                        <img
                                                            src={
                                                                track.album
                                                                    .images[0]
                                                                    .url ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={
                                                                track.album.name
                                                            }
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center rounded">
                                                            <Music className="h-5 w-5 text-zinc-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {track.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-400 truncate">
                                                        {track.artists
                                                            .map(
                                                                (a: {
                                                                    name: any;
                                                                }) => a.name
                                                            )
                                                            .join(", ")}
                                                    </p>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-zinc-500 ml-2" />
                                            </a>
                                        ))}
                                </div>
                                <div className="p-3 border-t border-zinc-800 text-center">
                                    <Button
                                        asChild
                                        variant="link"
                                        className="text-spotify-green"
                                    >
                                        <a
                                            href="https://open.spotify.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Open in Spotify
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
