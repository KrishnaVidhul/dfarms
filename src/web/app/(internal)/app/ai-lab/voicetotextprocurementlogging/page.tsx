// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  const [logText, setLogText] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, text: 'Procured 100 units of fertilizer' },
    { id: 2, text: 'Ordered 500 units of seeds' },
  ]);

  const handleVoiceToText = () => {
    // Mock voice-to-text data
    const voiceText = 'Procured 200 units of pesticide';
    setLogText(voiceText);
  };

  const handleLogSubmit = () => {
    if (logText) {
      setLogs([...logs, { id: logs.length + 1, text: logText }]);
      setLogText('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2 text-gray-200">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <Activity size={24} className="text-gray-400 mr-2" />
        <button
          className={clsx(
            'py-2 px-4 text-gray-200 bg-gray-600 hover:bg-gray-700 rounded-md',
            'transition duration-200 ease-in-out'
          )}
          onClick={handleVoiceToText}
        >
          Voice-to-Text
        </button>
      </div>
      <textarea
        className="w-full p-2 mb-4 text-gray-200 bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        value={logText}
        onChange={(e) => setLogText(e.target.value)}
        placeholder="Type or speak your log here..."
      />
      <button
        className={clsx(
          'py-2 px-4 text-gray-200 bg-gray-600 hover:bg-gray-700 rounded-md',
          'transition duration-200 ease-in-out'
        )}
        onClick={handleLogSubmit}
      >
        Submit Log
      </button>
      <h3 className="text-lg font-bold mt-4 mb-2 text-gray-200">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 text-gray-200 border-b border-gray-600">
            {log.text}
          </li>
        ))}
      </ul>
    </div>
  );
}