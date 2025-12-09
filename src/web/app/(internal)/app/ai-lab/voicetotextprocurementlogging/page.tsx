// @ts-nocheck
import { Activity } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

'use client';

const procurementLogs = [
  {
    id: 1,
    date: '2024-09-16',
    log: 'Placed order for 100 seeds',
  },
  {
    id: 2,
    date: '2024-09-17',
    log: 'Received shipment of fertilizers',
  },
  {
    id: 3,
    date: '2024-09-18',
    log: 'Purchased new farming equipment',
  },
];

export default function Page() {
  const [newLog, setNewLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleAddLog = () => {
    setLogs([...logs, { id: logs.length + 1, date: '2024-09-19', log: newLog }]);
    setNewLog('');
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-lg font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          placeholder="Add new log"
          className="w-full p-2 pl-10 text-sm text-gray-700 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
        <button
          onClick={handleAddLog}
          className={clsx(
            'ml-4 py-2 px-4 text-sm text-white bg-gray-600 hover:bg-gray-700 rounded-lg',
            'focus:outline-none focus:ring-gray-500 focus:border-gray-500'
          )}
        >
          Add Log
        </button>
      </div>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 border-b border-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <Activity size={20} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">{log.date}</span>
              </div>
              <span className="text-sm text-white">{log.log}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}