'use client';

import React from 'react';
import { TrendingUp, AlertCircle, Package, DollarSign } from 'lucide-react';

interface Metric {
    label: string;
    value: string;
    trend?: string;
    icon: any;
    color: string;
}

export default function KPIGrid({ metrics }: { metrics: any }) {
    const cards: Metric[] = [
        { label: 'Total Revenue', value: `₹${metrics.finance.revenue.toLocaleString()}`, trend: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
        { label: 'Inventory Value', value: '₹12.4 Lakh', trend: '+2.1%', icon: Package, color: 'text-blue-500' }, // Hardcoded for demo/estimate
        { label: 'Active Alerts', value: '3 Urgent', trend: 'Needs Review', icon: AlertCircle, color: 'text-red-500' },
        { label: 'Marketing ROI', value: '185%', trend: '+5.4%', icon: TrendingUp, color: 'text-purple-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-[#161B22] border border-[#1F242C] p-5 rounded-lg hover:border-zinc-700 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-md bg-opacity-10 ${card.color.replace('text-', 'bg-')}`}>
                            <card.icon size={20} className={card.color} />
                        </div>
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{card.trend}</span>
                    </div>
                    <div>
                        <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">{card.label}</h3>
                        <p className="text-2xl font-mono text-white font-semibold">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
