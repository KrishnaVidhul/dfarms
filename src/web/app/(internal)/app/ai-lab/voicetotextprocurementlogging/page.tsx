// @ts-nocheck
import { clsx } from 'clsx';
import { Activity, Circle, User } from 'lucide-react';
import { useState } from 'react';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-01-01', description: 'Order placed for seeds' },
  { id: 2, date: '2024-01-05', description: 'Order received for fertilizers' },
  { id: 3, date: '2024-01-10', description: 'Order placed for equipment' },
];

export default function Page() {
  const [voiceText, setVoiceText] = useState('');
  const [logs, setLogs] = useState(procurementLogs);

  const handleVoiceToText = () => {
    // Mock voice-to-text functionality
    const spokenText = 'New order for seeds';
    setVoiceText(spokenText);
    setLogs([...logs, { id: logs.length + 1, date: '2024-01-15', description: spokenText }]);
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleVoiceToText}
          className={clsx('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded')}
        >
          <Activity size={20} className="mr-2" />
          Speak to Log
        </button>
        <div className="flex items-center">
          <Circle size={20} className="mr-2 text-gray-500" />
          <span className="text-gray-200">Logged by: John Doe</span>
        </div>
      </div>
      <div className="bg-gray-700 p-4 rounded">
        <h3 className="text-lg font-bold text-gray-200 mb-2">Logs:</h3>
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="py-2 border-b border-gray-600">
              <span className="text-gray-200">{log.date}</span>
              <span className="ml-2 text-gray-400">{log.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}