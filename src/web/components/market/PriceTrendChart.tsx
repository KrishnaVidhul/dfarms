'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PriceTrendChartProps {
    data: any[];
    commodity: string;
}

export default function PriceTrendChart({ data, commodity }: PriceTrendChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 h-[400px] flex items-center justify-center">
                <p className="text-zinc-500 text-sm">No price trend data available. Select a commodity to view trends.</p>
            </div>
        );
    }

    // Format data for chart
    const chartData = data.map(item => ({
        date: new Date(item.arrival_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        'Min Price': parseFloat(item.avg_min_price || 0).toFixed(2),
        'Max Price': parseFloat(item.avg_max_price || 0).toFixed(2),
        'Modal Price': parseFloat(item.avg_modal_price || 0).toFixed(2),
        markets: item.market_count
    }));

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-200">Price Trends - {commodity}</h3>
                <p className="text-xs text-zinc-500 mt-1">Average prices across all markets (₹/quintal)</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F242C" />
                    <XAxis
                        dataKey="date"
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                        label={{ value: '₹/Quintal', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0d1117',
                            border: '1px solid #1F242C',
                            borderRadius: '8px',
                            color: '#E5E7EB'
                        }}
                        formatter={(value: any) => `₹${value}`}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Min Price"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Modal Price"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: '#10B981', r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Max Price"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: '#F59E0B', r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
