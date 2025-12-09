// @ts-nocheck
'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  const [waterLevel, setWaterLevel] = useState(50);
  const [pumpStatus, setPumpStatus] = useState('OFF');

  const handlePumpToggle = () => {
    setPumpStatus(pumpStatus === 'OFF' ? 'ON' : 'OFF');
  };

  return (
    <div className="mx-auto p-4 text-white">
      <h1 className="mb-4 text-3xl font-bold">Smart Irrigation Controller</h1>
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full lg:w-1/2 xl:w-1/3 p-6 bg-gray-800 rounded-lg">
          <h2 className="mb-2 text-lg font-bold">Water Level</h2>
          <div className="flex items-center mb-4">
            <Activity size={24} className="text-blue-500" />
            <span className="ml-2 text-3xl font-bold">{waterLevel}%</span>
          </div>
          <button
            className={clsx(
              'btn',
              pumpStatus === 'ON' ? 'btn-red' : 'btn-green'
            )}
            onClick={handlePumpToggle}
          >
            {pumpStatus === 'ON' ? 'Turn Off Pump' : 'Turn On Pump'}
          </button>
        </div>
      </div>
    </div>
  );
}