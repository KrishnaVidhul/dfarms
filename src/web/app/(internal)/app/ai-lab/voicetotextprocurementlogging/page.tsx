// @ts-nocheck
import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

'use client';

const data = [
  { name: 'Jan', Procurement: 100 },
  { name: 'Feb', Procurement: 120 },
  { name: 'Mar', Procurement: 140 },
  { name: 'Apr', Procurement: 160 },
  { name: 'May', Procurement: 180 },
  { name: 'Jun', Procurement: 200 },
];

export default function Page() {
  const [speech, setSpeech] = useState('');
  const [log, setLog] = useState([]);

  const handleSpeech = () => {
    const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();
    recognition.lang = 'en-US';
    recognition.maxResults = 10;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeech(transcript);
      setLog((prevLog) => [...prevLog, transcript]);
    };
    recognition.start();
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleSpeech}
      >
        <Activity className="w-5 h-5 mr-2" />
        Start Voice Logging
      </button>
      <p className="text-gray-100 mb-4">Speech: {speech}</p>
      <ul className="list-none mb-4">
        {log.map((item, index) => (
          <li key={index} className="text-gray-100 mb-2">
            <Circle className="w-4 h-4 mr-2" />
            {item}
          </li>
        ))}
      </ul>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="Procurement" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
}