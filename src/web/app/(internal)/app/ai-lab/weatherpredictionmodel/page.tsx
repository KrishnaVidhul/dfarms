// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Page() {
  const [weatherData, setWeatherData] = useState([
    { name: 'Jan', temperature: 20, precipitation: 10 },
    { name: 'Feb', temperature: 22, precipitation: 12 },
    { name: 'Mar', temperature: 25, precipitation: 15 },
    { name: 'Apr', temperature: 28, precipitation: 18 },
    { name: 'May', temperature: 30, precipitation: 20 },
    { name: 'Jun', temperature: 32, precipitation: 22 },
    { name: 'Jul', temperature: 35, precipitation: 25 },
    { name: 'Aug', temperature: 38, precipitation: 28 },
    { name: 'Sep', temperature: 35, precipitation: 25 },
    { name: 'Oct', temperature: 30, precipitation: 20 },
    { name: 'Nov', temperature: 25, precipitation: 15 },
    { name: 'Dec', temperature: 20, precipitation: 10 },
  ]);

  return (
    <div className="flex flex-col h-screen p-4 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold dark:text-white">Weather Prediction Model</h2>
        <Activity size={24} className="text-gray-500 dark:text-gray-300" />
      </div>
      <div className="flex-1">
        <LineChart width={500} height={300} data={weatherData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="precipitation" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}