'use client';

import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function ActivityFeed() {
    // Mock data for now, ideally fetched from logs table
    const activities = [
        { id: 1, type: 'success', text: 'Agent added 500kg Chana to Inventory', time: '2m ago' },
        { id: 2, type: 'info', text: 'Market Scan completed for Akola region', time: '15m ago' },
        { id: 3, type: 'warning', text: 'High price alert: Tur Dal exceeds ₹110', time: '1h ago' },
        { id: 4, type: 'success', text: 'Generated Invoice #INV-2024-001', time: '3h ago' },
        { id: 5, type: 'info', text: 'Daily Backup completed successfully', time: '5h ago' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={14} className="text-emerald-500" />;
            case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
            default: return <Activity size={14} className="text-blue-500" />;
        }
    }

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-5 h-[350px] overflow-hidden flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-gray-200 font-semibold text-sm">Activity Stream</h3>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {activities.map((act) => (
                    <div key={act.id} className="flex gap-3 items-start group">
                        <div className="mt-0.5 relative">
                            <div className="absolute top-4 bottom-0 left-[7px] w-px bg-zinc-800 -z-10 group-last:hidden"></div>
                            {getIcon(act.type)}
                        </div>
                        <div>
                            <p className="text-sm text-zinc-300 leading-tight">{act.text}</p>
                            <p className="text-[11px] text-zinc-600 mt-1 font-mono">{act.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
