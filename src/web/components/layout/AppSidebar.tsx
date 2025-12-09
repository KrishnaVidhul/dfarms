'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

    return (
        <aside className="w-64 bg-[#0F1115] border-r border-[#1F242C] flex flex-col fixed h-full z-20">
            {/* Brand */}
            <div className="h-14 flex items-center px-6 border-b border-[#1F242C]">
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
                                        (item as any).className // Apply custom classes if they exist
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
            <div className="p-4 border-t border-[#1F242C]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">OP</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Operator</p>
                        <p className="text-xs text-zinc-500 truncate">Day Shift</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
