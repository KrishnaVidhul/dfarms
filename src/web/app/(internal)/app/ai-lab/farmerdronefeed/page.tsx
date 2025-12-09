// @ts-nocheck

import React, { useState } from 'react';
import { FiMonitor, FiUser, FiMapPin } from 'lucide-react';

const FarmerDroneFeed = () => {
  const [feedItems, setFeedItems] = useState([
    { id: 1, icon: <FiMonitor size={24} />, title: 'Daily Farming Update', content: 'Check daily updates on your farm.' },
    { id: 2, icon: <FiUser size={24} />, title: 'Farmer Profile', content: 'View and manage your farmer details.' },
    { id: 3, icon: <FiMapPin size={24} />, title: 'Farm Map', content: 'Visualize your farm layout with drone feed.' }
  ]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Farmer Drone Feed</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedItems.map(item => (
            <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-start space-x-2 mb-2">
                {item.icon}
                <h2 className="text-xl font-semibold">{item.title}</h2>
              </div>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FarmerDroneFeed;