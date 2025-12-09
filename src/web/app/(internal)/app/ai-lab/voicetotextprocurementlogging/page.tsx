// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const procurementLogs = [
  { id: 1, date: '2024-09-01', log: 'Ordered 100 seeds' },
  { id: 2, date: '2024-09-05', log: 'Received 50 fertilizers' },
  { id: 3, date: '2024-09-10', log: 'Purchased 200 pesticides' },
];

export default function Page() {
  const [logs, setLogs] = useState(procurementLogs);
  const [newLog, setNewLog] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceToText = () => {
    setIsRecording(true);
    // Mock voice-to-text functionality
    const randomLog = `Logged on ${new Date().toISOString().split('T')[0]}: ${newLog}`;
    setLogs([...logs, { id: logs.length + 1, date: new Date().toISOString().split('T')[0], log: randomLog }]);
    setNewLog('');
    setIsRecording(false);
  };

  return (
    <div className="h-screen p-4 bg-gray-800 text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Voice-to-Text Procurement Logging</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          className={clsx(
            'py-2 px-4 rounded-lg',
            isRecording ? 'bg-green-500' : 'bg-blue-500',
            'text-gray-100 hover:opacity-80'
          )}
          onClick={handleVoiceToText}
        >
          {isRecording ? <Activity className="mr-2" /> : null}
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
        <input
          type="text"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          placeholder="Type or speak your log"
          className="py-2 px-4 rounded-lg bg-gray-700 text-gray-100 w-full md:w-1/2 lg:w-1/3"
        />
      </div>
      <h2 className="text-xl font-bold mb-2">Procurement Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 border-b border-gray-600">
            <span className="text-gray-200">{log.date}</span>
            <span className="ml-2 text-gray-100">{log.log}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}