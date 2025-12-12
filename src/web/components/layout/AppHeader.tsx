'use client';

import React, { useState } from 'react';
import { Search, Bell, HelpCircle, X, Check } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import CommoditySwitcher from '../CommoditySwitcher';

export default function AppHeader() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNotifications(data);
                }
            } catch (e) {
                console.error('Failed to fetch notifications');
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // 1 min poll
        return () => clearInterval(interval);
    }, []);

    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <header
            className={`h-14 bg-[#0F1115] border-b border-[#1F242C] flex items-center justify-between px-4 fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:left-64 left-0' : 'left-0'
                }`}
        >
            {/* Left: Toggle & Command Bar */}
            <div className="flex-1 max-w-xl flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSidebar}
                        className="text-zinc-400 hover:text-white transition-colors p-1"
                    >
                        <span className="sr-only">Toggle Sidebar</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Brand in Header (Visible when Sidebar Closed) */}
                    {!isSidebarOpen && (
                        <div className="flex items-center gap-2 mr-4 transition-opacity duration-300">
                            <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center font-bold text-[10px] text-white">D</div>
                            <span className="font-bold text-gray-100 tracking-tight text-sm">D Farms OS</span>
                        </div>
                    )}
                </div>

                <React.Suspense fallback={<div className="w-32 h-8 bg-gray-800 rounded animate-pulse" />}>
                    <CommoditySwitcher />
                </React.Suspense>

                <div className="relative group flex-1 hidden md:block">
                    {/* Search Input (Hidden on super small screens layout, visible on md) */}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-zinc-300 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Ask Agent or search..."
                        className="w-full bg-[#161B22] border border-[#1F242C] text-sm text-gray-200 rounded-md py-1.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 placeholder:text-zinc-600 transition-all font-sans"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1 font-mono text-[10px] font-medium text-zinc-400">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 relative">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`text-zinc-400 hover:text-zinc-100 transition-colors relative ${showNotifications ? 'text-zinc-100' : ''}`}
                >
                    <Bell size={18} />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F1115]"></span>
                    )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                    <div className="absolute top-12 right-0 w-80 bg-[#161B22] border border-[#2D333B] rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="p-3 border-b border-[#2D333B] flex justify-between items-center bg-[#0d1117]">
                            <h3 className="text-xs font-semibold text-gray-200">Notifications</h3>
                            <button onClick={() => setNotifications([])} className="text-[10px] text-blue-400 hover:text-blue-300">Mark all read</button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-xs">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="p-3 border-b border-[#2D333B]/50 hover:bg-[#1C2128] transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-medium ${notif.type === 'critical' ? 'text-red-400' :
                                                notif.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                                                }`}>{notif.title}</span>
                                            <span className="text-[10px] text-gray-600 group-hover:text-gray-500">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed">{notif.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <button className="text-zinc-400 hover:text-zinc-100 transition-colors">
                    <HelpCircle size={18} />
                </button>
            </div>
        </header>
    );
}
