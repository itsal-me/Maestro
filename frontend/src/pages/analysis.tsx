"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { apiService } from "@/lib/api";
import { BarChart2, Music, Loader2 } from "lucide-react";

interface Analysis {
    id: number;
    personality_type: string;
    description: string;
    music_analytics: {
        top_genres: string[];
        mood_distribution: {
            happy: number;
            melancholic: number;
            energetic: number;
            calm: number;
            angsty: number;
        };
        audio_features: {
            energy_level: string;
            danceability: number;
            acousticness: number;
            instrumentalness: number;
            complexity: number;
        };
    };
    insights: string[];
    recommendations: {
        similar_artists: string[];
        growth_opportunities: string[];
    };
    generated_at: string;
}

export default function AnalysisPage() {
    const { user } = useAuth();

    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                const response = await apiService.getUserAnalyses(user.id);
                if (response.data && response.data.length > 0) {
                    setAnalysis(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching analysis:", error);
                toast("Failed to load your analysis. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [user, toast]);

    const generateAnalysis = async () => {
        if (!user) return;

        try {
            setIsAnalyzing(true);
            const response = await apiService.analyzeUser(user.id);
            setAnalysis(response.data);
            toast("Your music personality analysis is ready!");
        } catch (error) {
            console.error("Error generating analysis:", error);
            toast("Could not generate your analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">
                    Music Personality Analysis
                </h1>
                <p className="text-muted-foreground">
                    Discover insights about your music taste
                </p>
            </header>

            {isLoading ? (
                <div className="space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-32 w-full" />
                    <div className="grid gap-6 md:grid-cols-2">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            ) : analysis ? (
                <div className="space-y-8">
                    <Card className="bg-zinc-900/60 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-2xl text-spotify-green">
                                {analysis.personality_type || "Null"}
                            </CardTitle>
                            <CardDescription>
                                Analyzed on{" "}
                                {new Date(
                                    analysis.generated_at
                                ).toLocaleDateString() || "Null"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-200">
                                {analysis.description || "Null"}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart2 className="h-5 w-5 text-spotify-green" />
                                    Mood Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {analysis.music_analytics?.mood_distribution ? (
                                    Object.entries(
                                        analysis.music_analytics
                                            .mood_distribution
                                    ).map(([mood, value]) => (
                                        <div key={mood} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="capitalize">
                                                    {mood}
                                                </span>
                                                <span>
                                                    {value !== undefined
                                                        ? `${value}%`
                                                        : "N/A"}
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    value !== undefined
                                                        ? value
                                                        : 0
                                                }
                                                className="h-2"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-zinc-400">
                                        No mood distribution data available
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Music className="h-5 w-5 text-spotify-green" />
                                    Audio Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {analysis.music_analytics?.audio_features ? (
                                    <>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Energy Level</span>
                                                <span className="capitalize">
                                                    {analysis.music_analytics
                                                        .audio_features
                                                        .energy_level || "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        {Object.entries(
                                            analysis.music_analytics
                                                .audio_features
                                        )
                                            .filter(
                                                ([key]) =>
                                                    key !== "energy_level"
                                            )
                                            .map(([feature, value]) => (
                                                <div
                                                    key={feature}
                                                    className="space-y-1"
                                                >
                                                    <div className="flex justify-between text-sm">
                                                        <span className="capitalize">
                                                            {feature}
                                                        </span>
                                                        <span>
                                                            {value !== undefined
                                                                ? `${value}/10`
                                                                : "N/A"}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={
                                                            value !== undefined
                                                                ? Number(
                                                                      value
                                                                  ) * 10
                                                                : 0
                                                        }
                                                        className="h-2"
                                                    />
                                                </div>
                                            ))}
                                    </>
                                ) : (
                                    <p className="text-zinc-400">
                                        No audio features available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Top Genres</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {analysis.music_analytics?.top_genres
                                    ?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.music_analytics.top_genres.map(
                                            (genre, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {genre}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-zinc-400">
                                        No genres available
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Psychological Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {analysis.insights?.length ? (
                                        analysis.insights.map(
                                            (insight, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="text-spotify-green">
                                                        •
                                                    </span>
                                                    <span className="text-zinc-300">
                                                        {insight}
                                                    </span>
                                                </li>
                                            )
                                        )
                                    ) : (
                                        <li className="text-zinc-400">
                                            No insights available
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 mt-6">
                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Similar Artists</CardTitle>
                                <CardDescription>
                                    Artists you might enjoy based on your taste
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analysis.recommendations?.similar_artists
                                    ?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.recommendations.similar_artists.map(
                                            (artist, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {artist}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-zinc-400 italic">
                                        No similar artist recommendations
                                        available
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/60 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Growth Opportunities</CardTitle>
                                <CardDescription>
                                    Expand your musical horizons
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analysis.recommendations?.growth_opportunities
                                    ?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analysis.recommendations.growth_opportunities.map(
                                            (opportunity, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="text-spotify-green">
                                                        •
                                                    </span>
                                                    <span className="text-zinc-300">
                                                        {opportunity}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-zinc-400 italic">
                                        No growth opportunities available
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-between">
                        <Button
                            onClick={generateAnalysis}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Reanalyze"
                            )}
                        </Button>
                        <Button asChild>
                            <Link to="/generate">Generate Playlist</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <BarChart2 className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Analysis Yet</h2>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                        Generate your first music personality analysis to
                        discover insights about your listening habits.
                    </p>
                    <Button
                        onClick={generateAnalysis}
                        disabled={isAnalyzing}
                        size="lg"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing Your Music...
                            </>
                        ) : (
                            "Generate Analysis"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
