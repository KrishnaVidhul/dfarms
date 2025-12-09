'use client';
// @ts-nocheck
import { Activity, User } from 'lucide-react';
import { clsx } from 'clsx';

const voiceCommands = [
  { id: 1, command: 'Navigate to Farm Overview' },
  { id: 2, command: 'Show Weather Forecast' },
  { id: 3, command: 'Open Crop Management' },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <h1 className="text-3xl text-gray-200 mb-4">Voice-First Navigation</h1>
      <div className="flex flex-col items-center justify-center">
        <Activity size={48} className={clsx('text-gray-200', 'mb-4')} />
        <p className="text-gray-400 mb-4">Try saying a command to navigate</p>
        <ul className="list-none p-0 m-0 flex flex-col items-center justify-center">
          {voiceCommands.map((command) => (
            <li
              key={command.id}
              className="bg-gray-800 p-2 rounded-md mb-2 text-gray-200 w-64 text-center"
            >
              {command.command}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}