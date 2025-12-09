// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line } from 'recharts';

const mockData = [
  { name: 'Jan', moisture: 50, temperature: 20 },
  { name: 'Feb', moisture: 60, temperature: 22 },
  { name: 'Mar', moisture: 55, temperature: 25 },
  { name: 'Apr', moisture: 65, temperature: 28 },
  { name: 'May', moisture: 70, temperature: 30 },
  { name: 'Jun', moisture: 75, temperature: 32 },
  { name: 'Jul', moisture: 80, temperature: 35 },
  { name: 'Aug', moisture: 85, temperature: 38 },
  { name: 'Sep', moisture: 80, temperature: 32 },
  { name: 'Oct', moisture: 75, temperature: 28 },
  { name: 'Nov', moisture: 70, temperature: 25 },
  { name: 'Dec', moisture: 65, temperature: 22 },
];

export default function Page() {
  const [waterLevel, setWaterLevel] = useState(50);
  const [moistureLevel, setMoistureLevel] = useState(50);
  const [temperature, setTemperature] = useState(20);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWaterLevel(Math.floor(Math.random() * 100));
      setMoistureLevel(Math.floor(Math.random() * 100));
      setTemperature(Math.floor(Math.random() * 40));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-gray-600 rounded-lg">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Smart Irrigation Controller</h2>
      <div className="flex flex-row justify-between w-full mb-4">
        <div className="flex flex-col items-center justify-center">
          <Activity size={24} className="text-gray-200 mb-2" />
          <h3 className="text-sm font-bold text-gray-200">Water Level</h3>
          <p className="text-3xl font-bold text-gray-200">{waterLevel}%</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Activity size={24} className="text-gray-200 mb-2" />
          <h3 className="text-sm font-bold text-gray-200">Moisture Level</h3>
          <p className="text-3xl font-bold text-gray-200">{moistureLevel}%</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Activity size={24} className="text-gray-200 mb-2" />
          <h3 className="text-sm font-bold text-gray-200">Temperature</h3>
          <p className="text-3xl font-bold text-gray-200">{temperature}°C</p>
        </div>
      </div>
      <LineChart width={400} height={200} data={mockData}>
        <Line type="monotone" dataKey="moisture" stroke="#4CAF50" />
        <Line type="monotone" dataKey="temperature" stroke="#FF9800" />
      </LineChart>
    </div>
  );
}