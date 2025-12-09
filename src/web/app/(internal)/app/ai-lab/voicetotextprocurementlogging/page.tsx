// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import clsx from 'clsx';

const mockData = [
  { name: 'Jan', procurement: 100 },
  { name: 'Feb', procurement: 120 },
  { name: 'Mar', procurement: 140 },
  { name: 'Apr', procurement: 160 },
  { name: 'May', procurement: 180 },
  { name: 'Jun', procurement: 200 },
];

export default function Page() {
  const [voiceText, setVoiceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleVoiceTextChange = (e) => {
    setVoiceText(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <button
          className={clsx(
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
            isRecording ? 'bg-red-500 hover:bg-red-700' : ''
          )}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <Activity className="ml-4 text-white" size={24} />
      </div>
      <textarea
        value={voiceText}
        onChange={handleVoiceTextChange}
        placeholder="Type or record your procurement log..."
        className="block w-full p-4 text-lg text-white bg-gray-800 rounded mb-4"
      />
      <LineChart width={500} height={300} data={mockData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="procurement" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      <div className="flex items-center mb-4">
        <Circle className="text-white" size={24} />
        <p className="text-lg text-white ml-4">Procurement logging history</p>
      </div>
    </div>
  );
}