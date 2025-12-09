// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  const [logText, setLogText] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, text: 'Procurement log 1' },
    { id: 2, text: 'Procurement log 2' },
    { id: 3, text: 'Procurement log 3' },
  ]);

  const handleVoiceToText = () => {
    // Mock voice-to-text data
    const voiceText = 'New procurement log';
    setLogText(voiceText);
  };

  const handleAddLog = () => {
    if (logText) {
      setLogs([...logs, { id: logs.length + 1, text: logText }]);
      setLogText('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="mb-4 text-lg font-bold text-gray-200">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <button
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded',
            'hover:bg-gray-600'
          )}
          onClick={handleVoiceToText}
        >
          <Activity className="mr-2" size={16} />
          Start Voice-to-Text
        </button>
        <input
          type="text"
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          className="ml-4 p-2 pl-10 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded"
          placeholder="Type or speak log text"
        />
        <button
          className={clsx(
            'ml-4 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded',
            'hover:bg-gray-600'
          )}
          onClick={handleAddLog}
        >
          Add Log
        </button>
      </div>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="mb-2 text-gray-200">
            {log.text}
          </li>
        ))}
      </ul>
    </div>
  );
}