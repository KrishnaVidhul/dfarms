'use client';

import React from 'react';

export default function MarketView({ marketPrices }: { marketPrices: any[] }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
            <table className="w-full text-left bg-gray-800">
                <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4 font-semibold tracking-wider">Pulse Type</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Location</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Price</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Trend</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Forecast (7d)</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-gray-300 text-sm">
                    {marketPrices.map((price: any) => (
                        <tr key={price.id} className="hover:bg-gray-750 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-200">{price.pulse_type}</td>
                            <td className="px-6 py-4 text-gray-300">{price.location}</td>
                            <td className="px-6 py-4 font-mono text-teal-300">{price.price}</td>
                            <td className="px-6 py-4">
                                {price.trend_direction === 'UP' ? (
                                    <span className="text-red-400 flex items-center gap-1">
                                        ▲ UP
                                    </span>
                                ) : price.trend_direction === 'DOWN' ? (
                                    <span className="text-green-400 flex items-center gap-1">
                                        ▼ DOWN
                                    </span>
                                ) : (
                                    <span className="text-gray-500 flex items-center gap-1">FLAT</span>
                                )}
                            </td>
                            <td className="px-6 py-4 font-mono text-blue-300">
                                {price.predicted_next_week ? `₹${parseFloat(price.predicted_next_week).toFixed(2)}` : '-'}
                            </td>
                            <td className="px-6 py-4">
                                {price.recommendation === 'Buy' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-200 border border-green-700">
                                        Buy
                                    </span>
                                ) : price.recommendation === 'Sell' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/60 text-red-200 border border-red-700">
                                        Sell
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/60 text-yellow-200 border border-yellow-700">
                                        Wait
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {marketPrices.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No market data available yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
