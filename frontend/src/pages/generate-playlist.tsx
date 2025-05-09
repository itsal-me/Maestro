"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { apiService } from "@/lib/api";
import { Music, Loader2 } from "lucide-react";

const moodOptions = [
    "Happy",
    "Energetic",
    "Chill",
    "Focused",
    "Melancholic",
    "Romantic",
    "Party",
    "Workout",
    "Study",
    "Relaxing",
];

export default function PlaylistGeneratorPage() {
    const { user } = useAuth();

    const navigate = useNavigate();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [customPrompt, setCustomPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood === selectedMood ? null : mood);
    };

    const handleGenerate = async () => {
        if (!user) return;

        if (!selectedMood && !customPrompt.trim()) {
            toast("Please select a mood or enter a custom prompt.");
            return;
        }

        try {
            setIsGenerating(true);
            await apiService.generatePlaylist(
                user.id,
                selectedMood || undefined,
                customPrompt.trim() || undefined
            );

            toast("Your new playlist has been created and saved to Spotify!");

            navigate("/playlists");
        } catch (error) {
            console.error("Error generating playlist:", error);
            toast("Could not generate your playlist. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Generate Playlist</h1>
                <p className="text-muted-foreground">
                    Create a custom playlist based on your mood or prompt
                </p>
            </header>

            <div className="max-w-2xl mx-auto">
                <Card className="bg-zinc-900/60 border-zinc-800 mb-8">
                    <CardContent className="pt-6">
                        <div className="mb-6">
                            <Label className="text-lg mb-2 block">
                                Select a Mood
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                {moodOptions.map((mood) => (
                                    <Button
                                        key={mood}
                                        type="button"
                                        variant={
                                            selectedMood === mood
                                                ? "default"
                                                : "outline"
                                        }
                                        className={`
                      border-zinc-700 hover:bg-zinc-800 hover:text-white
                      ${
                          selectedMood === mood
                              ? "bg-spotify-green text-black border-spotify-green"
                              : ""
                      }
                    `}
                                        onClick={() => handleMoodSelect(mood)}
                                    >
                                        {mood}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <Label
                                htmlFor="custom-prompt"
                                className="text-lg mb-2 block"
                            >
                                Enter a Prompt
                            </Label>
                            <Textarea
                                id="custom-prompt"
                                placeholder="E.g., A playlist for a road trip through the mountains with indie folk and ambient music"
                                className="bg-zinc-800 border-zinc-700 resize-none"
                                rows={4}
                                value={customPrompt}
                                onChange={(e) =>
                                    setCustomPrompt(e.target.value)
                                }
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                Be specific about the vibe, genres, or occasion
                                for better results
                            </p>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            // disabled={isGenerating}
                            disabled
                            className="w-full"
                            size="lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Playlist...
                                </>
                            ) : (
                                <>
                                    <Music className="mr-2 h-5 w-5" />
                                    Generate Playlist
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800">
                    <h3 className="text-lg font-medium mb-3">
                        Tips for Great Playlists
                    </h3>
                    <ul className="space-y-2 text-zinc-400">
                        <li className="flex items-start gap-2">
                            <span className="text-spotify-green">•</span>
                            <span>
                                Combine a mood with specific genres for more
                                targeted results
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-spotify-green">•</span>
                            <span>
                                Mention activities like "workout," "studying,"
                                or "dinner party"
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-spotify-green">•</span>
                            <span>
                                Include time periods or decades for era-specific
                                playlists
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-spotify-green">•</span>
                            <span>
                                Reference artists you like for similar-sounding
                                recommendations
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
