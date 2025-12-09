// @ts-nocheck
'use client';
import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const procurementLogs = [
  {
    id: 1,
    date: '2024-09-16',
    time: '10:00 AM',
    log: 'Ordered 100 seeds',
  },
  {
    id: 2,
    date: '2024-09-17',
    time: '11:00 AM',
    log: 'Received 50 fertilizers',
  },
  {
    id: 3,
    date: '2024-09-18',
    time: '12:00 PM',
    log: 'Purchased 200 pesticides',
  },
];

export default function Page() {
  const [newLog, setNewLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleVoiceToText = () => {
    // Mock voice-to-text functionality
    setNewLog('New log added via voice-to-text');
  };

  const handleAddLog = () => {
    if (newLog) {
      setLogs([...logs, { id: logs.length + 1, date: '2024-09-19', time: '01:00 PM', log: newLog }]);
      setNewLog('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md shadow-md">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <button
          className={clsx(
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
            'transition duration-200 ease-in-out'
          )}
          onClick={handleVoiceToText}
        >
          <Activity size={20} className="mr-2" />
          Voice-to-Text
        </button>
        <input
          type="text"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          className="bg-gray-700 text-gray-200 py-2 px-4 rounded-md w-full"
          placeholder="Type or speak your log"
        />
        <button
          className={clsx(
            'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
            'transition duration-200 ease-in-out'
          )}
          onClick={handleAddLog}
        >
          Add Log
        </button>
      </div>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="bg-gray-700 py-2 px-4 rounded-md mb-2">
            <p className="text-gray-200">{log.log}</p>
            <p className="text-gray-500 text-sm">{log.date} {log.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}