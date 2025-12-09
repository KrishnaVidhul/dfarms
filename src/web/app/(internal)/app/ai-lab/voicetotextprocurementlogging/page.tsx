// @ts-nocheck
import { Activity } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-09-01', description: 'Procured seeds for wheat crop' },
  { id: 2, date: '2024-09-05', description: 'Procured fertilizers for corn crop' },
  { id: 3, date: '2024-09-10', description: 'Procured pesticides for soybean crop' },
];

export default function Page() {
  const [newLog, setNewLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleAddLog = () => {
    if (newLog) {
      setLogs([...logs, { id: logs.length + 1, date: new Date().toISOString().split('T')[0], description: newLog }]);
      setNewLog('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <Activity size={24} className="text-gray-400" />
        <button
          className={clsx(
            'px-4 py-2 text-gray-200 bg-gray-600 rounded-md hover:bg-gray-700',
            'transition duration-200 ease-in-out'
          )}
          onClick={handleAddLog}
        >
          Add Log
        </button>
      </div>
      <input
        type="text"
        value={newLog}
        onChange={(e) => setNewLog(e.target.value)}
        placeholder="Enter new log description"
        className="w-full p-2 text-gray-200 bg-gray-700 rounded-md mb-4"
      />
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 border-b border-gray-600">
            <span className="text-gray-200">{log.date}</span>
            <span className="text-gray-400 ml-2">{log.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}