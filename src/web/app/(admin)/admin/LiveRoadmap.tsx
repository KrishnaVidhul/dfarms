"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RoadMapItem {
    feature_name: string;
    source: string;
    status: string;
    pr_link: string | null;
    created_at: string;
    started_at?: string;
    completed_at?: string;
}

interface RoadmapData {
    planned: RoadMapItem[];
    building: RoadMapItem[];
    deployed: RoadMapItem[];
}

export default function LiveRoadmap({ initialData }: { initialData: RoadmapData }) {
    const [roadmap, setRoadmap] = useState<RoadmapData>(initialData);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // Poll backend via a new API route we'll create, or just revalidate path
                // For simplicity in this Next.js app, we can router.refresh() to re-run server props
                // provided the page allows dynamic fetching.
                router.refresh();

                // Ideally, we fetch from an API route to avoid full page reload feel
                const res = await fetch('/api/agents/roadmap');
                if (res.ok) {
                    const data = await res.json();
                    setRoadmap(data);
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 3000); // 3 seconds

        return () => clearInterval(interval);
    }, [router]);

    const getDuration = (start: string, end?: string) => {
        if (!start) return '';
        const startTime = new Date(start).getTime();
        const endTime = end ? new Date(end).getTime() : new Date().getTime();
        const diffMs = endTime - startTime;
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Planned */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 flex justify-between">
                    Discovery / Planned <span>{roadmap.planned.length}</span>
                </h3>
                <div className="space-y-3">
                    {roadmap.planned.length === 0 && <div className="text-gray-500 text-sm">No items.</div>}
                    {roadmap.planned.map((feat: any, idx: number) => (
                        <div key={idx} className="bg-gray-900 p-3 rounded border border-gray-800 border-l-4 border-l-blue-500 animate-fade-in">
                            <div className="text-sm font-semibold text-gray-200">{feat.feature_name}</div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-between">
                                <span>Src: {feat.source}</span>
                                <span className="opacity-75">Q: {new Date(feat.created_at).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Building */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-blue-400 font-bold uppercase text-xs mb-4 flex justify-between">
                    In Progress <span>{roadmap.building.length}</span>
                </h3>
                <div className="space-y-3">
                    {roadmap.building.length === 0 && <div className="text-gray-500 text-sm">No items.</div>}
                    {roadmap.building.map((feat: any, idx: number) => (
                        <div key={idx} className="bg-gray-900 p-3 rounded border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] animate-pulse">
                            <div className="text-sm font-semibold text-white">{feat.feature_name}</div>
                            <div className="text-xs text-blue-400 mt-2 flex items-center justify-between">
                                <span className="flex items-center gap-2"><span className="animate-spin">⟳</span> Writing Code...</span>
                                <span>{getDuration(feat.started_at)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Deployed */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-green-400 font-bold uppercase text-xs mb-4 flex justify-between">
                    Deployed <span>{roadmap.deployed.length}</span>
                </h3>
                <div className="space-y-3 opacity-80">
                    {roadmap.deployed.map((feat: any, idx: number) => (
                        <div key={idx} className="bg-gray-900 p-3 rounded border border-green-900/50 border-l-4 border-l-green-500 animate-slide-in">
                            <div className="text-sm font-semibold text-gray-200 line-through decoration-gray-500">{feat.feature_name}</div>
                            <div className="flex justify-between items-center mt-1">
                                {feat.pr_link && <a href={feat.pr_link} className="text-xs text-green-500 hover:underline">View Source</a>}
                                <a href={`/app/ai-lab/${feat.feature_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                                    className="text-xs bg-green-900 border border-green-700 text-green-400 px-2 py-1 rounded hover:bg-green-800 transition-colors">
                                    Launch 🚀
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
