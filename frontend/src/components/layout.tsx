"use client";

import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import { useAuth } from "@/hooks/use-auth";

export default function Layout() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const isLoginPage = location.pathname === "/login";

    // Don't show sidebar on home or login pages
    const showNav = isAuthenticated && !isHomePage && !isLoginPage;

    return (
        <div className="flex h-screen bg-background">
            {showNav && (
                <>
                    <Sidebar className="hidden md:block" />
                    <MobileNav className="md:hidden" />
                </>
            )}
            <main
                className={`flex-1 overflow-auto ${showNav ? "md:ml-64" : ""} ${
                    showNav ? "mt-16 md:mt-0" : ""
                }`}
            >
                <Outlet />
            </main>
        </div>
    );
}
