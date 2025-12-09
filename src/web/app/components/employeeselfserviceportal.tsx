
// @ts-nocheck

import React from 'react';
import { useRouter } from 'next/router';
import LucideIcon, { UserCog2, Clock, ListCheck, FileDocument } from 'lucide-react';

const EmployeeSelfServicePortal: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-dark-900 text-white h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-opacity-10 backdrop-blur-lg">
        <h2 className="text-3xl font-bold mb-6">Employee Self-Service Portal</h2>
        <ul className="space-y-4">
          <li
            onClick={() => handleNavigate('/dashboard/self-service/profile')}
            className="flex items-center p-4 rounded-lg hover:bg-opacity-20 cursor-pointer"
          >
            <LucideIcon icon={UserCog2} size={24} className="mr-4" />
            Profile Management
          </li>
          <li
            onClick={() => handleNavigate('/dashboard/self-service/time-off')}
            className="flex items-center p-4 rounded-lg hover:bg-opacity-20 cursor-pointer"
          >
            <LucideIcon icon={Clock} size={24} className="mr-4" />
            Time Off Requests
          </li>
          <li
            onClick={() => handleNavigate('/dashboard/self-service/tasks')}
            className="flex items-center p-4 rounded-lg hover:bg-opacity-20 cursor-pointer"
          >
            <LucideIcon icon={ListCheck} size={24} className="mr-4" />
            My Tasks
          </li>
          <li
            onClick={() => handleNavigate('/dashboard/self-service/documents')}
            className="flex items-center p-4 rounded-lg hover:bg-opacity-20 cursor-pointer"
          >
            <LucideIcon icon={FileDocument} size={24} className="mr-4" />
            Document Management
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeSelfServicePortal;
