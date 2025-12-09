// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const mockLogs = [
  { id: 1, text: 'Procurement log 1', timestamp: '2024-01-01T12:00:00' },
  { id: 2, text: 'Procurement log 2', timestamp: '2024-01-02T12:00:00' },
  { id: 3, text: 'Procurement log 3', timestamp: '2024-01-03T12:00:00' },
];

export default function Page() {
  const [logs, setLogs] = useState(mockLogs);
  const [newLog, setNewLog] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setLogs([...logs, { id: logs.length + 1, text: newLog, timestamp: new Date().toISOString() }]);
    setNewLog('');
  };

  const handleSpeechInput = (event) => {
    setNewLog(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold text-white">Voice-to-Text Procurement Logging</h2>
      <div className="flex gap-2">
        <button
          className={clsx('px-4 py-2 rounded-lg', isRecording ? 'bg-green-500' : 'bg-blue-500')}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <input
          type="text"
          value={newLog}
          onChange={handleSpeechInput}
          placeholder="Type or speak your log"
          className="w-full p-2 rounded-lg bg-gray-700 text-white"
        />
      </div>
      <div className="flex flex-col gap-2">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 p-2 bg-gray-700 rounded-lg">
            <Activity size={20} className="text-white" />
            <div className="flex flex-col">
              <span className="text-white">{log.text}</span>
              <span className="text-gray-500 text-sm">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}