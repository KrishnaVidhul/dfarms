// @ts-nocheck
'use client';

import { Activity, Circle } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  const [voiceLog, setVoiceLog] = useState([
    { id: 1, log: 'Ordered 100 seeds for wheat cultivation' },
    { id: 2, log: 'Purchased 500 kg of fertilizer for corn crop' },
    { id: 3, log: 'Received 200 liters of pesticide for pest control' },
  ]);

  const [newLog, setNewLog] = useState('');

  const handleVoiceLog = () => {
    if (newLog) {
      setVoiceLog([...voiceLog, { id: voiceLog.length + 1, log: newLog }]);
      setNewLog('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-gray-200 mb-2">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          className={clsx(
            'w-full p-2 pl-10 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:ring-gray-500 focus:border-gray-500',
            'dark:bg-gray-800 dark:border-gray-700'
          )}
          placeholder="New log..."
        />
        <button
          onClick={handleVoiceLog}
          className="ml-2 p-2 text-gray-200 bg-gray-600 hover:bg-gray-700 rounded-md"
        >
          <Activity size={20} className="text-gray-200" />
          Log
        </button>
      </div>
      <ul>
        {voiceLog.map((log) => (
          <li key={log.id} className="py-2 border-b border-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-200">{log.log}</span>
              <Circle size={20} className="text-gray-400" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}