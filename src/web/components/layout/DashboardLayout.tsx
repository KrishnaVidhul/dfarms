'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
// I'll assume standard Shadcn/Tailwind merge utils path or copy local function.
// Sidebar.tsx had local cn. I'll import from generic if available, or just use templating.
// I'll check if @/lib/utils exists. If not, I'll simple template.

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, setSidebarOpen } = useUIStore();

    // Auto-close on mobile mount? Or check window
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        // Initial check
        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [setSidebarOpen]);

    return (
        <div className="min-h-screen bg-[#09090B] font-sans antialiased relative">
            {/* Sidebar */}
            <AppSidebar />

            {/* Header */}
            <AppHeader />

            {/* Main Content */}
            <main
                className={`pt-14 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:pl-64' : 'pl-0'
                    }`}
            >
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden glass-backdrop"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
