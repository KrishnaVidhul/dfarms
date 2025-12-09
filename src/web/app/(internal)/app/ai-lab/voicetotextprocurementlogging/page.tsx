// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const procurementData = [
  { month: 'Jan', quantity: 100 },
  { month: 'Feb', quantity: 120 },
  { month: 'Mar', quantity: 110 },
  { month: 'Apr', quantity: 130 },
  { month: 'May', quantity: 140 },
  { month: 'Jun', quantity: 150 },
];

export default function Page() {
  const [voiceLog, setVoiceLog] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, log: 'Procured 100 units of seeds' },
    { id: 2, log: 'Procured 50 units of fertilizers' },
  ]);

  const handleVoiceLog = () => {
    setLogs([...logs, { id: logs.length + 1, log: voiceLog }]);
    setVoiceLog('');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <Activity size={24} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Speak or type procurement log"
          value={voiceLog}
          onChange={(e) => setVoiceLog(e.target.value)}
          className="w-full p-2 pl-10 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-gray-500"
        />
        <button
          onClick={handleVoiceLog}
          className="ml-2 p-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-md"
        >
          Log
        </button>
      </div>
      <div className="mb-4">
        <LineChart width={500} height={300} data={procurementData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="quantity" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="p-2 bg-gray-700 border border-gray-600 rounded-md mb-2">
            {log.log}
          </li>
        ))}
      </ul>
    </div>
  );
}