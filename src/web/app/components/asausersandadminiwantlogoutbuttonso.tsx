// @ts-nocheck

import React from 'react';
import { IoLogOutOutline } from 'lucide-react';

const LogoutButton = () => {
  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing tokens and redirecting to login page
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-slate-900 border border-transparent rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <IoLogOutOutline className="mr-2 h-4 w-4" />
      Logout
    </button>
  );
};

export default LogoutButton;