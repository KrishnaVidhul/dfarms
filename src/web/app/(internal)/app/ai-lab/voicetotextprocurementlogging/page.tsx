// @ts-nocheck
import { useState } from 'react';
import { Activity } from 'lucide-react';
import clsx from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, description: 'Ordered seeds for wheat cultivation', date: '2024-02-15' },
  { id: 2, description: 'Purchased fertilizers for corn farming', date: '2024-02-20' },
  { id: 3, description: 'Bought equipment for irrigation system', date: '2024-02-25' },
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
    setLogs([...logs, { id: logs.length + 1, description: newLog, date: new Date().toISOString().split('T')[0] }]);
    setNewLog('');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-2xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className={clsx('px-4 py-2 text-white rounded-md', isRecording ? 'bg-green-500' : 'bg-blue-500')}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <Activity size={24} className="text-white" />
      </div>
      {isRecording && (
        <textarea
          className="w-full p-2 bg-gray-700 text-white rounded-md"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          placeholder="Logging..."
        />
      )}
      <h3 className="text-xl font-bold text-white mt-4 mb-2">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="bg-gray-700 p-2 mb-2 rounded-md">
            <p className="text-white">{log.description}</p>
            <p className="text-gray-400 text-sm">{log.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}