// @ts-nocheck
import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
  const [logText, setLogText] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, text: 'Procurement log 1' },
    { id: 2, text: 'Procurement log 2' },
    { id: 3, text: 'Procurement log 3' },
  ]);

  const handleVoiceToText = () => {
    // Mock voice-to-text data
    setLogText('New procurement log');
  };

  const handleLogSubmit = () => {
    setLogs([...logs, { id: logs.length + 1, text: logText }]);
    setLogText('');
  };

  return (
    <div className="p-4 mb-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleVoiceToText}
        >
          <Activity size={20} className="mr-2" />
          Start Voice-to-Text
        </button>
        <input
          type="text"
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          className="w-1/2 bg-gray-700 text-white p-2 rounded-lg"
          placeholder="Type or speak procurement log"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogSubmit}
        >
          Submit Log
        </button>
      </div>
      <h3 className="text-lg font-bold mb-4 text-white">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="bg-gray-700 p-2 rounded-lg mb-2">
            {log.text}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-bold mb-4 text-white">Procurement Trends</h3>
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