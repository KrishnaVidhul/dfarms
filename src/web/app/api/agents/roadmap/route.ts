import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT * FROM feature_roadmap ORDER BY created_at DESC");
        client.release();

        const rows = res.rows;
        const planned = rows.filter((r: any) => r.status === 'PLANNED' || r.status === 'Discovery' || r.status === 'FAILED');
        const building = rows.filter((r: any) => r.status === 'BUILDING');
        const deployed = rows.filter((r: any) => r.status === 'DEPLOYED');

        return NextResponse.json({ planned, building, deployed });
    } catch (error) {
        console.error('Roadmap Fetch Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
