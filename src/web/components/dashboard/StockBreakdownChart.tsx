'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BreakdownItem {
    name: string;
    value: number;
    fill: string;
    [key: string]: any; // Fix for Recharts index signature requirement
}

export default function StockBreakdownChart({ data }: { data: BreakdownItem[] }) {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6 h-full shadow-lg flex flex-col">
            <h3 className="text-gray-200 text-sm font-semibold mb-1">Stock Breakdown</h3>
            <p className="text-xs text-gray-500 mb-4">Total Inventory: {total.toLocaleString()} kg</p>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0)" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6', borderRadius: '8px' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            formatter={(value: number) => `${value.toLocaleString()} kg`}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
