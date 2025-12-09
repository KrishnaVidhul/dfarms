// @ts-nocheck
import { useClient } from 'next';
import { Activity, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

'use client';

const data = [
  { name: 'Jan', value: 100 },
  { name: 'Feb', value: 120 },
  { name: 'Mar', value: 140 },
  { name: 'Apr', value: 160 },
  { name: 'May', value: 180 },
  { name: 'Jun', value: 200 },
];

export default function Page() {
  const [waterLevel, setWaterLevel] = useState(50);
  const [soilMoisture, setSoilMoisture] = useState(60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWaterLevel((prevValue) => prevValue + 1);
      setSoilMoisture((prevValue) => prevValue + 0.5);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold text-white mb-4">Smart Irrigation Controller</h2>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <Circle size={24} className="text-blue-500" />
          <span className="ml-2 text-white">Water Level: {waterLevel}%</span>
        </div>
        <div className="flex items-center">
          <Activity size={24} className="text-green-500" />
          <span className="ml-2 text-white">Soil Moisture: {soilMoisture}%</span>
        </div>
      </div>
      <LineChart width={500} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      <button
        className={clsx(
          'mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg',
          'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        )}
      >
        Start Irrigation
      </button>
    </div>
  );
}