jsx
import React from 'react';
import { FiRefreshCcw } from 'lucide-react';
import { useTheme } from 'next-themes';

const LiveDashboardTest = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live Dashboard Test</h2>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded bg-gray-800 text-white hover:bg-gray-700"
        >
          {theme === 'dark' ? (
            <>
              <FiRefreshCcw className="mr-2" />
              Light Mode
            </>
          ) : (
            <>
              <FiRefreshCcw className="mr-2" />
              Dark Mode
            </>
          )}
        </button>
      </div>
      {/* Dashboard content goes here */}
    </div>
  );
};

export default LiveDashboardTest;
