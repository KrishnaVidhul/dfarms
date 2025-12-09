'use client';
// @ts-nocheck
import { clsx } from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
        </svg>
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