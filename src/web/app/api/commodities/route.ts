import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch all commodities
        const res = await pool.query('SELECT * FROM commodities ORDER BY name ASC');
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Fetch commodities error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
