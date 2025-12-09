// @ts-nocheck
'use client';

import { Activity, Circle } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  const [procurementLogs, setProcurementLogs] = useState([
    {
      id: 1,
      date: '2024-09-16',
      quantity: '1000 kg',
      supplier: 'Green Farm',
      description: 'Procured 1000 kg of fresh produce',
    },
    {
      id: 2,
      date: '2024-09-15',
      quantity: '500 kg',
      supplier: 'AgriPro',
      description: 'Procured 500 kg of organic fertilizers',
    },
    {
      id: 3,
      date: '2024-09-14',
      quantity: '2000 kg',
      supplier: 'Farm Fresh',
      description: 'Procured 2000 kg of livestock feed',
    },
  ]);

  const [newLog, setNewLog] = useState({
    date: '',
    quantity: '',
    supplier: '',
    description: '',
  });

  const handleAddLog = () => {
    setProcurementLogs([...procurementLogs, newLog]);
    setNewLog({
      date: '',
      quantity: '',
      supplier: '',
      description: '',
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 mt-10 bg-neutral-800 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-neutral-200 mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className={clsx(
            'bg-neutral-700 hover:bg-neutral-600 transition duration-200 py-2 px-4 rounded-md text-neutral-200',
            'flex items-center gap-2'
          )}
        >
          <Activity size={18} />
          Log Procurement
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-neutral-200 table-auto">
          <thead className="bg-neutral-700">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {procurementLogs.map((log) => (
              <tr key={log.id} className="bg-neutral-800 hover:bg-neutral-700 transition duration-200">
                <td className="px-4 py-2">{log.date}</td>
                <td className="px-4 py-2">{log.quantity}</td>
                <td className="px-4 py-2">{log.supplier}</td>
                <td className="px-4 py-2">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-bold text-neutral-200 mb-4">Add New Log</h3>
        <form>
          <div className="flex flex-col mb-4">
            <label className="text-neutral-200 mb-2">Date</label>
            <input
              type="date"
              value={newLog.date}
              onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
              className="bg-neutral-700 py-2 px-4 rounded-md text-neutral-200"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-neutral-200 mb-2">Quantity</label>
            <input
              type="text"
              value={newLog.quantity}
              onChange={(e) => setNewLog({ ...newLog, quantity: e.target.value })}
              className="bg-neutral-700 py-2 px-4 rounded-md text-neutral-200"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-neutral-200 mb-2">Supplier</label>
            <input
              type="text"
              value={newLog.supplier}
              onChange={(e) => setNewLog({ ...newLog, supplier: e.target.value })}
              className="bg-neutral-700 py-2 px-4 rounded-md text-neutral-200"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-neutral-200 mb-2">Description</label>
            <textarea
              value={newLog.description}
              onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
              className="bg-neutral-700 py-2 px-4 rounded-md text-neutral-200 h-32"
            />
          </div>
          <button
            type="button"
            onClick={handleAddLog}
            className={clsx(
              'bg-neutral-700 hover:bg-neutral-600 transition duration-200 py-2 px-4 rounded-md text-neutral-200',
              'flex items-center gap-2'
            )}
          >
            <Circle size={18} />
            Add Log
          </button>
        </form>
      </div>
    </div>
  );
}