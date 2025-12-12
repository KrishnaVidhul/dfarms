import { NextResponse } from 'next/server';
import { runQuery } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch Low Stock Alerts (< 500kg)
        // Adjust threshold as needed
        const lowStockQuery = `
            SELECT id, batch_number, commodity_id, quantity, 'low_stock' as type, created_at
            FROM inventory_batches 
            WHERE quantity < 500
            ORDER BY created_at DESC
            LIMIT 5
        `;
        const lowStockResult = await runQuery(lowStockQuery);

        // 2. Fetch Recent Agent Jobs
        const agentJobsQuery = `
            SELECT id, agent_id, task_type, status, result_summary, updated_at, 'agent_update' as type
            FROM agent_jobs
            WHERE status IN ('completed', 'failed')
            ORDER BY updated_at DESC
            LIMIT 5
        `;
        const agentJobsResult = await runQuery(agentJobsQuery);

        // Map and Merge Results
        const notifications = [];

        // Map Inventory Alerts
        if (lowStockResult.rows) {
            for (const row of lowStockResult.rows) {
                // Determine commodity name (basic mapping or generic)
                // In a real app, we'd join with commodities table.
                const title = `Low Stock Alert: Batch ${row.batch_number}`;
                const message = `Quantity is critical: ${row.quantity}kg`;

                notifications.push({
                    id: `inv-${row.id}`,
                    title,
                    message,
                    time: new Date(row.created_at), // Date object for sorting
                    type: 'critical',
                    source: 'inventory'
                });
            }
        }

        // Map Agent Updates
        if (agentJobsResult.rows) {
            for (const row of agentJobsResult.rows) {
                const isSuccess = row.status === 'completed';
                const title = isSuccess ? 'Agent Task Completed' : 'Agent Task Failed';
                const message = row.result_summary || `Task ${row.task_type} finished.`;

                notifications.push({
                    id: `agent-${row.id}`,
                    title,
                    message,
                    time: new Date(row.updated_at),
                    type: isSuccess ? 'success' : 'error',
                    source: 'agent'
                });
            }
        }

        // Sort by time (newest first) and format time string
        notifications.sort((a, b) => b.time.getTime() - a.time.getTime());

        // Format time for display (e.g., "5m ago")
        const formattedNotifications = notifications.map(n => ({
            ...n,
            time: formatTimeAgo(n.time)
        }));

        return NextResponse.json(formattedNotifications);

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

function formatTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}
