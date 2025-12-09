// @ts-nocheck
import { Activity } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-01-01', description: 'Procured seeds for planting' },
  { id: 2, date: '2024-01-05', description: 'Procured fertilizers for crop maintenance' },
  { id: 3, date: '2024-01-10', description: 'Procured equipment for harvesting' },
];

export default function Page() {
  const [log, setLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleVoiceToText = (event) => {
    setLog(event.target.value);
  };

  const handleAddLog = () => {
    if (log) {
      setLogs([...logs, { id: logs.length + 1, date: new Date().toISOString().split('T')[0], description: log }]);
      setLog('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-center mb-4">
        <Activity size={24} className="text-gray-500" />
        <input
          type="text"
          value={log}
          onChange={handleVoiceToText}
          className={clsx('w-full p-2 pl-10 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500', {
            'opacity-50': !log,
          })}
          placeholder="Speak to log procurement activity"
        />
        <button
          onClick={handleAddLog}
          className={clsx('ml-2 p-2 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600', {
            'opacity-50 cursor-not-allowed': !log,
          })}
        >
          Add Log
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-bold text-gray-200 mb-2">Procurement Logs</h3>
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="py-2 border-b border-gray-600">
              <div className="flex justify-between">
                <span className="text-sm text-gray-200">{log.date}</span>
                <span className="text-sm text-gray-200">{log.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}