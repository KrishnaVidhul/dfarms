// @ts-nocheck
'use client';

import { Activity, Box, Circle, User } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, date: '2024-09-16', transcript: 'Order for 100 seeds' },
    { id: 2, date: '2024-09-17', transcript: 'Request for fertilizer quote' },
  ]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setLogs([...logs, { id: logs.length + 1, date: new Date().toISOString().split('T')[0], transcript }]);
    setTranscript('');
  };

  const handleTranscriptChange = (e) => {
    setTranscript(e.target.value);
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-lg font-bold text-gray-100 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between mb-4">
        <button
          className={clsx(
            'rounded py-2 px-4 text-gray-100',
            isRecording ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          )}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? <Activity size={20} className="mr-2" /> : <Circle size={20} className="mr-2" />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button className="rounded py-2 px-4 text-gray-100 bg-orange-500 hover:bg-orange-600">
          <Box size={20} className="mr-2" />
          View Logs
        </button>
      </div>
      <div className="mb-4">
        <textarea
          className="w-full p-2 text-gray-100 bg-gray-700 rounded"
          rows={5}
          value={transcript}
          onChange={handleTranscriptChange}
          placeholder="Transcript will appear here..."
        />
      </div>
      <h3 className="text-lg font-bold text-gray-100 mb-2">Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="py-2 border-b border-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-100">{log.date}</span>
              <span className="text-gray-100">{log.transcript}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}