import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        // 1. Auth Check (Correct Next.js App Router way)
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;

        if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await verifySession(sessionCookie);
        if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Fetch Orders for the Seller Tenant (The Admin's Organization)
        const client = await pool.connect();
        try {
            const query = `
                SELECT
                    o.id, o.order_number, o.status, o.total_amount, o.created_at, o.customer_details,
                    COUNT(oi.id) as item_count
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.seller_tenant_id = $1 OR $1 IS NULL -- Filter by tenant if strictly enforced
                GROUP BY o.id
                ORDER BY o.created_at DESC
                LIMIT 50
            `;

            const res = await client.query(query, [session.tenant_id]);

            return NextResponse.json({ orders: res.rows });
        } finally {
            client.release();
        }

    } catch (error: any) {
        console.error('Admin Orders Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
