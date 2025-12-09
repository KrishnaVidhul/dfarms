// @ts-nocheck
import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, date: '2023-01-01', description: 'Procured seeds for wheat cultivation' },
  { id: 2, date: '2023-01-15', description: 'Procured fertilizers for corn cultivation' },
  { id: 3, date: '2023-02-01', description: 'Procured equipment for farm maintenance' },
];

export default function Page() {
  const [logs, setLogs] = useState(procurementLogs);
  const [newLog, setNewLog] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setLogs([...logs, { id: logs.length + 1, date: new Date().toISOString(), description: newLog }]);
    setNewLog('');
  };

  const handleLogChange = (e) => {
    setNewLog(e.target.value);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <button
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-200 rounded-lg',
            isRecording ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          )}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <Activity className="ml-4 text-gray-200" size={20} />
      </div>
      {isRecording && (
        <textarea
          className="w-full p-2 text-sm text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newLog}
          onChange={handleLogChange}
          placeholder="Say something..."
        />
      )}
      <h3 className="text-sm font-medium text-gray-200 mt-4 mb-2">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 border-b border-gray-700">
            <span className="text-sm text-gray-200">{log.date}</span>
            <span className="ml-2 text-sm text-gray-400">{log.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}