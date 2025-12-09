// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const procurementData = [
  { name: 'Jan', voiceLogs: 100, textLogs: 50 },
  { name: 'Feb', voiceLogs: 120, textLogs: 60 },
  { name: 'Mar', voiceLogs: 140, textLogs: 70 },
  { name: 'Apr', voiceLogs: 160, textLogs: 80 },
  { name: 'May', voiceLogs: 180, textLogs: 90 },
];

export default function Page() {
  const [voiceTextLogs, setVoiceTextLogs] = useState([
    { id: 1, voiceLog: 'Procurement Request', textLog: 'Order placed for seeds' },
    { id: 2, voiceLog: 'Payment Confirmation', textLog: 'Payment made for equipment' },
    { id: 3, voiceLog: 'Delivery Update', textLog: 'Shipment arrived at warehouse' },
  ]);

  const handleVoiceLog = () => {
    setVoiceTextLogs([
      ...voiceTextLogs,
      { id: voiceTextLogs.length + 1, voiceLog: 'New Voice Log', textLog: 'New Text Log' },
    ]);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-gray-200 py-2 px-4 rounded-lg"
          onClick={handleVoiceLog}
        >
          <Activity size={20} className="mr-2" /> Record Voice Log
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-gray-200 py-2 px-4 rounded-lg">
          View All Logs
        </button>
      </div>
      <LineChart width={500} height={300} data={procurementData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="voiceLogs" stroke="#8884d8" />
        <Line type="monotone" dataKey="textLogs" stroke="#82ca9d" />
      </LineChart>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-200 mb-2">Recent Voice-to-Text Logs</h3>
        <ul>
          {voiceTextLogs.map((log) => (
            <li key={log.id} className="py-2 border-b border-gray-700">
              <span className="text-gray-200">{log.voiceLog}</span>
              <span className="text-gray-500 ml-2">{log.textLog}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}