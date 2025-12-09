'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Moon, Sun, Monitor, Bell, Shield, User } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-6">Settings</h1>

            <div className="grid gap-6 max-w-4xl">
                {/* Appearance */}
                <Card className="bg-[#161B22] border-[#1F242C] p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Monitor className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white">Appearance</h2>
                            <p className="text-sm text-zinc-400">Customize your interface theme</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 p-4 rounded-lg border-2 border-emerald-500 bg-[#0F1115] flex flex-col items-center gap-2">
                            <Moon className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium text-white">Dark Mode</span>
                        </button>
                        <button className="flex-1 p-4 rounded-lg border border-[#1F242C] hover:bg-[#1F242C] transition-colors flex flex-col items-center gap-2">
                            <Sun className="w-5 h-5 text-zinc-400" />
                            <span className="text-sm font-medium text-zinc-400">Light Mode</span>
                        </button>
                    </div>
                </Card>

                {/* Account */}
                <Card className="bg-[#161B22] border-[#1F242C] p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <User className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white">Account</h2>
                            <p className="text-sm text-zinc-400">Manage your profile and role</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-[#1F242C]">
                            <span className="text-zinc-300">Username</span>
                            <span className="text-white font-mono">operator_01</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-[#1F242C]">
                            <span className="text-zinc-300">Role</span>
                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium">Staff</span>
                        </div>
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="bg-[#161B22] border-[#1F242C] p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Bell className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white">Notifications</h2>
                            <p className="text-sm text-zinc-400">Configure alert thresholds</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Low Stock Alerts</span>
                        <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
