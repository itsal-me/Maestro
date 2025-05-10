"use client";

import { useEffect } from "react";
import {
    useNavigate,
    // useSearchParams
} from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

import { Music, Sparkles, BarChart2, ListMusic } from "lucide-react";

export default function HomePage() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    // const [searchParams] = useSearchParams();

    // // Handle Spotify callback
    // useEffect(() => {
    //     const code = searchParams.get("code");
    //     if (code) {
    //         // Redirect to the callback page with the code
    //         navigate(`/callback?code=${code}`);
    //     }
    // }, [searchParams, navigate]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const features = [
        {
            icon: <BarChart2 className="h-8 w-8 text-spotify-green" />,
            title: "Personality Analysis",
            description:
                "Discover your music personality type based on your Spotify listening habits.",
        },
        {
            icon: <Sparkles className="h-8 w-8 text-spotify-green" />,
            title: "AI-Powered Insights",
            description:
                "Get deep insights into your music preferences using advanced AI analysis.",
        },
        {
            icon: <ListMusic className="h-8 w-8 text-spotify-green" />,
            title: "Custom Playlists",
            description:
                "Generate personalized playlists based on your mood and preferences.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <header className="flex flex-col items-center text-center mb-16">
                    <div className="bg-spotify-green rounded-full p-4 mb-6">
                        <Music className="h-12 w-12 text-black" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Maestro
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl">
                        Discover your music personality and get AI-powered
                        playlist recommendations based on your Spotify listening
                        habits.
                    </p>
                    <Button
                        onClick={login}
                        className="mt-8 bg-spotify-green hover:bg-spotify-green/90 text-black font-bold py-3 px-8 rounded-full text-lg"
                    >
                        Connect with Spotify
                    </Button>
                </header>

                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-zinc-800/50 rounded-xl p-6 backdrop-blur-sm"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="bg-zinc-800/30 rounded-xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-zinc-700 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                                <span className="font-bold">1</span>
                            </div>
                            <h3 className="font-bold mb-2">
                                Connect Your Spotify
                            </h3>
                            <p className="text-zinc-400">
                                Link your Spotify account to allow Maestro to
                                analyze your music data.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-zinc-700 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                                <span className="font-bold">2</span>
                            </div>
                            <h3 className="font-bold mb-2">
                                Get Your Analysis
                            </h3>
                            <p className="text-zinc-400">
                                Our AI analyzes your listening habits to
                                determine your music personality.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-zinc-700 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                                <span className="font-bold">3</span>
                            </div>
                            <h3 className="font-bold mb-2">
                                Generate Playlists
                            </h3>
                            <p className="text-zinc-400">
                                Create custom playlists based on your mood and
                                save them to your Spotify.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="bg-black py-6 border-t border-zinc-800">
                <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
                    <p>
                        Maestro is not affiliated with Spotify. Powered by AI.
                    </p>
                </div>
            </footer>
        </div>
    );
}
