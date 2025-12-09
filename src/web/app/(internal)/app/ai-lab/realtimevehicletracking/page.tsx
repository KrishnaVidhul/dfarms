'use client';
// @ts-nocheck
import { useState, useEffect } from 'react';
import { Activity, Circle, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const mockVehicleData = [
  { time: '00:00', speed: 40 },
  { time: '01:00', speed: 50 },
  { time: '02:00', speed: 60 },
  { time: '03:00', speed: 55 },
  { time: '04:00', speed: 45 },
  { time: '05:00', speed: 48 },
];

export default function Page() {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'Tractor 1', speed: 40, location: 'Farm A' },
    { id: 2, name: 'Tractor 2', speed: 50, location: 'Farm B' },
    { id: 3, name: 'Tractor 3', speed: 60, location: 'Farm C' },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => ({
          ...vehicle,
          speed: vehicle.speed + Math.floor(Math.random() * 10),
        }))
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-lg font-bold text-gray-200 mb-2">
        <Activity /> Real-time Vehicle Tracking
      </h2>
      <div className="flex flex-wrap justify-center mb-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`p-2 bg-gray-700 rounded-md m-2 cursor-pointer ${selectedVehicle.id === vehicle.id ? 'bg-gray-600' : ''
              }`}
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <Circle className="text-gray-200" size={20} />
            <span className="text-gray-200 ml-2">{vehicle.name}</span>
            <span className="text-gray-400 ml-2">{vehicle.location}</span>
          </div>
        ))}
      </div>
      <div className="bg-gray-700 p-4 rounded-md">
        <h3 className="text-lg font-bold text-gray-200 mb-2">
          {selectedVehicle.name} Speed
        </h3>
        <LineChart width={500} height={200} data={mockVehicleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="speed" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
}