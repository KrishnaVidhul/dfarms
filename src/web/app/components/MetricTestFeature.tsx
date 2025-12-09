jsx
import React from 'react';
import { LucideIcon } from "lucide-react";
import { useTheme } from 'next-themes';

const MetricTestFeature = ({ Icon, title, value }) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md p-4 flex items-center justify-between space-x-4 hover:shadow-lg transition-shadow duration-200`}
    >
      <Icon width={24} height={24} stroke={theme === 'dark' ? 'currentColor' : 'gray-500'} />
      <div>
        <div className={`text-base font-semibold text-${theme === 'dark' ? 'white' : 'black'}`}>
          {title}
        </div>
        <div className={`text-xl font-bold text-${theme === 'dark' ? 'green-400' : 'blue-600'}`}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default MetricTestFeature;
