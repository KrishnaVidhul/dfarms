import { pool } from '../../../../lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Read the migration file
        // Note: In Cloud Run, source files might not be preserved in strict paths if not copied.
        // But for local dev/verification, we can use fs. 
        // If fs fails, I'll inline the SQL as fallback or hardcode it here.

        const sql = `
            ALTER TABLE batches ADD COLUMN IF NOT EXISTS quantity DECIMAL(10, 2) DEFAULT 0;
            ALTER TABLE batches ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(10, 2) DEFAULT 0;
            ALTER TABLE batches ADD COLUMN IF NOT EXISTS yield_percent DECIMAL(5, 2) DEFAULT 0;
            CREATE INDEX IF NOT EXISTS idx_batches_commodity ON batches(commodity_id);
            CREATE INDEX IF NOT EXISTS idx_batches_stage ON batches(current_stage);
        `;

        await pool.query(sql);
        return NextResponse.json({ success: true, message: 'Migration 003 applied successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
