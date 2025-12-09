// @ts-nocheck
import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

'use client';

const procurementLogs = [
  { id: 1, date: '2024-01-01', description: 'Procured seeds for corn', quantity: 100 },
  { id: 2, date: '2024-01-05', description: 'Procured fertilizers for wheat', quantity: 50 },
  { id: 3, date: '2024-01-10', description: 'Procured pesticides for soybean', quantity: 200 },
];

export default function Page() {
  const [logs, setLogs] = useState(procurementLogs);
  const [newLog, setNewLog] = useState({ date: '', description: '', quantity: 0 });
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = () => {
    setIsRecording(true);
    // simulate voice-to-text recording
    setTimeout(() => {
      setIsRecording(false);
      setNewLog({ date: '2024-01-15', description: 'Procured equipment for farming', quantity: 1 });
    }, 2000);
  };

  const handleAddLog = () => {
    setLogs([...logs, newLog]);
    setNewLog({ date: '', description: '', quantity: 0 });
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        className={clsx(
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          isRecording ? 'opacity-50 cursor-not-allowed' : ''
        )}
        onClick={handleRecord}
        disabled={isRecording}
      >
        {isRecording ? <Activity className="mr-2" /> : <Activity className="mr-2" />} Record
      </button>
      <div className="mt-4">
        <input
          type="text"
          className="bg-gray-700 text-white p-2 rounded-md w-full"
          value={newLog.description}
          onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
          placeholder="Description"
        />
        <input
          type="number"
          className="bg-gray-700 text-white p-2 rounded-md w-full mt-2"
          value={newLog.quantity}
          onChange={(e) => setNewLog({ ...newLog, quantity: e.target.valueAsNumber })}
          placeholder="Quantity"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleAddLog}
        >
          Add Log
        </button>
      </div>
      <h3 className="text-lg font-bold text-white mt-4 mb-2">Procurement Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="bg-gray-700 p-2 rounded-md mb-2">
            <p>
              <span className="font-bold">Date:</span> {log.date}
            </p>
            <p>
              <span className="font-bold">Description:</span> {log.description}
            </p>
            <p>
              <span className="font-bold">Quantity:</span> {log.quantity}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}