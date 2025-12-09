// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const procurementLogs = [
  { id: 1, log: 'Procured 100 kg of wheat', timestamp: '2024-09-16T10:00:00.000Z' },
  { id: 2, log: 'Procured 50 kg of rice', timestamp: '2024-09-16T11:00:00.000Z' },
  { id: 3, log: 'Procured 200 kg of corn', timestamp: '2024-09-16T12:00:00.000Z' },
];

export default function Page() {
  const [log, setLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleVoiceToText = () => {
    // Mock voice-to-text functionality
    const spokenLog = 'Procured 150 kg of soybeans';
    setLog(spokenLog);
    setLogs([...logs, { id: logs.length + 1, log: spokenLog, timestamp: new Date().toISOString() }]);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        className={clsx(
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          'flex items-center justify-center gap-2'
        )}
        onClick={handleVoiceToText}
      >
        <Activity size={20} />
        Speak to Log
      </button>
      <ul className="mt-4">
        {logs.map((logItem) => (
          <li key={logItem.id} className="py-2 border-b border-gray-600">
            <p className="text-gray-200">{logItem.log}</p>
            <p className="text-gray-500 text-sm">{new Date(logItem.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}