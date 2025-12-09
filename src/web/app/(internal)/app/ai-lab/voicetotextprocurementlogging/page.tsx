// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

export default function Page() {
  const [logText, setLogText] = useState('');
  const [logHistory, setLogHistory] = useState([]);

  const handleSpeechToText = () => {
    const speech = new webkitSpeechRecognition() || new SpeechRecognition();
    speech.lang = 'en-US';
    speech.maxResults = 10;
    speech.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setLogText(speechText);
      setLogHistory((prevHistory) => [...prevHistory, speechText]);
    };
    speech.start();
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h1 className="text-2xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h1>
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSpeechToText}
        >
          <Activity size={20} className="mr-2" />
          Start Logging
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-2">Log Text:</h2>
        <p className="text-white">{logText}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-2">Log History:</h2>
        <ul>
          {logHistory.map((log, index) => (
            <li key={index} className="text-white mb-2">{log}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-700 p-4 rounded-md">
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}