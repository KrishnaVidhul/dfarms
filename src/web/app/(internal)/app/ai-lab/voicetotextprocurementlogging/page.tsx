// @ts-nocheck
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  'use client';
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [voiceLog, setVoiceLog] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, log: 'Procured 1000 kg of wheat' },
    { id: 2, log: 'Ordered 500 liters of fertilizer' },
  ]);

  const handleVoiceLog = () => {
    const voiceLogText = 'Procured 2000 kg of maize';
    setVoiceLog(voiceLogText);
    setLogs([...logs, { id: logs.length + 1, log: voiceLogText }]);
  };

  return (
    <div className={clsx('flex flex-col p-4', isDarkMode ? 'bg-gray-800' : 'bg-white')}>
      <h1 className={clsx('text-2xl font-bold', isDarkMode ? 'text-white' : 'text-gray-800')}>Voice-to-Text Procurement Logging</h1>
      <button
        className={clsx(
          'ml-auto flex items-center justify-center gap-2 rounded-md p-2',
          isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800',
        )}
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className={clsx('mt-4 flex flex-col gap-4', isDarkMode ? 'text-white' : 'text-gray-800')}>
        <p>Press the button to simulate voice-to-text logging</p>
        <button
          className={clsx(
            'rounded-md p-2',
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800',
          )}
          onClick={handleVoiceLog}
        >
          Simulate Voice Log
        </button>
        <h2 className={clsx('text-xl font-bold', isDarkMode ? 'text-white' : 'text-gray-800')}>Recent Logs</h2>
        <ul>
          {logs.map((log) => (
            <li key={log.id} className={clsx('py-2', isDarkMode ? 'text-white' : 'text-gray-800')}>
              {log.log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}