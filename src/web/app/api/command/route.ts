import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { command } = await request.json();

        if (!command || typeof command !== 'string') {
            return NextResponse.json({ error: 'Command is required' }, { status: 400 });
        }

        // Write to the shared Database Table that super_agent.py polls
        // Use the singleton pool from lib/db
        const { pool } = await import('@/lib/db');

        const result = await pool.query(
            "INSERT INTO agent_jobs (command, status) VALUES ($1, 'PENDING') RETURNING id",
            [command]
        );

        console.log(`Command DB Inserted: ${command}, ID: ${result.rows[0].id}`);

        return NextResponse.json({ success: true, message: 'Command sent to Agent (Queued)', jobId: result.rows[0].id });
    } catch (error) {
        console.error('Error writing command:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
