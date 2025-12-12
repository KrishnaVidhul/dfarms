import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await pool.connect();
        // Query the new Autonomous Development table
        const res = await client.query("SELECT * FROM development_cycles ORDER BY created_at DESC");
        client.release();

        const rows = res.rows;

        // Map DB statuses to Frontend categories
        const planned = rows.filter((r: any) => r.status === 'PROPOSING');
        const building = rows.filter((r: any) => r.status === 'ITERATING');
        const deployed = rows.filter((r: any) => r.status === 'APPROVED' || r.status === 'DEPLOYED');

        // Transform to meet frontend interface if needed (or ensure DB columns match)
        // Frontend expects: feature_name, source, status, pr_link, created_at, started_at
        // DB has: feature_title, status, iteration_count, created_at

        const transform = (r: any) => ({
            feature_name: `${r.feature_title} (Iter: ${r.iteration_count}/10)`,
            source: 'Autonomous Agent',
            status: r.status,
            pr_link: null,
            created_at: r.created_at,
            started_at: r.updated_at
        });

        return NextResponse.json({
            planned: planned.map(transform),
            building: building.map(transform),
            deployed: deployed.map(transform)
        });
    } catch (error) {
        console.error('Roadmap Fetch Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
