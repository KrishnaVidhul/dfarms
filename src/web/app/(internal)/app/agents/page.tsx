'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Terminal, Activity, Cpu, Clock } from 'lucide-react';
import clsx from 'clsx';

function formatTimeAgo(dateString: string) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export default function AgentMonitorPage() {
    const [data, setData] = useState<any>({ heartbeats: [], logs: [] });

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await fetch('/api/agents');
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error(e);
            }
        };

        fetchAgents();
        const interval = setInterval(fetchAgents, 2000); // Live poll
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 space-y-6 bg-black min-h-screen text-white font-mono">
            <div className="flex items-center space-x-3 mb-6">
                <Cpu className="w-8 h-8 text-emerald-400" />
                <h1 className="text-2xl font-bold tracking-tight">NEURAL LINK: Agent Observability</h1>
            </div>

            {/* Heartbeat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.heartbeats.map((agent: any) => (
                    <Card key={agent.agent_name} className="bg-zinc-900 border-zinc-800 p-4 relative overflow-hidden">
                        {/* Status Pulse */}
                        <div className={clsx(
                            "absolute top-0 right-0 w-2 h-2 m-4 rounded-full animate-pulse",
                            agent.status === 'IDLE' ? "bg-gray-500" :
                                agent.status === 'ERROR' ? "bg-red-500" :
                                    "bg-emerald-500"
                        )} />

                        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> {agent.agent_name}
                        </h2>

                        <div className="mt-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Current Thought</p>
                            <p className="text-sm text-emerald-300 font-medium mt-1 truncate">
                                &gt; {agent.current_thought}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center text-xs text-zinc-600 gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Last active: {formatTimeAgo(agent.last_active)}</span>
                        </div>
                    </Card>
                ))}

                {data.heartbeats.length === 0 && (
                    <div className="text-zinc-500 col-span-3 text-center py-10">Waiting for Agent Signals...</div>
                )}
            </div>

            {/* Terminal Log */}
            <div className="mt-8 rounded-lg border border-zinc-800 bg-black overflow-hidden">
                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-bold text-zinc-400">SYSTEM LOGS</span>
                </div>
                <div className="p-4 h-[400px] overflow-y-auto font-mono text-sm space-y-1">
                    {data.logs.map((log: any) => (
                        <div key={log.id} className="flex gap-4">
                            <span className="text-zinc-600 min-w-[150px]">{new Date(log.created_at).toLocaleTimeString()}</span>
                            <span className={clsx(
                                "font-bold min-w-[140px]",
                                log.agent_name === 'Refactor_Engine' ? "text-blue-400" : "text-purple-400"
                            )}>{log.agent_name}</span>
                            <span className="text-zinc-300">{log.log_message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
