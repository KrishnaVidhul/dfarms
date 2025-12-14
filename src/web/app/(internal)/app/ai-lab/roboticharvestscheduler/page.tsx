'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface SchedulerData {
  id: number;
  robotName: string;
  scheduledTime: string;
  crop: string;
  status: 'Scheduled' | 'In Progress' | 'Failed';
}

export default function Page() {
  const [schedulerData, setSchedulerData] = useState<SchedulerData[]>([
    {
      id: 1,
      robotName: 'Harvester-1',
      scheduledTime: '2024-09-16T08:00:00.000Z',
      crop: 'Wheat',
      status: 'Scheduled',
    },
    {
      id: 2,
      robotName: 'Harvester-2',
      scheduledTime: '2024-09-16T09:00:00.000Z',
      crop: 'Corn',
      status: 'Scheduled',
    },
    {
      id: 3,
      robotName: 'Harvester-3',
      scheduledTime: '2024-09-16T10:00:00.000Z',
      crop: 'Soybean',
      status: 'Scheduled',
    },
  ]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-800 p-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        <Activity size={24} className="mr-2 text-blue-500" />
        Robotic Harvest Scheduler
      </h2>
      <div className="flex flex-col w-full h-full overflow-y-auto">
        <table className="w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Robot Name</th>
              <th className="py-3 px-4 text-left">Scheduled Time</th>
              <th className="py-3 px-4 text-left">Crop</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {schedulerData.map((data) => (
              <tr
                key={data.id}
                className={clsx('border-b border-gray-700', {
                  'bg-gray-700/50': data.status === 'Scheduled',
                  'bg-green-600/50': data.status === 'In Progress',
                  'bg-red-600/50': data.status === 'Failed',
                })}
              >
                <td className="py-3 px-4">{data.robotName}</td>
                <td className="py-3 px-4">{new Date(data.scheduledTime).toLocaleString()}</td>
                <td className="py-3 px-4">{data.crop}</td>
                <td className="py-3 px-4">{data.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
