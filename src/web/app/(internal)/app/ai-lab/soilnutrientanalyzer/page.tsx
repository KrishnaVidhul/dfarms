// @ts-nocheck
import { useClient } from 'next';
import { SoilNutrient } from '../mock/data/SoilNutrient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Circle } from 'lucide-react';
import { clsx } from 'clsx';

'use client';

const soilNutrientData = [
  { month: 'Jan', nitrogen: 50, phosphorus: 20, potassium: 30 },
  { month: 'Feb', nitrogen: 40, phosphorus: 25, potassium: 35 },
  { month: 'Mar', nitrogen: 55, phosphorus: 22, potassium: 32 },
  { month: 'Apr', nitrogen: 45, phosphorus: 28, potassium: 38 },
  { month: 'May', nitrogen: 60, phosphorus: 24, potassium: 36 },
  { month: 'Jun', nitrogen: 48, phosphorus: 26, potassium: 34 },
];

export default function Page() {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-200">Soil Nutrient Analyzer</h2>
        <Circle size={24} className="text-gray-400" />
      </div>
      <BarChart
        width={500}
        height={300}
        data={soilNutrientData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="nitrogen" fill="#8884d8" />
        <Bar dataKey="phosphorus" fill="#82ca9d" />
        <Bar dataKey="potassium" fill="#ffc107" />
      </BarChart>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-200">Soil Nutrient Levels</h3>
        <ul className={clsx('list-none', 'mb-0', 'p-0')}>
          {SoilNutrient.map((nutrient) => (
            <li key={nutrient.id} className="flex justify-between py-2">
              <span className="text-gray-200">{nutrient.name}</span>
              <span className="text-gray-400">{nutrient.level}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}