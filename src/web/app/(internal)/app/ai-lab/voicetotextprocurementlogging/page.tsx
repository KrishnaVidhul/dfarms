// @ts-nocheck
import { useState } from 'react';
import { Circle, User } from 'lucide-react';
import { clsx } from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-09-16', description: 'Procured 1000 kg of wheat', amount: 5000 },
  { id: 2, date: '2024-09-17', description: 'Procured 500 kg of rice', amount: 2000 },
  { id: 3, date: '2024-09-18', description: 'Procured 2000 kg of maize', amount: 8000 },
];

export default function Page() {
  const [logDescription, setLogDescription] = useState('');
  const [logAmount, setLogAmount] = useState(0);
  const [logs, setLogs] = useState(procurementLogs);

  const handleLogSubmission = () => {
    if (logDescription && logAmount) {
      const newLog = {
        id: logs.length + 1,
        date: new Date().toISOString().split('T')[0],
        description: logDescription,
        amount: logAmount,
      };
      setLogs([...logs, newLog]);
      setLogDescription('');
      setLogAmount(0);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-gray-800 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-200">Voice-to-Text Procurement Logging</h2>
        <Circle className="text-gray-500" size={20} />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-400 mb-2">Log Description:</label>
        <input
          type="text"
          value={logDescription}
          onChange={(e) => setLogDescription(e.target.value)}
          className={clsx(
            'py-2 pl-10 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500',
            { 'border-red-500': !logDescription }
          )}
          placeholder="Enter log description"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-400 mb-2">Log Amount:</label>
        <input
          type="number"
          value={logAmount}
          onChange={(e) => setLogAmount(e.target.valueAsNumber)}
          className={clsx(
            'py-2 pl-10 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500',
            { 'border-red-500': !logAmount }
          )}
          placeholder="Enter log amount"
        />
      </div>
      <button
        onClick={handleLogSubmission}
        className="py-2 px-4 text-sm text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500"
      >
        <User className="text-gray-200 mr-2" size={16} /> Log Procurement
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-200 mb-2">Procurement Logs:</h3>
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center py-2 px-4 bg-gray-700 rounded-md mb-2">
            <span className="text-gray-200">{log.description}</span>
            <span className="text-gray-200">{log.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}