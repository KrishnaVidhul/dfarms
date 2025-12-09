// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line } from 'recharts';

const procurementLoggingData = [
  { date: '2024-01-01', quantity: 100 },
  { date: '2024-01-02', quantity: 120 },
  { date: '2024-01-03', quantity: 110 },
  { date: '2024-01-04', quantity: 130 },
  { date: '2024-01-05', quantity: 105 },
];

export default function Page() {
  const [voiceText, setVoiceText] = useState('');
  const [logs, setLogs] = useState(procurementLoggingData);

  const handleVoiceToText = () => {
    // Mock voice-to-text functionality
    const voiceTextData = 'Procured 100 units of wheat on 2024-01-06';
    setVoiceText(voiceTextData);
    setLogs([...logs, { date: '2024-01-06', quantity: 100 }]);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Voice-to-Text Procurement Logging</h2>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          onClick={handleVoiceToText}
        >
          <Activity className="mr-2" size={20} />
          Start Voice-to-Text
        </button>
      </div>
      <div className="mb-4">
        <p className="text-white">Voice-to-Text Input:</p>
        <p className="text-gray-400">{voiceText}</p>
      </div>
      <LineChart width={400} height={200} data={logs}>
        <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
      </LineChart>
      <div className="mt-4">
        <p className="text-white">Procurement Logs:</p>
        <ul>
          {logs.map((log, index) => (
            <li key={index} className="text-gray-400">
              {log.date}: {log.quantity} units
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}