'use client';

import React, { useEffect, useState } from 'react';
import { Bot, Activity, CheckCircle, Clock } from 'lucide-react';

interface AgentJob {
    id: number;
    task_type: string;
    status: string;
    result_summary: string;
    updated_at: string;
}

export default function AgentStatusWidget() {
    const [activeJob, setActiveJob] = useState<AgentJob | null>(null);
    const [recentJobs, setRecentJobs] = useState<AgentJob[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAgentStatus = async () => {
        try {
            // Fetch latest jobs
            // We can reuse the notifications API logic or create a specific one.
            // For now, let's assume we fetch from a dedicated endpoint or query the existing one if expanded.
            // Or simpler: Reuse the notifications API? No, that's mixed.
            // Let's CREATE a quick client-side query or use a new endpoint.
            // Ideally, we should have /api/agents/status.
            // I'll mock the fetch for now via /api/notifications logic style or add the endpoint.
            // Better: Let's fetch from the EXISTING /api/agents/roadmap if it has recent tasks?
            // Or better yet, just hit the DB via a server component?
            // Since this is a Client Component (for auto-refresh), we need an API.

            // I'll create a dedicated lightweight endpoint /api/agents/live-status

            const res = await fetch('/api/agents/live-status');
            const data = await res.json();
            setActiveJob(data.active || null);
            setRecentJobs(data.recent || []);
        } catch (error) {
            console.error('Error fetching agent status:', error);
            setRecentJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentStatus();
        const interval = setInterval(fetchAgentStatus, 5000); // Poll every 5s for "Live" feel
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Bot size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200">Universal Agent Status</h3>
                        <p className="text-xs text-zinc-500">Live Intelligence Loop</p>
                    </div>
                </div>
                {activeJob ? (
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium animate-pulse">
                        <Activity size={12} />
                        Active
                    </span>
                ) : (
                    <span className="px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400">
                        Idle
                    </span>
                )}
            </div>

            {/* Active Job Area */}
            <div className="flex-1 bg-[#0d1117] rounded-lg p-4 border border-[#1F242C] mb-4 relative overflow-hidden">
                {activeJob ? (
                    <div className="relative z-10">
                        <p className="text-xs text-purple-400 font-mono mb-1">CURRENTLY PROCESSING</p>
                        <h4 className="text-sm font-medium text-white mb-2">{activeJob.task_type}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-2">{activeJob.result_summary || 'Analyzing data streams...'}</p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-500">
                            <Clock size={12} />
                            <span>Started {new Date(activeJob.updated_at).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2">
                        <Bot size={24} className="opacity-20" />
                        <p className="text-xs">Waiting for next scheduled run...</p>
                    </div>
                )}

                {/* Background Animation Effect */}
                {activeJob && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
                )}
            </div>

            {/* Recent History */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recently Completed</p>
                <div className="space-y-1.5">
                    {recentJobs.slice(0, 3).map(job => (
                        <div key={job.id} className="flex items-center justify-between text-xs p-1.5 hover:bg-[#1F242C] rounded transition-colors group">
                            <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                                <span className="text-zinc-300 truncate group-hover:text-white transition-colors">{job.task_type}</span>
                            </div>
                            <span className="text-zinc-600 font-mono flex-shrink-0 text-[10px]">
                                {new Date(job.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    {recentJobs.length === 0 && (
                        <p className="text-xs text-zinc-600 italic">No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
