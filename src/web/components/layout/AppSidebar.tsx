'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '../../store/uiStore';
import {
    LayoutDashboard,
    Package,
    TrendingUp,
    FlaskConical,
    Users,
    Settings,
    LifeBuoy,
    Activity,
    FileCode
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    {
        group: 'OPERATIONS', items: [
            { label: 'Dashboard', icon: LayoutDashboard, href: '/app' },
            { label: 'Inventory', icon: Package, href: '/app/inventory' },
            { label: 'Finance & Ops', icon: LifeBuoy, href: '/app/finance' },
            { label: 'Fleet & Logistics', icon: TrendingUp, href: '/app/logistics' }, // Added
            { label: 'Human Resources', icon: Users, href: '/app/hr' }, // Added
        ]
    },
    {
        group: 'INTELLIGENCE', items: [
            { label: 'Market Intel', icon: TrendingUp, href: '/app/market' }, // TrendingUp icon reused, maybe use Activity
            { label: 'Quality Lab', icon: FlaskConical, href: '/app/quality' },
            { label: 'Documents', icon: Package, href: '/app/documents' }, // Added placeholder
        ]
    },
    {
        group: 'ADMIN', items: [
            { label: 'Admin Panel', icon: Users, href: '/admin' },
            { label: 'Settings', icon: Settings, href: '/app/settings' },
            { label: 'Feature Registry', icon: FileCode, href: '/app/registry' }, // Added Feature Registry
            { icon: Activity, label: 'Neural Link (AI Lab)', href: '/app/ai-lab', className: 'text-emerald-400' },
        ]
    },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const { isSidebarOpen } = useUIStore();

    return (
        <aside
            className={cn(
                "fixed top-0 bottom-0 left-0 z-20 w-64 bg-[#0F1115] border-r border-[#1F242C] flex flex-col transition-transform duration-300 ease-in-out",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Brand */}
            <div className="h-14 flex items-center px-6 border-b border-[#1F242C] shrink-0">
                <div className="w-4 h-4 rounded bg-emerald-500 mr-2 flex items-center justify-center font-bold text-[10px] text-white">D</div>
                <span className="font-bold text-gray-100 tracking-tight">D Farms OS</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
                {navItems.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="px-3 text-xs font-semibold text-zinc-500 mb-2">{group.group}</h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                        pathname === item.href
                                            ? "bg-zinc-800 text-white"
                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50",
                                        (item as any).className
                                    )}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-[#1F242C] shrink-0">
                <Link href="/app/settings" className="flex items-center gap-3 mb-3 hover:bg-zinc-800/50 p-2 -mx-2 rounded-md transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300 group-hover:border-zinc-500 transition-colors">OP</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">Operator</p>
                        <p className="text-xs text-zinc-500 truncate">Day Shift</p>
                    </div>
                </Link>
                <button
                    onClick={() => window.location.href = '/api/auth/logout'}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium py-2 rounded-md transition-colors border border-red-500/20"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                </button>
            </div>
        </aside>
    );
}
