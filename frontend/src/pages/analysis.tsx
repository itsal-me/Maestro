"use client";

import { useEffect, useState } from "react";
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
import { RefreshCw, User, BarChart, Music } from "lucide-react";
import { toast } from "sonner";

interface Analysis {
    id: number;
    personality_type: string;
    music_analytics: any;
    generated_at: string;
}

export default function AnalysisPage() {
    const { user } = useAuth();

    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const fetchAnalyses = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const data = await api.getUserAnalyses(user.id);
                console.log("Fetched analyses:", data);
                setAnalyses(data);
            } catch (error) {
                console.error("Error fetching analyses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyses();
    }, [user]);

    const handleAnalyze = async () => {
        if (!user) return;

        setIsAnalyzing(true);
        try {
            const newAnalysis = await api.analyzeUser(user.id);
            console.log("New analysis:", newAnalysis);
            setAnalyses([newAnalysis, ...analyses]);
            toast("Your music personality analysis has been updated.");
        } catch (error) {
            console.error("Error analyzing user:", error);
            toast("Could not complete the analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
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
                        Music Personality Analysis
                    </h1>
                    <p className="text-muted-foreground">
                        Discover insights about your music taste and
                        preferences.
                    </p>
                </div>
                <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4" />
                            New Analysis
                        </>
                    )}
                </Button>
            </div>

            {analyses.length > 0 ? (
                <Tabs
                    defaultValue={analyses[0].id.toString()}
                    className="space-y-4"
                >
                    <TabsList className="flex overflow-x-auto pb-2">
                        {analyses.map((analysis) => (
                            <TabsTrigger
                                key={analysis.id}
                                value={analysis.id.toString()}
                            >
                                {new Date(
                                    analysis.generated_at
                                ).toLocaleDateString()}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {analyses.map((analysis) => (
                        <TabsContent
                            key={analysis.id}
                            value={analysis.id.toString()}
                            className="space-y-4"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        Your Music Personality:{" "}
                                        {analysis.personality_type}
                                    </CardTitle>
                                    <CardDescription>
                                        Analysis from{" "}
                                        {new Date(
                                            analysis.generated_at
                                        ).toLocaleString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {Object.entries(
                                        analysis.music_analytics
                                    ).map(([category, data]) => (
                                        <div
                                            key={category}
                                            className="space-y-2"
                                        >
                                            <h3 className="text-lg font-medium capitalize flex items-center gap-2">
                                                {category === "top_genres" && (
                                                    <Music className="h-5 w-5" />
                                                )}
                                                {category ===
                                                    "listening_habits" && (
                                                    <BarChart className="h-5 w-5" />
                                                )}
                                                {category ===
                                                    "personality_traits" && (
                                                    <User className="h-5 w-5" />
                                                )}
                                                {category.replace(/_/g, " ")}
                                            </h3>

                                            {data &&
                                            typeof data === "object" ? (
                                                <div className="space-y-2">
                                                    {Object.entries(data).map(
                                                        ([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="grid grid-cols-2 gap-2 p-2 rounded-md bg-muted/50"
                                                            >
                                                                <span className="text-sm capitalize">
                                                                    {key.replace(
                                                                        /_/g,
                                                                        " "
                                                                    )}
                                                                </span>
                                                                <span className="text-sm font-medium">
                                                                    {String(
                                                                        value
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm">
                                                    {String(data)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Analysis Yet</CardTitle>
                        <CardDescription>
                            Run your first analysis to discover your music
                            personality
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <User className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground mb-4">
                            We'll analyze your Spotify listening history to
                            create a personalized music personality profile.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
