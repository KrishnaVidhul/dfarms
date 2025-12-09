
// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import clsx from 'clsx';
import tailwindMerge from 'tailwind-merge';

const VoiceToTextProcurementLogging = () => {
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    // Mock data simulation
    const mockTranscription = "Vendor XYZ delivered 100 tons of organic cotton on time.";
    setTranscription(mockTranscription);
  }, []);

  return (
    <div className={tailwindMerge(
      'bg-[#1e293b] text-white p-4 rounded-lg shadow-md',
      'dark:bg-[#333] dark:text-gray-200'
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Activity size={24} />
        <h1 className="text-lg font-semibold">Voice-to-Text Procurement Logging</h1>
      </div>
      <div className="border border-gray-700 p-3 rounded-md">
        {transcription}
      </div>
    </div>
  );
};

export default VoiceToTextProcurementLogging;
