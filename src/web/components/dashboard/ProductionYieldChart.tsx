'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface YieldData {
    targetYield: number;
    currentYield: number;
    history: { batch: string; yield: number }[];
}

export default function ProductionYieldChart({ data }: { data: YieldData }) {
    if (data.history.length === 0) {
        return (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6 h-full shadow-lg flex flex-col">
                <div className="mb-4">
                    <h3 className="text-gray-200 text-sm font-semibold">Milling Yield Performance</h3>
                    <p className="text-xs text-gray-500">Output % per Batch</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-zinc-600 text-sm">No production data yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6 h-full shadow-lg flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h3 className="text-gray-200 text-sm font-semibold">Milling Yield Performance</h3>
                    <p className="text-xs text-gray-500">Output % per Batch</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-emerald-400">{data.currentYield}%</span>
                    <p className="text-[10px] text-gray-500">Current Batch</p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.history}>
                        <XAxis
                            dataKey="batch"
                            stroke="#4B5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#4B5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={[60, 80]}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            itemStyle={{ color: '#F3F4F6' }}
                        />
                        <ReferenceLine y={data.targetYield} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Target', fill: '#10B981', fontSize: 10 }} />
                        <Bar dataKey="yield" radius={[4, 4, 0, 0]}>
                            {data.history.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.yield >= data.targetYield ? '#10B981' : '#F59E0B'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
