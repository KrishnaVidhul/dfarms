// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Crop } from 'lucide-react';
import { useRouter } from 'next/router';

const CropHealthVisualizer = () => {
  const [cropData, setCropData] = useState([]);
  // const router = useRouter(); // router might not work in app dir this way, assuming mock data for now

  useEffect(() => {
    setCropData([{ id: 1, name: 'Wheat', healthStatus: 'Good', area: 50 }]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* ... header ... */}
      <main className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cropData.map(crop => (
            <div key={crop.id} className="bg-gray-700 rounded-lg shadow-md p-4">
              <h2>{crop.name}</h2>
              <p>Health Status: {crop.healthStatus}</p>
              <div className="flex items-center justify-between mt-4">
                <Crop size={24} />
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