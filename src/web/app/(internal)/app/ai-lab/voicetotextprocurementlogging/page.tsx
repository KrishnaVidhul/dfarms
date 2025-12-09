// @ts-nocheck
import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-09-16', description: 'Procured 1000 kg of wheat' },
  { id: 2, date: '2024-09-17', description: 'Procured 500 kg of corn' },
  { id: 3, date: '2024-09-18', description: 'Procured 2000 kg of soybeans' },
];

export default function Page() {
  const [log, setLog] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleSpeechToText = () => {
    // Simulating speech to text functionality
    const speech = 'Procured 1500 kg of rice';
    setLog(speech);
    setLogs([...logs, { id: logs.length + 1, date: '2024-09-19', description: speech }]);
  };

  return (
    <div className="flex flex-col p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-200">Voice-to-Text Procurement Logging</h2>
        <button
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-200 bg-blue-600 rounded-lg hover:bg-blue-700',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
          onClick={handleSpeechToText}
        >
          <Activity size={20} className="mr-2" />
          Log Procurement
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-200">{log.description}</p>
            <p className="text-sm text-gray-400">{log.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}