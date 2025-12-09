'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceTrendChart({ data }: { data: any[] }) {
    // 1. Dynamic Product Extraction
    // Determine available products from the data. 
    // Fallback if data is empty (Mock mode for demo)
    const hasData = data && data.length > 0;

    // Extract unique products (assuming 'item' or 'name' or 'commodity' field)
    // We try multiple fields to be robust to schema
    const getProductName = (d: any) => d.pulse_type || d.item || d.name || 'Unknown';

    const uniqueProducts = hasData
        ? Array.from(new Set(data.map(getProductName))).sort()
        : ['Tur Dal', 'Chana', 'Moong Dal', 'Urad Dal'];

    const [selectedProduct, setSelectedProduct] = React.useState(uniqueProducts[0]);

    // Update selected product if data changes and current selection is invalid
    React.useEffect(() => {
        if (uniqueProducts.length > 0 && !uniqueProducts.includes(selectedProduct)) {
            setSelectedProduct(uniqueProducts[0]);
        }
    }, [uniqueProducts, selectedProduct]);

    // 2. Filter Data
    let chartData = [];
    if (hasData) {
        chartData = data
            .filter(d => getProductName(d) === selectedProduct)
            // Sort by date/time if available, else assume ordered
            .map(d => ({
                name: new Date(d.date || d.timestamp || Date.now()).toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: d.date,
                price: Number(d.price)
            }))
            .slice(0, 7); // Last 7 points
    } else {
        // Mock Data generator for specific product
        const basePrice = selectedProduct === 'Tur Dal' ? 120 : selectedProduct === 'Chana' ? 65 : 100;
        chartData = [
            { name: 'Mon', price: basePrice - 2 },
            { name: 'Tue', price: basePrice + 1 },
            { name: 'Wed', price: basePrice - 1 },
            { name: 'Thu', price: basePrice + 3 },
            { name: 'Fri', price: basePrice + 2 },
            { name: 'Sat', price: basePrice + 5 },
            { name: 'Sun', price: basePrice + 6 },
        ];
    }

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-5 h-[350px] flex flex-col w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-gray-200 font-semibold text-sm">Market Pulse Trends</h3>
                    <p className="text-zinc-500 text-xs">7-Day Price Action</p>
                </div>
                <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-zinc-400 text-xs rounded px-2 py-1 outline-none focus:border-emerald-500 transition-colors"
                >
                    {uniqueProducts.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D333B" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fill: '#6e7681' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={['dataMin - 5', 'dataMax + 5']}
                            tick={{ fontSize: 10, fill: '#6e7681' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '12px', borderRadius: '6px' }}
                            itemStyle={{ color: '#e6edf3' }}
                            labelStyle={{ color: '#8b949e', marginBottom: '4px' }}
                            formatter={(value: any) => [`₹${value}`, 'Price']}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 3 }}
                            activeDot={{ r: 5, fill: '#fff' }}
                            animationDuration={300}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
