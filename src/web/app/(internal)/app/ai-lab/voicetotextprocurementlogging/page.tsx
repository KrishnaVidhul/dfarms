// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Activity, Box, Circle, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { clsx } from 'clsx';

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
  const [voiceLogs, setVoiceLogs] = useState([
    { id: 1, log: 'Procurement order for 100 units of seeds' },
    { id: 2, log: 'Procurement order for 50 units of fertilizers' },
    { id: 3, log: 'Procurement order for 200 units of equipment' },
  ]);

  const [newLog, setNewLog] = useState('');

  const handleAddLog = () => {
    setVoiceLogs([...voiceLogs, { id: voiceLogs.length + 1, log: newLog }]);
    setNewLog('');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        <Activity className="mr-2" size={24} /> Voice-to-Text Procurement Logging
      </h2>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-white mb-2">Recent Voice Logs</h3>
            <ul>
              {voiceLogs.map((log) => (
                <li key={log.id} className="py-2 border-b border-gray-600">
                  <span className="text-white">{log.log}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-white mb-2">Add New Voice Log</h3>
            <input
              type="text"
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              className={clsx(
                'w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600',
                'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:ring-gray-600'
              )}
              placeholder="Type your log here..."
            />
            <button
              onClick={handleAddLog}
              className="mt-2 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Box className="mr-2" size={18} /> Add Log
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-white mb-2">Procurement Trends</h3>
        <LineChart width={700} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}