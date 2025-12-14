import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, customerDetails } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 1. Check for logged in user (optional)
        const sessionCookie = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('session='))?.split('=')[1];
        let session = null;
        if (sessionCookie) {
            session = await verifySession(sessionCookie);
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 2. Identify Tenant (Buyer)
            let tenantId = null;
            if (session && session.tenant_id) {
                tenantId = session.tenant_id;
            }

            // 3. Identify Seller (Default Organization for now)
            const sellerRes = await client.query("SELECT id FROM tenants WHERE name = 'Default Organization'");
            const sellerTenantId = sellerRes.rows[0]?.id;

            // 4. Create Order
            // Generate simple Order ID
            const orderNumber = `RFQ-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;

            const orderRes = await client.query(
                `INSERT INTO orders
                (tenant_id, seller_tenant_id, order_number, status, total_amount, customer_details)
                VALUES ($1, $2, $3, 'PENDING', 0, $4)
                RETURNING id`,
                [tenantId, sellerTenantId, orderNumber, JSON.stringify(customerDetails || {})]
            );

            const orderId = orderRes.rows[0].id;

            // 5. Insert Items
            for (const item of items) {
                await client.query(
                    `INSERT INTO order_items
                    (order_id, item_name, quantity, unit, requested_price)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [orderId, item.name, item.quantity, item.unit, item.price || 0]
                );
            }

            await client.query('COMMIT');

            return NextResponse.json({ success: true, orderId, orderNumber });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error: any) {
        console.error('RFQ Error:', error);
        return NextResponse.json({ error: 'Failed to submit RFQ' }, { status: 500 });
    }
}
