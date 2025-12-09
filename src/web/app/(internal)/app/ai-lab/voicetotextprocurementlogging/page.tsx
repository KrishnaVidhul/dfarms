// @ts-nocheck
'use client';
import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { clsx } from 'clsx';

const procurementData = [
  { name: 'Jan', procurement: 100, expenditure: 500 },
  { name: 'Feb', procurement: 120, expenditure: 600 },
  { name: 'Mar', procurement: 110, expenditure: 550 },
  { name: 'Apr', procurement: 130, expenditure: 650 },
  { name: 'May', procurement: 140, expenditure: 700 },
];

const voiceLogs = [
  { id: 1, text: 'Procured 100 units of seeds', timestamp: '2024-01-01T10:00:00' },
  { id: 2, text: 'Procured 120 units of fertilizers', timestamp: '2024-02-01T11:00:00' },
  { id: 3, text: 'Procured 110 units of pesticides', timestamp: '2024-03-01T12:00:00' },
  { id: 4, text: 'Procured 130 units of equipment', timestamp: '2024-04-01T13:00:00' },
  { id: 5, text: 'Procured 140 units of supplies', timestamp: '2024-05-01T14:00:00' },
];

export default function Page() {
  const [speech, setSpeech] = useState('');
  const [logs, setLogs] = useState(voiceLogs);

  const handleSpeech = (e) => {
    setSpeech(e.target.value);
  };

  const handleLog = () => {
    if (speech !== '') {
      setLogs([...logs, { id: logs.length + 1, text: speech, timestamp: new Date().toISOString() }]);
      setSpeech('');
    }
  };

  return (
    <div className="p-4 dark:bg-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Voice-to-Text Procurement Logging</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={speech}
          onChange={handleSpeech}
          placeholder="Speak or type your procurement log"
          className={clsx(
            'w-full p-2 pl-10 text-sm text-gray-700 dark:text-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600',
            'md:w-1/2'
          )}
        />
        <button
          onClick={handleLog}
          className={clsx(
            'ml-2 p-2 text-sm text-gray-100 bg-gray-600 hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600',
            'md:ml-4'
          )}
        >
          <Activity size={18} className="mr-2" />
          Log
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Procurement Logs</h2>
        <ul>
          {logs.map((log) => (
            <li key={log.id} className="py-2 border-b border-gray-200 dark:border-gray-700">
              <p>{log.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Procurement Chart</h2>
        <LineChart width={500} height={300} data={procurementData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="procurement" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="expenditure" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}