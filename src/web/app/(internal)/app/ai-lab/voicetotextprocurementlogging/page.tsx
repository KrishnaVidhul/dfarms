// @ts-nocheck
import { useClient } from 'next';
import { clsx } from 'clsx';
import { Circle, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

'use client';

const procurementData = [
  { name: 'Jan', quantity: 1000 },
  { name: 'Feb', quantity: 1200 },
  { name: 'Mar', quantity: 1100 },
  { name: 'Apr', quantity: 1300 },
  { name: 'May', quantity: 1400 },
];

export default function Page() {
  const [logText, setLogText] = React.useState('');
  const [speech, setSpeech] = React.useState('');

  const handleSpeech = () => {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (event) => {
      setSpeech(event.results[0][0].transcript);
      setLogText(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const handleSubmit = () => {
    // Log procurement data
    console.log(logText);
  };

  return (
    <div className="dark p-4">
      <h2 className="text-lg font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-center mb-4">
        <button
          className={clsx(
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
            'dark:bg-blue-500 dark:hover:bg-blue-700'
          )}
          onClick={handleSpeech}
        >
          <Circle className="mr-2" size={20} />
          Start Recording
        </button>
      </div>
      <textarea
        className="w-full p-4 mb-4 bg-gray-800 text-white rounded"
        rows={5}
        value={logText}
        onChange={(e) => setLogText(e.target.value)}
        placeholder="Procurement Log"
      />
      <button
        className={clsx(
          'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          'dark:bg-blue-500 dark:hover:bg-blue-700'
        )}
        onClick={handleSubmit}
      >
        <User className="mr-2" size={20} />
        Log Procurement
      </button>
      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4">Procurement Quantity (Last 5 Months)</h3>
        <LineChart width={500} height={300} data={procurementData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="quantity" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  );
}