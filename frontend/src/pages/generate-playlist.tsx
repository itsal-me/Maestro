"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Music } from "lucide-react";

const moods = [
    { value: "happy", label: "Happy" },
    { value: "chill", label: "Chill" },
    { value: "energetic", label: "Energetic" },
    { value: "focus", label: "Focus" },
    { value: "sad", label: "Sad" },
    { value: "romantic", label: "Romantic" },
    { value: "party", label: "Party" },
    { value: "custom", label: "Custom Prompt" },
];

export default function GeneratePlaylistPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedMood, setSelectedMood] = useState("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!user) return;
        if (!selectedMood) {
            toast("Please select a mood or choose custom prompt.");
            return;
        }

        if (selectedMood === "custom" && !customPrompt.trim()) {
            toast("Please enter a custom prompt for your playlist.");
            return;
        }

        setIsGenerating(true);
        try {
            const mood = selectedMood === "custom" ? undefined : selectedMood;
            const prompt = selectedMood === "custom" ? customPrompt : undefined;

            await api.generatePlaylist(user.id, mood, prompt);

            toast(
                "Your new playlist has been created and saved to your Spotify account."
            );

            navigate("/playlists");
        } catch (error) {
            console.error("Error generating playlist:", error);
            toast("Could not generate playlist. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Generate Playlist
                </h1>
                <p className="text-muted-foreground">
                    Create a new AI-generated playlist based on your
                    preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Playlist Options</CardTitle>
                    <CardDescription>
                        Choose a mood or create a custom prompt for your
                        playlist.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Select a mood for your playlist</Label>
                        <RadioGroup
                            value={selectedMood}
                            onValueChange={setSelectedMood}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                        >
                            {moods.map((mood) => (
                                <div
                                    key={mood.value}
                                    className="flex items-center space-x-2"
                                >
                                    <RadioGroupItem
                                        value={mood.value}
                                        id={mood.value}
                                    />
                                    <Label
                                        htmlFor={mood.value}
                                        className="cursor-pointer"
                                    >
                                        {mood.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {selectedMood === "custom" && (
                        <div className="space-y-2">
                            <Label htmlFor="custom-prompt">Custom Prompt</Label>
                            <Textarea
                                id="custom-prompt"
                                placeholder="E.g., Create a playlist for a road trip through the mountains with indie folk and ambient music"
                                value={customPrompt}
                                onChange={(e) =>
                                    setCustomPrompt(e.target.value)
                                }
                                className="min-h-[100px]"
                            />
                            <p className="text-xs text-muted-foreground">
                                Be specific about the vibe, genres, or
                                activities for better results.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Music className="h-4 w-4" />
                                Generate Playlist
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium">
                            1. Choose a Mood or Custom Prompt
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Select one of our predefined moods or create a
                            custom prompt to describe exactly what you want.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium">2. AI Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                            Our AI analyzes your music taste and the selected
                            mood to create a personalized playlist.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium">3. Playlist Creation</h3>
                        <p className="text-sm text-muted-foreground">
                            The generated playlist is automatically saved to
                            your Spotify account and ready to play.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
