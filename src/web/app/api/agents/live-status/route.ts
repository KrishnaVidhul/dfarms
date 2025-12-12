import { NextResponse } from 'next/server';
import { runQuery } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch Active Job (Status = 'pending' or 'in_progress')
        const activeJobQuery = `
            SELECT id, task_type, status, result_summary, updated_at
            FROM agent_jobs
            WHERE status IN ('pending', 'in_progress')
            ORDER BY updated_at DESC
            LIMIT 1
        `;
        const activeResult = await runQuery(activeJobQuery);

        // 2. Fetch Recent Completed Jobs
        const recentJobsQuery = `
            SELECT id, task_type, status, result_summary, updated_at
            FROM agent_jobs
            WHERE status = 'completed'
            ORDER BY updated_at DESC
            LIMIT 5
        `;
        const recentResult = await runQuery(recentJobsQuery);

        return NextResponse.json({
            active: activeResult.rows[0] || null,
            recent: recentResult.rows || []
        });

    } catch (error) {
        console.error('Error fetching agent live status:', error);
        return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }
}
