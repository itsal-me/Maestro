"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { Music, PlusCircle } from "lucide-react";

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
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const data = await api.getUserPlaylists(user.id);
                setPlaylists(data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [user]);

    const handleGeneratePlaylist = () => {
        navigate("/generate");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Your Playlists
                    </h1>
                    <p className="text-muted-foreground">
                        AI-generated playlists based on your music taste.
                    </p>
                </div>
                <Button
                    onClick={handleGeneratePlaylist}
                    className="flex items-center gap-2"
                >
                    <PlusCircle className="h-4 w-4" />
                    Generate New Playlist
                </Button>
            </div>

            {playlists.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {playlists.map((playlist) => (
                        <Card key={playlist.id}>
                            <CardHeader>
                                <CardTitle className="truncate">
                                    {playlist.name}
                                </CardTitle>
                                <CardDescription>
                                    {playlist.mood
                                        ? `Mood: ${playlist.mood}`
                                        : "Custom playlist"}
                                    {" • "}
                                    {new Date(
                                        playlist.generated_at
                                    ).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {playlist.description}
                                </p>
                                {playlist.prompt && (
                                    <div className="bg-muted p-3 rounded-md">
                                        <p className="text-xs font-medium mb-1">
                                            Prompt:
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {playlist.prompt}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <a
                                        href={`https://open.spotify.com/playlist/${playlist.playlist_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Music className="mr-2 h-4 w-4" />
                                        Open in Spotify
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Playlists Yet</CardTitle>
                        <CardDescription>
                            Generate your first AI playlist
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <Music className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground mb-4">
                            Create personalized playlists based on your mood or
                            specific prompts.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={handleGeneratePlaylist}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Generate Playlist
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
