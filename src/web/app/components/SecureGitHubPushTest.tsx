jsx
import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';

const SecureGitHubPushTest = () => {
  const { theme } = useTheme();
  return (
    <div className={`bg-${theme === 'dark' ? 'gray-900' : 'white'} text-${theme === 'dark' ? 'white' : 'gray-800'} p-6 rounded-lg shadow-md flex items-center space-x-4`}>
      <ShieldCheck className="w-8 h-8 text-green-500" />
      <div>
        <h2 className="font-semibold">Secure GitHub Push Test</h2>
        <p>Automatically test and secure your GitHub pushes with our enterprise tools.</p>
      </div>
    </div>
  );
};

export default SecureGitHubPushTest;
