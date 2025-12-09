// @ts-nocheck
import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import { LineChart, Line } from 'recharts';

'use client';

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
  const [voiceLog, setVoiceLog] = useState([
    { id: 1, log: 'Procurement of seeds' },
    { id: 2, log: 'Order of fertilizers' },
    { id: 3, log: 'Purchase of farming equipment' },
  ]);

  const handleVoiceLog = () => {
    setVoiceLog([...voiceLog, { id: voiceLog.length + 1, log: 'New log' }]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 mb-12 bg-neutral-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-100 mb-4">
        Voice-to-Text Procurement Logging
      </h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleVoiceLog}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <Circle className="mr-2" size={20} />
          Add New Log
        </button>
        <Activity size={24} className="text-gray-500" />
      </div>
      <div className="mb-12">
        <LineChart width={600} height={300} data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </div>
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Voice Logs</h2>
      <ul>
        {voiceLog.map((log) => (
          <li key={log.id} className="bg-neutral-700 p-4 mb-4 rounded">
            <p>{log.log}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}