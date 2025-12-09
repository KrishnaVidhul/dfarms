// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const mockData = [
  { name: 'Crop 1', score: 80 },
  { name: 'Crop 2', score: 70 },
  { name: 'Crop 3', score: 90 },
  { name: 'Crop 4', score: 85 },
  { name: 'Crop 5', score: 95 },
];

export default function Page() {
  const [chartData, setChartData] = useState(mockData);

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-2xl font-bold text-white mb-4">AI Visual Grading v2</h2>
      <div className="flex justify-between mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Activity className="mr-2" size={20} /> Analyze
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          <Circle className="mr-2" size={20} /> Refresh
        </button>
      </div>
      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
    </div>
  );
}