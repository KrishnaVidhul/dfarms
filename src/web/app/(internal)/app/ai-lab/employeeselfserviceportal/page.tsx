
// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Activity, Users, UserPlus, UserCheck } from 'lucide-react';
import clsx from 'clsx';
import tailwindMerge from 'tailwind-merge';

const EmployeeSelfServicePortal = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={tailwindMerge(
        'bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark',
        theme === 'dark' && 'dark'
      )}
      data-theme={theme}
    >
      <header className="p-4 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium">Employee Self-Service Portal</h1>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-primary">
            {theme === 'light' ? <Activity /> : <Moon />}
          </button>
        </div>
      </header>
      <main className="p-4 grid gap-4">
        <section className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-medium">Profile Information</h2>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between">
              <span>Name:</span>
              <span>John Doe</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email:</span>
              <span>johndoe@example.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Role:</span>
              <span>Software Engineer</span>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-medium">Change Password</h2>
          <form className="flex flex-col gap-4 mt-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                className={clsx(
                  'border border-zinc-300 dark:border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-primary'
                )}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className={clsx(
                  'border border-zinc-300 dark:border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-primary'
                )}
              />
            </div>
            <button
              type="submit"
              className={clsx(
                'bg-primary text-white hover:bg-primary-focus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded px-4 py-2',
                'disabled:opacity-50 disabled:hover:bg-primary'
              )}
            >
              Change Password
            </button>
          </form>
        </section>
        <section className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-medium">Update Contact Information</h2>
          <form className="flex flex-col gap-4 mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter new email"
                className={clsx(
                  'border border-zinc-300 dark:border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-primary'
                )}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter new phone number"
                className={clsx(
                  'border border-zinc-300 dark:border-zinc-700 rounded px-4 py-2 focus:outline-none focus:border-primary'
                )}
              />
            </div>
            <button
              type="submit"
              className={clsx(
                'bg-primary text-white hover:bg-primary-focus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded px-4 py-2',
                'disabled:opacity-50 disabled:hover:bg-primary'
              )}
            >
              Update Information
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default EmployeeSelfServicePortal;
