// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

export default function Page() {
  const [log, setLog] = useState('');

  const handleVoiceToText = () => {
    setLog('Procurement log: Ordered 100 units of seeds');
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-lg font-bold text-gray-200 mb-2">Voice-to-Text Procurement Logging</h2>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-gray-200 py-2 px-4 rounded"
        onClick={handleVoiceToText}
      >
        <Activity size={20} className="mr-2" />
        Log Procurement
      </button>
      <p className="text-gray-200 mt-2">{log}</p>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}