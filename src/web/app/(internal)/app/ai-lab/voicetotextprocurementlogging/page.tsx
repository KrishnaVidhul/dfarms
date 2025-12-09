// @ts-nocheck
'use client';

import { Sun, Moon, Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const mockLoggingData = [
  {
    id: 1,
    date: '2024-09-16',
    procurementItem: 'Seeds',
    quantity: 100,
    unitPrice: 5.0,
    totalCost: 500.0,
  },
  {
    id: 2,
    date: '2024-09-17',
    procurementItem: 'Fertilizers',
    quantity: 50,
    unitPrice: 10.0,
    totalCost: 500.0,
  },
  {
    id: 3,
    date: '2024-09-18',
    procurementItem: 'Pesticides',
    quantity: 20,
    unitPrice: 15.0,
    totalCost: 300.0,
  },
];

export default function Page() {
  const [loggingData, setLoggingData] = useState(mockLoggingData);
  const [voiceInput, setVoiceInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const handleAddLoggingData = () => {
    const newLoggingData = {
      id: loggingData.length + 1,
      date: '2024-09-19',
      procurementItem: voiceInput,
      quantity: 0,
      unitPrice: 0.0,
      totalCost: 0.0,
    };
    setLoggingData([...loggingData, newLoggingData]);
    setVoiceInput('');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-gray-100 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className={clsx(
            'px-4 py-2 rounded-md',
            isRecording ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
          )}
          onClick={handleVoiceInput}
        >
          {isRecording ? <Activity size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button
          className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700"
          onClick={handleAddLoggingData}
        >
          <Sun size={20} className="mr-2" />
          Add Logging Data
        </button>
      </div>
      <input
        type="text"
        value={voiceInput}
        onChange={(e) => setVoiceInput(e.target.value)}
        placeholder="Speak to input procurement item"
        className="w-full p-2 rounded-md bg-gray-700 text-gray-100 mb-4"
      />
      <table className="w-full text-gray-100">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Procurement Item</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Unit Price</th>
            <th className="px-4 py-2">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {loggingData.map((data) => (
            <tr key={data.id}>
              <td className="px-4 py-2">{data.date}</td>
              <td className="px-4 py-2">{data.procurementItem}</td>
              <td className="px-4 py-2">{data.quantity}</td>
              <td className="px-4 py-2">{data.unitPrice}</td>
              <td className="px-4 py-2">{data.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}