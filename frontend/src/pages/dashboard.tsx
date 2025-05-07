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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Music, User, PlusCircle, RefreshCw } from "lucide-react";

interface Analysis {
    id: number;
    personality_type: string;
    music_analytics: any;
    generated_at: string;
}

interface Playlist {
    id: number;
    playlist_id: string;
    name: string;
    description: string;
    generated_at: string;
    mood?: string;
    prompt?: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);
    const [recentPlaylists, setRecentPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                // Fetch user analyses
                const analyses = await api.getUserAnalyses(user.id);
                if (analyses.length > 0) {
                    setLatestAnalysis(analyses[0]); // Most recent analysis
                }

                // Fetch user playlists
                const playlists = await api.getUserPlaylists(user.id);
                setRecentPlaylists(playlists.slice(0, 3)); // Get 3 most recent playlists
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const handleAnalyze = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            await api.analyzeUser(user.id);
            navigate("/analysis");
        } catch (error) {
            console.error("Error analyzing user:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome to your music personality dashboard.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        onClick={handleAnalyze}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        New Analysis
                    </Button>
                    <Button
                        onClick={handleGeneratePlaylist}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Create Playlist
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="personality">
                        Music Personality
                    </TabsTrigger>
                    <TabsTrigger value="playlists">
                        Recent Playlists
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Music Personality
                                </CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {latestAnalysis
                                        ? latestAnalysis.personality_type
                                        : "Not analyzed yet"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {latestAnalysis
                                        ? `Last updated ${new Date(
                                              latestAnalysis.generated_at
                                          ).toLocaleDateString()}`
                                        : "Run your first analysis to discover your music personality"}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Generated Playlists
                                </CardTitle>
                                <Music className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {recentPlaylists.length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {recentPlaylists.length > 0
                                        ? "AI-generated playlists based on your taste"
                                        : "Create your first AI playlist"}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="personality" className="space-y-4">
                    {latestAnalysis ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Your Music Personality:{" "}
                                    {latestAnalysis.personality_type}
                                </CardTitle>
                                <CardDescription>
                                    Based on your Spotify listening history
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(
                                    latestAnalysis.music_analytics
                                ).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <h3 className="font-medium capitalize">
                                            {key.replace("_", " ")}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {String(value)}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleAnalyze}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Update Analysis
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Analysis Yet</CardTitle>
                                <CardDescription>
                                    Run your first analysis to discover your
                                    music personality
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-6">
                                <User className="h-16 w-16 text-muted-foreground mb-4" />
                                <p className="text-center text-muted-foreground mb-4">
                                    We'll analyze your Spotify listening history
                                    to create a personalized music personality
                                    profile.
                                </p>
                                <Button onClick={handleAnalyze}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Run Analysis
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="playlists" className="space-y-4">
                    {recentPlaylists.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {recentPlaylists.map((playlist) => (
                                <Card key={playlist.id}>
                                    <CardHeader>
                                        <CardTitle className="truncate">
                                            {playlist.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {playlist.mood
                                                ? `Mood: ${playlist.mood}`
                                                : "Custom playlist"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {playlist.description}
                                        </p>
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
                                    Create personalized playlists based on your
                                    mood or specific prompts.
                                </p>
                                <Button onClick={handleGeneratePlaylist}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Generate Playlist
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
