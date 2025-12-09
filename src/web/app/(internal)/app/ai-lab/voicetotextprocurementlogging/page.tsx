// @ts-nocheck
'use client';

import { Gear, Microphone } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const procurementLogs = [
  {
    id: 1,
    date: '2024-09-16',
    log: 'Ordered 100 seeds of wheat',
  },
  {
    id: 2,
    date: '2024-09-17',
    log: 'Received 50 bags of fertilizer',
  },
  {
    id: 3,
    date: '2024-09-18',
    log: 'Purchased 20 irrigation pipes',
  },
];

export default function Page() {
  const [isRecording, setIsRecording] = useState(false);
  const [log, setLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleRecord = () => {
    setIsRecording(true);
    // Simulate voice-to-text recording
    setTimeout(() => {
      setIsRecording(false);
      setLog('New log recorded');
    }, 2000);
  };

  const handleAddLog = () => {
    setLogs([...logs, { id: logs.length + 1, date: '2024-09-19', log: log }]);
    setLog('');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <button
          className={clsx(
            'bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded',
            isRecording ? 'opacity-50 cursor-not-allowed' : ''
          )}
          onClick={handleRecord}
          disabled={isRecording}
        >
          {isRecording ? <Microphone size={20} className="mr-2" /> : <Microphone size={20} className="mr-2" />}
          {isRecording ? 'Recording...' : 'Record Log'}
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddLog}
        >
          <Gear size={20} className="mr-2" />
          Add Log
        </button>
      </div>
      <textarea
        className="w-full bg-gray-700 text-gray-200 p-2 rounded-lg mb-4"
        value={log}
        onChange={(e) => setLog(e.target.value)}
        placeholder="Type or record log"
      />
      <h3 className="text-xl font-bold text-gray-200 mb-2">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="bg-gray-700 p-2 rounded-lg mb-2">
            <p className="text-gray-200">{log.log}</p>
            <p className="text-gray-500">{log.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}