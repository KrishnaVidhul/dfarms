// @ts-nocheck
'use client';

import { Button } from 'react';
import { Activity, Circle, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

const mockLogs = [
  { id: 1, date: '2024-09-01', log: 'Ordered 100 seeds' },
  { id: 2, date: '2024-09-05', log: 'Received 50 seeds' },
  { id: 3, date: '2024-09-10', log: 'Planted 20 seeds' },
];

export default function Page() {
  const [logs, setLogs] = useState(mockLogs);
  const [newLog, setNewLog] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = () => {
    setIsRecording(true);
    // simulate voice-to-text recording
    setTimeout(() => {
      setIsRecording(false);
      setNewLog('New log recorded');
    }, 2000);
  };

  const handleAddLog = () => {
    if (newLog) {
      setLogs([...logs, { id: logs.length + 1, date: new Date().toISOString().split('T')[0], log: newLog }]);
      setNewLog('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <Button
          className={clsx(
            'bg-orange-500 hover:bg-orange-600 text-gray-200 py-2 px-4 rounded-lg',
            isRecording ? 'opacity-50 cursor-not-allowed' : ''
          )}
          onClick={handleRecord}
          disabled={isRecording}
        >
          <Activity className="mr-2" size={20} />
          Record Log
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600 text-gray-200 py-2 px-4 rounded-lg"
          onClick={handleAddLog}
        >
          <Circle className="mr-2" size={20} />
          Add Log
        </Button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          className="w-full p-2 pl-10 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
          placeholder="New log"
        />
      </div>
      <h3 className="text-lg font-medium text-gray-200 mb-4">Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 px-4 bg-gray-700 rounded-lg mb-2">
            <div className="flex justify-between">
              <span className="text-gray-200">{log.log}</span>
              <span className="text-gray-400">{log.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}