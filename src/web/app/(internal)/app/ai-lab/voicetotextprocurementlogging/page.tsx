// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { tw } from 'tailwind-merge';

export default function Page() {
  const [procurementLog, setProcurementLog] = useState([
    { id: 1, date: '2022-01-01', description: 'Purchased seeds for wheat crop' },
    { id: 2, date: '2022-01-15', description: 'Procured fertilizers for corn crop' },
    { id: 3, date: '2022-02-01', description: 'Bought pesticides for soybean crop' },
  ]);

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
      setProcurementLog([...procurementLog, { id: procurementLog.length + 1, date: new Date().toISOString().split('T')[0], description: newLog }]);
      setNewLog('');
    }
  };

  return (
    <div className={tw`flex flex-col p-4 bg-gray-800`}>
      <h2 className={tw`text-2xl font-bold text-white mb-4`}>Voice-to-Text Procurement Logging</h2>
      <div className={tw`flex justify-between mb-4`}>
        <button
          className={clsx(tw`px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded`, isRecording ? tw`bg-gray-500 hover:bg-gray-600` : tw``)}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button
          className={tw`px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded`}
          onClick={handleAddLog}
        >
          Add Log
        </button>
      </div>
      <textarea
        className={tw`w-full h-40 p-4 bg-gray-700 text-white border border-gray-600 rounded mb-4`}
        placeholder="Type or speak your procurement log"
        value={newLog}
        onChange={(e) => setNewLog(e.target.value)}
      />
      <div className={tw`flex flex-col`}>
        {procurementLog.map((log) => (
          <div key={log.id} className={tw`flex justify-between py-2 border-b border-gray-600`}>
            <div className={tw`flex`}>
              <Activity size={20} className={tw`mr-2 text-gray-500`} />
              <span className={tw`text-white`}>{log.description}</span>
            </div>
            <span className={tw`text-gray-500`}>{log.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}