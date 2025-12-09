// @ts-nocheck
'use client';

import { Activity, Circle } from 'lucide-react';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { clsx } from 'clsx';

const mockData = [
  { temperature: 25, precipitation: 10, date: '2023-01-01' },
  { temperature: 22, precipitation: 15, date: '2023-01-02' },
  { temperature: 28, precipitation: 5, date: '2023-01-03' },
  { temperature: 20, precipitation: 20, date: '2023-01-04' },
  { temperature: 24, precipitation: 12, date: '2023-01-05' },
];

export default function Page() {
  const [data, setData] = useState(mockData);

  return (
    <div className="p-4 bg-gray-800 rounded-md shadow-md">
      <h2 className="text-lg font-bold text-gray-200 mb-2">
        <Activity className="text-gray-400 mr-2" size={20} />
        Weather Prediction Model
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center mb-4">
        <div className="mr-4">
          <Circle className="text-gray-400" size={40} />
        </div>
        <div>
          <p className="text-gray-200 text-sm">
            Our advanced weather prediction model uses machine learning algorithms to forecast temperature and precipitation levels.
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: 'gray' }} />
          <YAxis tick={{ fill: 'gray' }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="precipitation"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}