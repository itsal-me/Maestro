"use client";

import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Footer from "./footer";

export default function Layout() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex">
                {isAuthenticated && <Sidebar />}
                <main
                    className={`flex-1 ${
                        isAuthenticated ? "p-6 md:p-8" : "p-0"
                    }`}
                >
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}
