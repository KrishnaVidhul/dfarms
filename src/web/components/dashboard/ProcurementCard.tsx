'use client';

import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface ProcurementCardProps {
    data: {
        avgPurchasePrice: number;
        currentMarketPrice: number;
        diffPercent: number;
    };
    commodityName: string;
}

export default function ProcurementCard({ data, commodityName }: ProcurementCardProps) {
    if (data.avgPurchasePrice === 0) {
        return (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6 flex flex-col justify-between h-full shadow-lg">
                <div>
                    <h3 className="text-zinc-400 text-sm font-medium">Procurement Opportunity</h3>
                    <p className="text-xs text-zinc-500 mt-1">Avg Purchase vs Market ({commodityName})</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-zinc-500 text-sm font-medium">No Stock History</p>
                    <p className="text-xs text-zinc-600 mt-1">Add inventory to track margins</p>
                </div>
            </div>
        );
    }

    const isProfitable = data.currentMarketPrice > data.avgPurchasePrice;

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6 flex flex-col justify-between h-full shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium">Procurement Opportunity</h3>
                    <p className="text-xs text-gray-500 mt-1">Avg Purchase vs Market ({commodityName})</p>
                </div>
                {isProfitable ? (
                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                ) : (
                    <div className="bg-red-500/10 p-2 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                )}
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-gray-500 text-xs">Your Avg Cost</p>
                        <p className="text-2xl font-bold text-white">₹{data.avgPurchasePrice.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 mb-2" />
                    <div className="text-right">
                        <p className="text-gray-500 text-xs">Market Price</p>
                        <p className={`text-2xl font-bold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                            ₹{data.currentMarketPrice.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className={`text-sm flex items-center gap-1 ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>
                    <span>{data.diffPercent > 0 ? '+' : ''}{data.diffPercent.toFixed(1)}%</span>
                    <span className="text-gray-500">potential margin</span>
                </div>
            </div>
        </div>
    );
}
