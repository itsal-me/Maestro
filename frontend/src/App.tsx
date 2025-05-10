import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import Layout from "@/components/layout";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import AnalysisPage from "@/pages/analysis";
import PlaylistGeneratorPage from "@/pages/generate-playlist";
import PlaylistsPage from "@/pages/playlists";
import ProtectedRoute from "@/components/protected-route";
import CallbackPage from "./pages/callback";

function App() {
    return (
        <ThemeProvider defaultTheme="dark">
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="callback" element={<CallbackPage />} />
                            <Route
                                path="dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="analysis"
                                element={
                                    <ProtectedRoute>
                                        <AnalysisPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="generate"
                                element={
                                    <ProtectedRoute>
                                        <PlaylistGeneratorPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="playlists"
                                element={
                                    <ProtectedRoute>
                                        <PlaylistsPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
            <Toaster />
        </ThemeProvider>
    );
}

export default App;
