import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            // Populate commodities from market_prices
            // We select DISTINCT commodities that don't already exist in the commodities table.

            // Note: We cast "type" to 'RAW' by default for these imported ones.
            // Assumption: Names in market_prices match desired names.

            const query = `
                INSERT INTO commodities (name, type)
                SELECT DISTINCT mp.commodity, 'RAW'
                FROM market_prices mp
                WHERE mp.commodity IS NOT NULL
                AND NOT EXISTS (
                    SELECT 1 FROM commodities c WHERE c.name = mp.commodity
                )
            `;

            const res = await client.query(query);

            return NextResponse.json({
                success: true,
                message: `Synced commodities. Added ${res.rowCount} new items.`
            });

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ success: false, error: 'Failed to sync commodities' }, { status: 500 });
    }
}
