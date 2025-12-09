import { Pool } from 'pg';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import TaskAssignment from './TaskAssignment'; // Import the client component

// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function getUsers() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT id, username, role, created_at FROM users ORDER BY id ASC');
        client.release();
        return res.rows;
    } catch (err) {
        console.error('DB Error:', err);
        return [];
    }
}

async function getMarketPrices() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT * FROM market_prices ORDER BY fetched_at DESC LIMIT 50');
        client.release();
        return res.rows;
    } catch (err) {
        console.error('DB Error:', err);
        return [];
    }
}

async function getSystemHealth() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'system_health.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        return null;
    } catch (err) {
        return null;
    }
}


export default async function AdminPanel() {
    const users = await getUsers();
    const prices = await getMarketPrices();
    const health = await getSystemHealth();

    // R&D Pipeline Loader
    interface RDFeature {
        title: string;
        source: string;
        idea: string;
    }
    let rdFeatures: RDFeature[] = [];
    try {
        const backlogPath = path.join(process.cwd(), 'src', 'design_backlog.md');
        if (fs.existsSync(backlogPath)) {
            const content = fs.readFileSync(backlogPath, 'utf8');
            // Simple regex to parse features
            const matches = content.match(/## Feature: (.*?)\n\*\*Source:\*\* (.*?)\n\*\*Idea:\*\* (.*?)\n/g);
            if (matches) {
                rdFeatures = matches.slice(-3).map(m => { // Last 3
                    const parts = m.split('\n');
                    return {
                        title: parts[0].replace('## Feature: ', ''),
                        source: parts[1].replace('**Source:** ', ''),
                        idea: parts[2].replace('**Idea:** ', '')
                    };
                }).reverse();
            }
        }
    } catch (e) { console.error(e); }

    // Live Roadmap Fetch
    interface RoadMapItem {
        feature_name: string;
        source: string;
        status: string;
        pr_link: string | null;
        created_at: string;
    }

    let roadmap: { planned: RoadMapItem[], building: RoadMapItem[], deployed: RoadMapItem[] } = { planned: [], building: [], deployed: [] };

    try {
        console.log("Fetching Roadmap Data...");
        const client = await pool.connect();
        const res = await client.query("SELECT * FROM feature_roadmap ORDER BY created_at DESC");
        const rows = res.rows;
        client.release();

        roadmap.planned = rows.filter((r: any) => r.status === 'PLANNED' || r.status === 'Discovery');
        roadmap.building = rows.filter((r: any) => r.status === 'BUILDING');
        roadmap.deployed = rows.filter((r: any) => r.status === 'DEPLOYED');
        console.log(`Roadmap Stats: Planned=${roadmap.planned.length}, Building=${roadmap.building.length}`);
    } catch (e) { console.error("Roadmap Fetch Error:", e); }

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-red-400">Admin Control Panel</h1>
                        <p className="text-gray-400 mt-1">User Management & Data Oversight</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <TaskAssignment />
                        <Link href="/app" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
                            Go to Dashboard
                        </Link>
                    </div>
                </header>

                {/* System Integrity Widget */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">System Health</h2>
                    {health ? (
                        <div className={`p-6 rounded-lg border ${health.ui_sync_status === 'HEALTHY' ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800 animate-pulse'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className={`text-lg font-bold ${health.ui_sync_status === 'HEALTHY' ? 'text-green-400' : 'text-red-400'}`}>
                                    {health.ui_sync_status === 'HEALTHY' ? 'SYSTEM SECURE' : 'CRITICAL ALERT: INTEGRITY FAILURE'}
                                </h3>
                                <span className="text-sm text-gray-400">Last Checked: {health.last_checked}</span>
                            </div>
                            <p className="text-gray-300">
                                <strong>Status:</strong> {health.message} <br />
                                <strong>Frontend-Backend Sync:</strong> {health.ui_sync_status}
                            </p>
                        </div>
                    ) : (
                        <div className="p-6 rounded-lg border border-gray-700 bg-gray-800 text-gray-400">
                            Waiting for Watchdog report...
                        </div>
                    )}
                </section>

                {/* R&D Innovation Pipeline */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">R&D Innovation Pipeline (AI Discovery)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {rdFeatures.length > 0 ? rdFeatures.map((feat: any, idx: number) => (
                            <div key={idx} className="bg-gray-800 border border-purple-500/30 p-4 rounded-lg">
                                <span className="text-xs text-purple-400 uppercase font-bold tracking-widest">{feat.source}</span>
                                <h3 className="text-lg font-bold text-white mt-1">{feat.title}</h3>
                                <p className="text-gray-400 text-sm mt-2">{feat.idea}</p>
                                <div className="mt-4 flex gap-2">
                                    <button className="flex-1 bg-green-900/50 hover:bg-green-900 text-green-300 text-xs py-2 rounded border border-green-800 transition-colors">
                                        Approve Build
                                    </button>
                                    <button className="px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-2 rounded">
                                        Discard
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-gray-500 col-span-3">No new innovations discovered yet. Run the Research Agent.</div>
                        )}
                    </div>
                </section>

                {/* Autonomous Roadmap Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Live Autonomous Roadmap
                        </h2>
                        <span className="text-xs text-gray-400">Updates Real-time</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Planned */}
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 flex justify-between">
                                Discovery / Planned <span>{roadmap.planned.length}</span>
                            </h3>
                            <div className="space-y-3">
                                {roadmap.planned.length === 0 && <div className="text-gray-500 text-sm">No items.</div>}
                                {roadmap.planned.map((feat: any, idx: number) => (
                                    <div key={idx} className="bg-gray-900 p-3 rounded border border-gray-800 border-l-4 border-l-blue-500">
                                        <div className="text-sm font-semibold text-gray-200">{feat.feature_name}</div>
                                        <div className="text-xs text-gray-500 mt-1">Source: {feat.source}</div>
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
                                    <div key={idx} className="bg-gray-900 p-3 rounded border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                        <div className="text-sm font-semibold text-white">{feat.feature_name}</div>
                                        <div className="text-xs text-blue-400 mt-2 flex items-center gap-2">
                                            <span className="animate-spin">⟳</span> Writing Code...
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
                                    <div key={idx} className="bg-gray-900 p-3 rounded border border-green-900/50 border-l-4 border-l-green-500">
                                        <div className="text-sm font-semibold text-gray-200 line-through decoration-gray-500">{feat.feature_name}</div>
                                        {feat.pr_link && <a href={feat.pr_link} className="text-xs text-green-500 mt-1 hover:underline">View PR #{feat.pr_link.split('/').pop()}</a>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Users Section */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Registered Users</h2>
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Username</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 text-gray-500">{user.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{user.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${user.role === 'super_admin' ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Data Oversight Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-200">Market Data Oversight</h2>
                        <button className="text-xs text-red-400 hover:text-red-300 underline">
                            Purge Old Data
                        </button>
                    </div>
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Pulse</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Rec</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {prices.map((price) => (
                                    <tr key={price.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 text-gray-500">{price.id}</td>
                                        <td className="px-6 py-4">{price.pulse_type}</td>
                                        <td className="px-6 py-4">{price.location}</td>
                                        <td className="px-6 py-4 text-teal-400">{price.price}</td>
                                        <td className="px-6 py-4">{price.recommendation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
