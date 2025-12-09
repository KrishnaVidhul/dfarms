// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const mockLogs = [
  { id: 1, date: '2024-09-16', text: 'Procured 100kg of wheat from Farmer John' },
  { id: 2, date: '2024-09-17', text: 'Procured 50kg of maize from Farmer Jane' },
  { id: 3, date: '2024-09-18', text: 'Procured 200kg of soybeans from Farmer Bob' },
];

export default function Page() {
  const [logs, setLogs] = useState(mockLogs);
  const [newLog, setNewLog] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = () => {
    setIsRecording(true);
    // Simulate voice-to-text recording
    setTimeout(() => {
      setIsRecording(false);
      setNewLog('Procured 150kg of rice from Farmer Alice');
    }, 2000);
  };

  const handleSaveLog = () => {
    if (newLog) {
      setLogs([...logs, { id: logs.length + 1, date: '2024-09-19', text: newLog }]);
      setNewLog('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-white mb-2">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <button
          className={clsx(
            'px-4 py-2 text-white rounded-md',
            isRecording ? 'bg-orange-500' : 'bg-blue-500 hover:bg-blue-700'
          )}
          onClick={handleRecord}
        >
          {isRecording ? 'Recording...' : 'Record'}
        </button>
        <button
          className="px-4 py-2 text-white rounded-md bg-blue-500 hover:bg-blue-700 ml-2"
          onClick={handleSaveLog}
        >
          Save Log
        </button>
      </div>
      <div className="mb-4">
        <label className="text-white block mb-2">New Log:</label>
        <textarea
          className="w-full p-2 text-white bg-gray-700 rounded-md"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          rows={3}
        />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Procurement Logs:</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 border-b border-gray-600">
            <div className="flex items-center">
              <Activity className="text-white mr-2" size={20} />
              <span className="text-white">{log.text}</span>
            </div>
            <span className="text-gray-500 text-sm">{log.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}