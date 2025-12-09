// @ts-nocheck

import React, { useState, useEffect } from 'react';
import Lucide from 'lucide-react';
import { useRouter } from 'next/router';

const CropHealthVisualizer = () => {
  const [cropData, setCropData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch crop data from an API
    fetch('/api/crop-data')
      .then(response => response.json())
      .then(data => setCropData(data));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800">
        <nav className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Crop Health Visualizer</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Dashboard
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cropData.map(crop => (
            <div key={crop.id} className="bg-gray-700 rounded-lg shadow-md p-4">
              <h2>{crop.name}</h2>
              <p>Health Status: {crop.healthStatus}</p>
              <div className="flex items-center justify-between mt-4">
                <Lucide.Crop size={24} />
                <span>{crop.area} acres</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CropHealthVisualizer;