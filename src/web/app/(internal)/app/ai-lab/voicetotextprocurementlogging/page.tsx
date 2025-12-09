// @ts-nocheck
'use client';

import { clsx } from 'clsx';
import { Activity } from 'lucide-react';
import { LineChart, Line } from 'recharts';

const procurementLogs = [
  { date: '2022-01-01', quantity: 100 },
  { date: '2022-01-02', quantity: 120 },
  { date: '2022-01-03', quantity: 110 },
  { date: '2022-01-04', quantity: 130 },
  { date: '2022-01-05', quantity: 140 },
];

export default function Page() {
  return (
    <div className="p-4 bg-gray-800 rounded-md shadow-md">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center mb-4">
        <Activity size={20} className="text-gray-400 mr-2" />
        <p className="text-gray-200">Log procurement activities using voice-to-text</p>
      </div>
      <LineChart width={500} height={200} data={procurementLogs}>
        <Line type="monotone" dataKey="quantity" stroke="#66bb6a" />
      </LineChart>
      <div className="mt-4">
        <table className="w-full text-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {procurementLogs.map((log, index) => (
              <tr key={index} className={clsx(index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600')}>
                <td className="px-4 py-2">{log.date}</td>
                <td className="px-4 py-2">{log.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}