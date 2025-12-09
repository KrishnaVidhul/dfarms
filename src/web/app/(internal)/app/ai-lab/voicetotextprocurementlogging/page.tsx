// @ts-nocheck
import { clsx } from 'clsx';
import { Activity, Circle } from 'lucide-react';
import { useState } from 'react';

'use client';

const mockLogs = [
  { id: 1, date: '2024-09-16', text: 'Procured 100 units of fertilizer' },
  { id: 2, date: '2024-09-17', text: 'Purchased 50 units of seeds' },
  { id: 3, date: '2024-09-18', text: 'Sold 200 units of produce' },
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
  };

  const handleAddLog = () => {
    if (newLog) {
      setLogs([...logs, { id: logs.length + 1, date: '2024-09-19', text: newLog }]);
      setNewLog('');
    }
  };

  return (
    <div className="flex flex-col p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className={clsx(
            'px-4 py-2 bg-green-500 text-white rounded-md',
            isRecording ? 'bg-green-300' : 'bg-green-500'
          )}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? <Circle size={20} /> : <Activity size={20} />} {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <input
          type="text"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          placeholder="Type or record log"
          className="w-full p-2 pl-10 text-sm text-gray-700 bg-gray-200 rounded-md"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleAddLog}
        >
          Add Log
        </button>
      </div>
      <div className="flex flex-col">
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center py-2 border-b border-gray-600">
            <span className="text-gray-200">{log.date}</span>
            <span className="text-gray-200">{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}