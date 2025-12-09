// @ts-nocheck
import { useState } from 'react';
import { Activity, Circle, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

'use client';

const procurementData = [
  { name: 'Jan', quantity: 100 },
  { name: 'Feb', quantity: 120 },
  { name: 'Mar', quantity: 140 },
  { name: 'Apr', quantity: 160 },
  { name: 'May', quantity: 180 },
];

export default function Page() {
  const [voiceLog, setVoiceLog] = useState('');
  const [procurementLogs, setProcurementLogs] = useState([
    { id: 1, log: 'Procurement of seeds' },
    { id: 2, log: 'Procurement of fertilizers' },
  ]);

  const handleVoiceLog = () => {
    setProcurementLogs([...procurementLogs, { id: procurementLogs.length + 1, log: voiceLog }]);
    setVoiceLog('');
  };

  return (
    <div className="p-4 dark:bg-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Voice-to-Text Procurement Logging</h1>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <Circle size={24} className="mr-2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={voiceLog}
            onChange={(e) => setVoiceLog(e.target.value)}
            placeholder="Speak to log procurement"
            className="w-64 p-2 pl-10 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
          />
          <button
            onClick={handleVoiceLog}
            className="ml-2 p-2 bg-gray-500 text-gray-100 rounded-md hover:bg-gray-600"
          >
            <Activity size={20} className="text-gray-100" />
          </button>
        </div>
        <div className="flex items-center">
          <User size={24} className="mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Logged by: John Doe</span>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Procurement Logs</h2>
        <ul>
          {procurementLogs.map((log) => (
            <li key={log.id} className="py-2 border-b border-gray-300 dark:border-gray-600">
              {log.log}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Procurement Quantity</h2>
        <LineChart width={500} height={200} data={procurementData}>
          <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
}