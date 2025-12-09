// @ts-nocheck
import { Calendar } from 'lucide-react';
import { useState } from 'react';

'use client';

export default function WeatherPredictionModel() {
  const [weatherData, setWeatherData] = useState([
    {
      date: '2024-09-01',
      temperature: 22,
      precipitation: 0.5,
    },
    {
      date: '2024-09-02',
      temperature: 25,
      precipitation: 0.2,
    },
    {
      date: '2024-09-03',
      temperature: 20,
      precipitation: 0.8,
    },
    {
      date: '2024-09-04',
      temperature: 28,
      precipitation: 0.1,
    },
    {
      date: '2024-09-05',
      temperature: 24,
      precipitation: 0.6,
    },
  ]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-neutral-800">
      <div className="flex items-center gap-2">
        <Calendar size={24} className="text-neutral-400" />
        <h2 className="text-lg font-bold text-neutral-200">Weather Prediction Model</h2>
      </div>
      <div className="flex flex-col gap-2">
        {weatherData.map((data, index) => (
          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-700">
            <p className="text-sm text-neutral-400">{data.date}</p>
            <p className="text-sm text-neutral-200">Temperature: {data.temperature}°C</p>
            <p className="text-sm text-neutral-200">Precipitation: {data.precipitation} mm</p>
          </div>
        ))}
      </div>
    </div>
  );
}