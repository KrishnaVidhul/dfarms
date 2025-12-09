import React, { useState } from 'react';
import Link from 'next/link';
import { LucideGithub } from 'lucide-react';

const GitHubSyncTest = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`bg-gray-900 text-white min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <header className="flex justify-between items-center p-4 bg-gray-800 dark:bg-zinc-700">
        <Link href="/" className="text-lg font-bold">Agri-Tech ERP</Link>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-md hover:bg-zinc-600">
          {isDarkMode ? <LucideGithub className="w-5 h-5" /> : <LucideGithub className="w-5 h-5 dark:invert" />}
        </button>
      </header>

      <main className="p-4">
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">GitHub Sync Test</h2>
          <p className="mb-2">This is a test component to ensure GitHub sync works.</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Sync Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default GitHubSyncTest;