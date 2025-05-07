import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/auth-context";
import Layout from "./components/layout";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import CallbackPage from "./pages/callback";
import DashboardPage from "./pages/dashboard";
import AnalysisPage from "./pages/analysis";
import PlaylistsPage from "./pages/playlists";
import GeneratePlaylistPage from "./pages/generate-playlist";
import ProtectedRoute from "./components/protected-route";

function App() {
    return (
        <AuthProvider>
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
                        path="playlists"
                        element={
                            <ProtectedRoute>
                                <PlaylistsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="generate"
                        element={
                            <ProtectedRoute>
                                <GeneratePlaylistPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
            <Toaster />
        </AuthProvider>
    );
}

export default App;
