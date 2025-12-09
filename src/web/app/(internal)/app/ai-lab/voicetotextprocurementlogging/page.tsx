// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { clsx } from 'clsx';

const mockProcurementLogs = [
  { id: 1, date: '2022-01-01', description: 'Purchased seeds' },
  { id: 2, date: '2022-01-15', description: 'Bought fertilizers' },
  { id: 3, date: '2022-02-01', description: 'Acquired farming equipment' },
];

export default function Page() {
  const [procurementLogs, setProcurementLogs] = useState(mockProcurementLogs);
  const [newLog, setNewLog] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setNewLog('New log recorded');
  };

  const handleAddLog = () => {
    setProcurementLogs([...procurementLogs, { id: procurementLogs.length + 1, date: '2024-09-16', description: newLog }]);
    setNewLog('');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className={clsx('px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg', {
            'bg-green-500 hover:bg-green-400': isRecording,
          })}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? <span>Stop Recording</span> : <span>Start Recording</span>}
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg" onClick={handleAddLog}>
          Add Log
        </button>
      </div>
      <div className="mb-4">
        <textarea
          className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg"
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          placeholder="Type or record new log"
        />
      </div>
      <div className="flex flex-col">
        {procurementLogs.map((log) => (
          <div key={log.id} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg mb-2">
            <div className="flex items-center">
              <Activity size={20} className="mr-2 text-gray-200" />
              <span className="text-gray-200">{log.description}</span>
            </div>
            <span className="text-gray-400">{log.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}