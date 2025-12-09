// @ts-nocheck
import { clsx } from 'clsx';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

'use client';

const mockData = [
  { name: 'Jan', N: 100, P: 50, K: 200 },
  { name: 'Feb', N: 120, P: 60, K: 220 },
  { name: 'Mar', N: 140, P: 70, K: 240 },
  { name: 'Apr', N: 160, P: 80, K: 260 },
  { name: 'May', N: 180, P: 90, K: 280 },
];

export default function Page() {
  return (
    <div className={clsx('flex', 'flex-col', 'p-4', 'bg-gray-800', 'rounded-lg', 'shadow-lg')}>
      <div className={clsx('flex', 'items-center', 'justify-between', 'mb-4')}>
        <h2 className={clsx('text-lg', 'font-bold', 'text-gray-200')}>Soil Nutrient Analyzer</h2>
        <Activity size={24} className={clsx('text-gray-400')} />
      </div>
      <LineChart width={500} height={300} data={mockData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="N" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="P" stroke="#82ca9d" />
        <Line type="monotone" dataKey="K" stroke="#ffc107" />
      </LineChart>
      <div className={clsx('flex', 'flex-col', 'mt-4')}>
        <p className={clsx('text-gray-200', 'text-sm')}>N: Nitrogen, P: Phosphorus, K: Potassium</p>
      </div>
    </div>
  );
}