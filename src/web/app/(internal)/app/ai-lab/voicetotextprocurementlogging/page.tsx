// @ts-nocheck
import { useState } from 'react';
import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

'use client';

const procurementData = [
  { name: 'Jan', quantity: 100 },
  { name: 'Feb', quantity: 120 },
  { name: 'Mar', quantity: 140 },
  { name: 'Apr', quantity: 160 },
  { name: 'May', quantity: 180 },
];

export default function Page() {
  const [speechText, setSpeechText] = useState('');
  const [logHistory, setLogHistory] = useState([]);

  const handleSpeech = () => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.maxResults = 10;
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setSpeechText(speechResult);
      setLogHistory((prevHistory) => [...prevHistory, speechResult]);
    };
    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-900">
      <h1 className="text-3xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h1>
      <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleSpeech}
      >
        <Activity size={20} className="mr-2" />
        Start Speaking
      </button>
      <p className="text-lg text-white mb-4">Spoken Text: {speechText}</p>
      <h2 className="text-2xl font-bold text-white mb-4">Procurement Log History</h2>
      <ul className="list-none mb-4">
        {logHistory.map((log, index) => (
          <li key={index} className="text-lg text-white mb-2">{log}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold text-white mb-4">Procurement Quantity Chart</h2>
      <BarChart width={500} height={300} data={procurementData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantity" fill="#8884d8" />
      </BarChart>
    </div>
  );
}