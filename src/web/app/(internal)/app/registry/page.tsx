import { pool } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, Box, Clock, GitCommit, Loader, CheckCircle, CircleDashed } from 'lucide-react';

async function getFeatures() {
    // Fetch all features including PLANNED and BUILDING
    const res = await pool.query(`
            SELECT id, feature_name, source, status, pr_link, updated_at, created_at
            FROM feature_roadmap 
            WHERE status IN ('DEPLOYED', 'APPROVED', 'PLANNED', 'BUILDING') 
            ORDER BY created_at DESC
        `);
    return res.rows;
}

export const dynamic = 'force-dynamic';

function StatusBadge({ status }: { status: string }) {
    const styles = {
        'PLANNED': 'bg-gray-800 text-gray-400 border-gray-700',
        'BUILDING': 'bg-blue-900/30 text-blue-400 border-blue-800 animate-pulse',
        'APPROVED': 'bg-purple-900/30 text-purple-400 border-purple-800',
        'DEPLOYED': 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
    };

    const icons = {
        'PLANNED': <CircleDashed size={14} />,
        'BUILDING': <Loader size={14} className="animate-spin" />,
        'APPROVED': <CheckCircle size={14} />,
        'DEPLOYED': <Box size={14} />
    };

    const style = styles[status as keyof typeof styles] || styles['PLANNED'];
    const icon = icons[status as keyof typeof icons] || icons['PLANNED'];

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
            {icon}
            {status}
        </span>
    );
}

export default async function FeatureRegistry() {
    const features = await getFeatures();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 border-b border-[#1F242C] pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">Feature Registry</h1>
                <p className="text-zinc-400">
                    A catalog of all autonomous features. Track development from Plan to Deployment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <div key={feature.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <StatusBadge status={feature.status} />
                            {feature.pr_link && (
                                <a href={feature.pr_link} target="_blank" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    <GitCommit className="w-3 h-3" /> PR
                                </a>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-emerald-400 transition-colors mb-2">
                            {feature.feature_name}
                        </h3>

                        <div className="mt-auto flex flex-col gap-3 text-sm text-gray-500 pt-4 border-t border-gray-800/50">
                            <div className="flex justify-between text-xs">
                                <span>Source</span>
                                <span className="text-gray-400 truncate max-w-[150px]">{feature.source}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Updated</span>
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(feature.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {feature.status === 'DEPLOYED' && (
                            <div className="mt-4 bg-gray-950 p-2 rounded font-mono text-[10px] text-gray-500 truncate">
                                src/.../{feature.feature_name.replace(/\s+/g, '')}.tsx
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {features.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                    <Box size={40} className="mx-auto mb-4 opacity-50" />
                    No features found in the roadmap.
                </div>
            )}
        </div>
    );
}
