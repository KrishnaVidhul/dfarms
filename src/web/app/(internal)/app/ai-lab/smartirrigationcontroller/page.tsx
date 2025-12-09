// @ts-nocheck
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Icon } from '../components/Icon';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

export default function Page() {
  const [waterLevel, setWaterLevel] = useState(50);
  const [soilMoisture, setSoilMoisture] = useState(70);
  const [temperature, setTemperature] = useState(25);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold text-gray-200 mb-4">
        <Icon icon="activity" size={20} className="mr-2" /> Smart Irrigation Controller
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-200 mb-2">Water Level</h3>
          <div className="flex items-center">
            <Icon icon="circle" size={20} className="mr-2" />
            <span className="text-lg font-bold text-gray-200">{waterLevel}%</span>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-200 mb-2">Soil Moisture</h3>
          <div className="flex items-center">
            <Icon icon="circle" size={20} className="mr-2" />
            <span className="text-lg font-bold text-gray-200">{soilMoisture}%</span>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-200 mb-2">Temperature</h3>
          <div className="flex items-center">
            <Icon icon="circle" size={20} className="mr-2" />
            <span className="text-lg font-bold text-gray-200">{temperature}°C</span>
          </div>
        </div>
      </div>
      <LineChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}