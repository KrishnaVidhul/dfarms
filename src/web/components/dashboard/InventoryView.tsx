'use client';

import React, { useEffect, useState } from 'react';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

export default function InventoryView({ inventory }: { inventory: any[] }) {
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setNow(new Date().getTime());
    }, []);

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-[#1F242C] bg-[#161B22] flex justify-between items-center">
                <h3 className="text-gray-200 font-semibold text-sm">Inventory Holdings</h3>
                <div className="flex gap-2">
                    <button className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded hover:bg-zinc-700 transition">Filter</button>
                    <button className="text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-900 px-3 py-1.5 rounded hover:bg-emerald-900/60 transition">Add Stock</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0d1117] text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-5 py-3 border-b border-[#1F242C] w-1/5">Batch ID</th>
                            <th className="px-5 py-3 border-b border-[#1F242C] w-1/5">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300">
                                    Item <ArrowUpDown size={12} />
                                </div>
                            </th>
                            <th className="px-5 py-3 border-b border-[#1F242C] w-1/6">Grade</th>
                            <th className="px-5 py-3 border-b border-[#1F242C] text-right w-1/6">Qty (kg)</th>
                            <th className="px-5 py-3 border-b border-[#1F242C] text-right w-1/6">Expiry (FEFO)</th>
                            <th className="px-5 py-3 border-b border-[#1F242C] text-center w-1/6">Status</th>
                            <th className="px-5 py-3 border-b border-[#1F242C] w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F242C] text-sm">
                        {inventory.map((item: any) => {
                            const expiry = item.expiry_date ? new Date(item.expiry_date) : null;
                            let isExpiring = false;
                            let diffDays = 999;

                            if (expiry && now) {
                                const diffTime = expiry.getTime() - now;
                                diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                isExpiring = diffDays <= 30;
                            }

                            return (
                                <tr key={item.id} className="hover:bg-[#1F242C]/50 transition-colors group">
                                    <td className="px-5 py-3 font-mono text-xs text-zinc-500">{item.batch_id || '-'}</td>
                                    <td className="px-5 py-3 font-medium text-gray-200">{item.pulse_type}</td>
                                    <td className="px-5 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                                            {item.grade}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right font-mono text-emerald-400 font-medium">{Number(item.weight_kg).toLocaleString()}</td>
                                    <td className={`px-5 py-3 text-right font-mono text-xs ${isExpiring ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                                        {expiry ? expiry.toLocaleDateString() : '-'}
                                        {isExpiring && <span className="ml-2 text-[10px] bg-red-900/30 text-red-400 px-1 py-0.5 rounded">{diffDays}d</span>}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <div className={`w-2 h-2 rounded-full mx-auto ${isExpiring ? 'bg-red-500 animate-pulse' :
                                            item.status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} title={item.status}></div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {inventory.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 text-sm">No inventory records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
