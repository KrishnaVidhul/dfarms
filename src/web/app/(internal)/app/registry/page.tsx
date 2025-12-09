import { Pool } from 'pg';
import Link from 'next/link';
import { ArrowRight, Box, Clock, GitCommit } from 'lucide-react';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function getDeployedFeatures() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT * FROM feature_roadmap 
            WHERE status = 'DEPLOYED' 
            ORDER BY completed_at DESC
        `);
        return res.rows;
    } finally {
        client.release();
    }
}

export const dynamic = 'force-dynamic';

export default async function FeatureRegistry() {
    const features = await getDeployedFeatures();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Feature Registry</h1>
                <p className="text-gray-400">
                    A catalog of all autonomous features deployed to the live ERP.
                    AI Agents build these components in the background.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <div key={feature.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Box className="w-6 h-6 text-emerald-400" />
                            </div>
                            {feature.pr_link && (
                                <a href={feature.pr_link} target="_blank" className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
                                    <GitCommit className="w-3 h-3" /> PR
                                </a>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-emerald-400 transition-colors">
                            {feature.feature_name}
                        </h3>

                        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>Source:</span>
                                <span className="text-gray-300">{feature.source}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Deployed:</span>
                                <span className="text-gray-300 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(feature.completed_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-800">
                            <div className="bg-gray-950 p-3 rounded font-mono text-xs text-gray-400 break-all">
                                src/web/app/components/{feature.feature_name.replace(/\s+/g, '')}.tsx
                            </div>
                            <p className="mt-2 text-xs text-yellow-500/80">
                                * To verify: Admin must import this component into a page.
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {features.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No features deployed yet.
                </div>
            )}
        </div>
    );
}
