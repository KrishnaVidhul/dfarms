import { NextResponse } from 'next/server';
import { getAgentHeartbeats, getAgentLogs } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const heartbeats = await getAgentHeartbeats();
    const logs = await getAgentLogs();

    return NextResponse.json({
        heartbeats,
        logs
    });
}
