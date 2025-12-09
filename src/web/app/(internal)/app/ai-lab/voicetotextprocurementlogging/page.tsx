// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import clsx from 'clsx';

const procurementLogs = [
  {
    id: 1,
    date: '2024-09-16',
    supplier: 'John Doe',
    quantity: '1000 kg',
    product: 'Wheat',
  },
  {
    id: 2,
    date: '2024-09-17',
    supplier: 'Jane Doe',
    quantity: '500 kg',
    product: 'Rice',
  },
  {
    id: 3,
    date: '2024-09-18',
    supplier: 'Bob Smith',
    quantity: '2000 kg',
    product: 'Corn',
  },
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
    // Simulate voice-to-text transcription
    const log = {
      id: logs.length + 1,
      date: new Date().toISOString().split('T')[0],
      supplier: 'Unknown',
      quantity: 'Unknown',
      product: newLog,
    };
    setLogs([...logs, log]);
    setNewLog('');
  };

  const handleSpeak = () => {
    // Simulate voice-to-text input
    setNewLog('Wheat 1000 kg from John Doe');
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl text-white mb-4">Voice-to-Text Procurement Logging</h1>
      <div className="flex justify-between mb-4">
        <button
          className={clsx(
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
            isRecording ? 'hidden' : 'block'
          )}
          onClick={handleStartRecording}
        >
          <Activity className="mr-2" size={20} />
          Start Recording
        </button>
        <button
          className={clsx(
            'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
            isRecording ? 'block' : 'hidden'
          )}
          onClick={handleStopRecording}
        >
          <Circle className="mr-2" size={20} />
          Stop Recording
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSpeak}
        >
          Speak
        </button>
      </div>
      <div className="mb-4">
        <textarea
          className="block w-full p-2 text-lg text-white bg-gray-800 rounded"
          rows={5}
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          placeholder="Transcribed text will appear here..."
        />
      </div>
      <h2 className="text-xl text-white mb-4">Procurement Logs</h2>
      <table className="w-full text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Product</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-4 py-2">{log.date}</td>
              <td className="px-4 py-2">{log.supplier}</td>
              <td className="px-4 py-2">{log.quantity}</td>
              <td className="px-4 py-2">{log.product}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}