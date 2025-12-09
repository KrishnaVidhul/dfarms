// @ts-nocheck
import { useState } from 'react';
import { Activity } from 'lucide-react';
import clsx from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-09-01', description: 'Ordered 100 seeds', quantity: 100, unitPrice: 5.0 },
  { id: 2, date: '2024-09-05', description: 'Ordered 50 fertilizers', quantity: 50, unitPrice: 10.0 },
  { id: 3, date: '2024-09-10', description: 'Ordered 200 pesticides', quantity: 200, unitPrice: 8.0 },
];

export default function Page() {
  const [speech, setSpeech] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleSpeech = () => {
    const speechText = speech;
    const log = {
      id: logs.length + 1,
      date: '2024-09-15',
      description: speechText,
      quantity: 0,
      unitPrice: 0.0,
    };
    setLogs([...logs, log]);
    setSpeech('');
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 dark:bg-gray-800 dark:text-gray-100">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Voice-to-Text Procurement Logging</h2>
        <Activity className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="text"
        value={speech}
        onChange={(e) => setSpeech(e.target.value)}
        placeholder="Speak to log procurement..."
        className={clsx(
          'w-full p-2 pl-10 text-sm text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 dark:bg-gray-700 dark:text-gray-100',
          'focus:dark:ring-gray-600'
        )}
      />
      <button
        onClick={handleSpeech}
        className="mt-2 py-2 px-4 text-sm text-gray-100 bg-gray-600 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500"
      >
        Log Procurement
      </button>
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Procurement Logs</h3>
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">{log.date}</span>
              <span className="ml-2 text-gray-700 dark:text-gray-100">{log.description}</span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">Quantity: {log.quantity}</span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">Unit Price: {log.unitPrice}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}