// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const procurementLogs = [
  { name: 'Jan', quantity: 100 },
  { name: 'Feb', quantity: 120 },
  { name: 'Mar', quantity: 140 },
  { name: 'Apr', quantity: 160 },
  { name: 'May', quantity: 180 },
];

export default function Page() {
  const [log, setLog] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, date: '2024-01-01', quantity: 100, description: 'Procurement of seeds' },
    { id: 2, date: '2024-01-15', quantity: 50, description: 'Procurement of fertilizers' },
    { id: 3, date: '2024-02-01', quantity: 200, description: 'Procurement of equipment' },
  ]);

  const handleLog = () => {
    setLogs([...logs, { id: logs.length + 1, date: '2024-03-01', quantity: 150, description: log }]);
    setLog('');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={log}
          onChange={(e) => setLog(e.target.value)}
          placeholder="Log procurement details"
          className="w-full p-2 pl-10 text-sm text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <button
          onClick={handleLog}
          className="ml-4 py-2 px-4 text-sm text-gray-200 bg-gray-600 hover:bg-gray-700 rounded-lg"
        >
          <Activity size={16} className="mr-2" />
          Log
        </button>
      </div>
      <div className="mb-4">
        <BarChart width={400} height={200} data={procurementLogs}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#4c51bf" />
        </BarChart>
      </div>
      <div className="flex flex-col">
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg mb-2">
            <div className="flex items-center">
              <Circle size={16} className="mr-2" />
              <span className="text-sm text-gray-200">{log.date}</span>
            </div>
            <span className="text-sm text-gray-200">{log.quantity}</span>
            <span className="text-sm text-gray-200">{log.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}