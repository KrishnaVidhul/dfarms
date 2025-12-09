// @ts-nocheck
import { useState } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

'use client';

const mockData = [
  { name: 'Jan', pH: 6.5, N: 100, P: 50, K: 200 },
  { name: 'Feb', pH: 6.2, N: 120, P: 60, K: 220 },
  { name: 'Mar', pH: 6.8, N: 110, P: 55, K: 210 },
  { name: 'Apr', pH: 6.5, N: 130, P: 65, K: 230 },
  { name: 'May', pH: 6.3, N: 105, P: 58, K: 205 },
  { name: 'Jun', pH: 6.7, N: 115, P: 62, K: 215 },
];

export default function Page() {
  const [selectedNutrient, setSelectedNutrient] = useState('N');

  const handleNutrientChange = (nutrient) => {
    setSelectedNutrient(nutrient);
  };

  const chartData = mockData.map((data) => ({
    name: data.name,
    value: data[selectedNutrient],
  }));

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-200">Soil Nutrient Analyzer</h2>
        <Activity size={24} className="text-gray-400" />
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className={clsx(
            'px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600',
            selectedNutrient === 'N' ? 'bg-gray-600' : ''
          )}
          onClick={() => handleNutrientChange('N')}
        >
          Nitrogen (N)
        </button>
        <button
          className={clsx(
            'px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600',
            selectedNutrient === 'P' ? 'bg-gray-600' : ''
          )}
          onClick={() => handleNutrientChange('P')}
        >
          Phosphorus (P)
        </button>
        <button
          className={clsx(
            'px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600',
            selectedNutrient === 'K' ? 'bg-gray-600' : ''
          )}
          onClick={() => handleNutrientChange('K')}
        >
          Potassium (K)
        </button>
      </div>
      <LineChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
}