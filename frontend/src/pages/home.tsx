"use client";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Check,
    Star,
    BarChart,
    Headphones,
    ListMusic,
    Music,
    User,
} from "lucide-react";

export default function HomePage() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate("/dashboard");
        } else {
            login();
        }
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="spotify-gradient py-20 px-4 md:py-32 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Discover Your Music Personality
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                    Maestro analyzes your Spotify listening habits and creates
                    personalized playlists using AI.
                </p>
                <Button size="lg" onClick={handleGetStarted}>
                    {isAuthenticated
                        ? "Go to Dashboard"
                        : "Connect with Spotify"}
                </Button>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-4 container">
                <h2 className="text-3xl font-bold mb-12 text-center">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border">
                        <Music className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            Connect Your Spotify
                        </h3>
                        <p className="text-muted-foreground">
                            Link your Spotify account to give Maestro access to
                            your listening history.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border">
                        <Headphones className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            Get Your Analysis
                        </h3>
                        <p className="text-muted-foreground">
                            Our AI analyzes your music taste and creates a
                            personality profile.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border">
                        <ListMusic className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            Generate Playlists
                        </h3>
                        <p className="text-muted-foreground">
                            Create custom playlists based on your mood or
                            specific prompts.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-4">
                            <div className="inline-block p-2 bg-primary/10 rounded-lg mb-2">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-semibold">
                                Music Personality Analysis
                            </h3>
                            <p className="text-muted-foreground">
                                Discover your unique music personality based on
                                your listening habits. Our AI analyzes your
                                favorite genres, artists, and tracks to create a
                                comprehensive profile of your musical taste.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Detailed genre breakdown</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Listening pattern insights</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>
                                        Personality traits based on music
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-lg overflow-hidden border shadow-lg">
                            <img
                                src="/placeholder.svg?height=400&width=600"
                                alt="Music personality analysis dashboard"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 md:flex-row-reverse">
                        <div className="space-y-4 order-2 md:order-1">
                            <div className="inline-block p-2 bg-primary/10 rounded-lg mb-2">
                                <Music className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-semibold">
                                AI-Powered Playlist Generation
                            </h3>
                            <p className="text-muted-foreground">
                                Create personalized playlists tailored to your
                                mood, activity, or specific requests. Our
                                advanced AI understands context and musical
                                relationships to craft the perfect playlist.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Mood-based playlists</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Custom prompt support</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Direct Spotify integration</span>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-lg overflow-hidden border shadow-lg order-1 md:order-2">
                            <img
                                src="/placeholder.svg?height=400&width=600"
                                alt="AI playlist generation"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <div className="inline-block p-2 bg-primary/10 rounded-lg mb-2">
                                <BarChart className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-semibold">
                                Music Insights & Trends
                            </h3>
                            <p className="text-muted-foreground">
                                Track how your music taste evolves over time
                                with detailed analytics and visualizations.
                                Discover new artists and genres based on your
                                listening patterns.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Historical listening data</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Genre evolution tracking</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Personalized recommendations</span>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-lg overflow-hidden border shadow-lg">
                            <img
                                src="/placeholder.svg?height=400&width=600"
                                alt="Music insights and analytics"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 px-4 container">
                <h2 className="text-3xl font-bold mb-12 text-center">
                    What Our Users Say
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-lg border">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Sarah Johnson</h4>
                                <p className="text-sm text-muted-foreground">
                                    Music Enthusiast
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground">
                            "Maestro's analysis of my music taste was spot on!
                            The playlists it generates are perfect for my
                            workouts and study sessions."
                        </p>
                        <div className="flex mt-4">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-lg border">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Michael Chen</h4>
                                <p className="text-sm text-muted-foreground">
                                    DJ & Producer
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground">
                            "As a DJ, I use Maestro to discover new tracks and
                            create themed playlists for my sets. The AI
                            recommendations are incredibly accurate!"
                        </p>
                        <div className="flex mt-4">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-lg border">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold">
                                    Emma Rodriguez
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Fitness Instructor
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground">
                            "I create custom playlists for my fitness classes
                            using Maestro. My clients love the energy and flow
                            of the music selections!"
                        </p>
                        <div className="flex mt-4">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    How does Maestro analyze my music taste?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Maestro uses advanced AI algorithms to
                                    analyze your Spotify listening history,
                                    including your favorite artists, genres,
                                    tracks, and listening patterns. This data is
                                    processed to create a comprehensive profile
                                    of your musical preferences and personality.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    Is my Spotify data secure?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Yes, your data is secure. Maestro only
                                    accesses the data you explicitly grant
                                    permission for through Spotify's
                                    authentication process. We never store your
                                    Spotify password, and you can revoke access
                                    at any time.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger>
                                    How are the AI-generated playlists created?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Our AI combines your listening history,
                                    music preferences, and your specific request
                                    (mood or prompt) to generate a playlist. It
                                    uses deep learning models trained on music
                                    relationships and listener behaviors to
                                    create cohesive and personalized playlists.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4">
                                <AccordionTrigger>
                                    Can I edit the generated playlists?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Yes! Once a playlist is generated and saved
                                    to your Spotify account, you can edit it
                                    like any other playlist in Spotify. You can
                                    add or remove tracks, change the title or
                                    description, and share it with friends.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5">
                                <AccordionTrigger>
                                    Is Maestro free to use?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Maestro offers both free and premium tiers.
                                    The free tier allows basic analysis and a
                                    limited number of playlist generations per
                                    month. Premium subscribers get unlimited
                                    playlist generation, advanced analytics, and
                                    exclusive features.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Discover Your Music Personality?
                    </h2>
                    <p className="text-xl mb-8 text-muted-foreground">
                        Connect your Spotify account and get personalized
                        playlists in minutes.
                    </p>
                    <Button
                        size="lg"
                        onClick={handleGetStarted}
                        className="px-8"
                    >
                        {isAuthenticated
                            ? "Go to Dashboard"
                            : "Get Started with Spotify"}
                    </Button>
                </div>
            </section>
        </div>
    );
}
