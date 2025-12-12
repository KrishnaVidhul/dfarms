// @ts-nocheck
'use client';

import { clsx } from 'clsx';
import { Activity, Circle, User } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [procurementLogs, setProcurementLogs] = useState([
    { id: 1, date: '2024-09-16', description: 'Purchase of seeds' },
    { id: 2, date: '2024-09-17', description: 'Purchase of fertilizers' },
    { id: 3, date: '2024-09-18', description: 'Purchase of equipment' },
  ]);

  const [newLog, setNewLog] = useState({ date: '', description: '' });

  const handleAddLog = () => {
    setProcurementLogs([...procurementLogs, newLog]);
    setNewLog({ date: '', description: '' });
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-2xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <Circle className="text-gray-500" size={20} />
        <span className="text-gray-400 ml-2">Record a new log</span>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-400 mb-2">Date</label>
        <input
          type="date"
          value={newLog.date}
          onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
          className={clsx('px-4 py-2 text-gray-700 bg-gray-600 rounded-md', 'focus:outline-none focus:ring-2 focus:ring-gray-500')}
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-400 mb-2">Description</label>
        <textarea
          value={newLog.description}
          onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
          className={clsx('px-4 py-2 text-gray-700 bg-gray-600 rounded-md', 'focus:outline-none focus:ring-2 focus:ring-gray-500')}
          rows={5}
        />
      </div>
      <button
        onClick={handleAddLog}
        className={clsx('px-4 py-2 text-white bg-green-500 rounded-md', 'hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500')}
      >
        <Activity size={20} className="mr-2" />
        Record Log
      </button>
      <h3 className="text-xl font-bold text-white mt-8 mb-4">Procurement Logs</h3>
      <ul>
        {procurementLogs.map((log) => (
          <li key={log.id} className="flex items-center py-2 border-b border-gray-700">
            <User size={20} className="text-gray-500 mr-2" />
            <span className="text-gray-400">{log.date}</span>
            <span className="text-gray-400 ml-2">{log.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}