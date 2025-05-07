import { Link } from "react-router-dom";
import { Music, Github, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Music className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">Maestro</span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            Discover your music personality and get AI-generated
                            playlists based on your Spotify listening history.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon" asChild>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                >
                                    <Github className="h-5 w-5" />
                                </a>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">
                            Navigation
                        </h3>
                        <div className="flex flex-col space-y-2">
                            <Link
                                to="/"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/dashboard"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/analysis"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Analysis
                            </Link>
                            <Link
                                to="/playlists"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Playlists
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">
                            Resources
                        </h3>
                        <div className="flex flex-col space-y-2">
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Help Center
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">
                            Newsletter
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to our newsletter for updates and new
                            features.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-3 py-2 rounded-md border bg-background"
                            />
                            <Button type="submit" className="w-full">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                        © {new Date().getFullYear()} Maestro. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
