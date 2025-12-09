'use client';

import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function AppHeader() {
    return (
        <header className="h-14 bg-[#0F1115] border-b border-[#1F242C] flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10">

            {/* Global Command Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-zinc-300 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Ask D Farms Agent or search inventory..."
                        className="w-full bg-[#161B22] border border-[#1F242C] text-sm text-gray-200 rounded-md py-1.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 placeholder:text-zinc-600 transition-all font-sans"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1 font-mono text-[10px] font-medium text-zinc-400">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => alert("Recent Alerts:\n1. Low Stock: Chana (500kg)\n2. Market Trend: Tur Dal Rising\n3. Invoice Overdue: BigBasket")}
                    className="text-zinc-400 hover:text-zinc-100 transition-colors relative"
                >
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F1115]"></span>
                </button>
                <button className="text-zinc-400 hover:text-zinc-100 transition-colors">
                    <HelpCircle size={18} />
                </button>
            </div>
        </header>
    );
}
