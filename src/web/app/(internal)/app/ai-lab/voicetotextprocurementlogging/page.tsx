// @ts-nocheck
'use client';
import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { clsx } from 'clsx';

const procurementData = [
  { name: 'Jan', voiceLogs: 100, textLogs: 200 },
  { name: 'Feb', voiceLogs: 120, textLogs: 220 },
  { name: 'Mar', voiceLogs: 140, textLogs: 240 },
  { name: 'Apr', voiceLogs: 160, textLogs: 260 },
  { name: 'May', voiceLogs: 180, textLogs: 280 },
];

export default function Page() {
  const [voiceTextLogs, setVoiceTextLogs] = useState(procurementData);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Voice-to-Text Procurement Logging</h2>
        <button
          className={clsx(
            'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
          )}
        >
          <Activity size={20} className="mr-2" /> Log New Entry
        </button>
      </div>
      <div className="flex flex-col mb-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-400">Voice Logs: 1200</h3>
          <h3 className="text-lg font-bold text-gray-400">Text Logs: 2400</h3>
        </div>
        <LineChart width={500} height={300} data={voiceTextLogs}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="voiceLogs" stroke="#4caf50" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="textLogs" stroke="#03a9f4" />
        </LineChart>
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Logs</h2>
        <div className="flex flex-col bg-gray-700 p-4 rounded">
          {voiceTextLogs.map((log, index) => (
            <div key={index} className="flex justify-between mb-2">
              <div className="flex items-center">
                <Circle size={20} className="mr-2" />
                <h3 className="text-lg font-bold text-gray-400">{log.name}</h3>
              </div>
              <h3 className="text-lg font-bold text-gray-400">Voice: {log.voiceLogs}, Text: {log.textLogs}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}