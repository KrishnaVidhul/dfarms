
import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT * FROM inventory");
        client.release();
        return NextResponse.json({ inventory: res.rows });
    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}
