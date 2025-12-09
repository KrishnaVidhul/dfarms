// @ts-nocheck
import { clsx } from 'clsx';
import { Activity, User } from 'lucide-react';
import { useState } from 'react';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-09-16', description: 'Purchased seeds for winter season', quantity: 100 },
  { id: 2, date: '2024-09-17', description: 'Purchased fertilizers for summer season', quantity: 50 },
  { id: 3, date: '2024-09-18', description: 'Purchased pesticides for autumn season', quantity: 200 },
];

export default function Page() {
  const [log, setLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleVoiceToText = (event) => {
    setLog(event.target.value);
  };

  const handleAddLog = () => {
    if (log.trim() !== '') {
      const newLog = {
        id: logs.length + 1,
        date: new Date().toISOString().split('T')[0],
        description: log,
        quantity: 0,
      };
      setLogs([...logs, newLog]);
      setLog('');
    }
  };

  return (
    <div className="p-4 bg-dark-100 rounded-md">
      <h2 className="text-lg font-bold text-gray-200 mb-2">
        <Activity size={20} className="mr-2" /> Voice-to-Text Procurement Logging
      </h2>
      <textarea
        value={log}
        onChange={handleVoiceToText}
        placeholder="Speak to log procurement..."
        className={clsx('w-full p-2 bg-dark-200 text-gray-200 rounded-md', 'focus:outline-none focus:ring-1 focus:ring-gray-300')}
      />
      <button
        onClick={handleAddLog}
        className={clsx('px-4 py-2 bg-green-500 text-gray-200 rounded-md', 'hover:bg-green-600')}
      >
        Add Log
      </button>
      <div className="mt-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center mb-2">
            <User size={20} className="mr-2" />
            <div>
              <p className="text-gray-200">{log.description}</p>
              <p className="text-gray-400 text-sm">{log.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}