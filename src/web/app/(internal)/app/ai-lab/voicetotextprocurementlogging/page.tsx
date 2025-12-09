// @ts-nocheck
import { clsx } from 'clsx';
import { Activity, Box, Circle, User } from 'lucide-react';
import { useState } from 'react';

'use client';

export default function Page() {
  const [logText, setLogText] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, text: 'Procurement log 1' },
    { id: 2, text: 'Procurement log 2' },
    { id: 3, text: 'Procurement log 3' },
  ]);

  const handleVoiceToText = () => {
    // Mock voice to text data
    const text = 'This is a voice to text procurement log';
    setLogText(text);
    setLogs([...logs, { id: logs.length + 1, text }]);
  };

  return (
    <div className="flex flex-col p-4 mb-4 bg-gray-800 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-200">Voice-to-Text Procurement Logging</h2>
        <button
          onClick={handleVoiceToText}
          className={clsx(
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
            'flex items-center'
          )}
        >
          <Circle className="mr-2" size={20} />
          Start Recording
        </button>
      </div>
      <div className="mb-4">
        <textarea
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          className="block w-full p-2 bg-gray-700 text-gray-200 rounded-md"
          rows={5}
          placeholder="Type or record your procurement log"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-200 mb-2">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="flex items-center mb-2">
            <Activity size={20} className="mr-2" />
            <span className="text-gray-200">{log.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}