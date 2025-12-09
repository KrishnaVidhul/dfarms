import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { task, type } = body;

        if (!task) {
            return NextResponse.json({ error: 'Task content is required' }, { status: 400 });
        }

        // Generate a concise feature name (first few words)
        const featureName = task.split('\n')[0].substring(0, 50) + (task.length > 50 ? '...' : '');

        const client = await pool.connect();

        // Insert into roadmap
        const query = `
            INSERT INTO feature_roadmap (feature_name, status, source, created_at)
            VALUES ($1, 'PLANNED', 'Admin', NOW())
            RETURNING *;
        `;

        // Note: we could store the full 'task' in a description column if we added one, 
        // but for now feature_name serves as the trigger.
        // If the 'idea' column from the design backlog schema logic exists, we could use that,
        // but currently feature_roadmap schema is minimal. 
        // We will stick to the existing schema to avoid DB migration complexity right now.

        const res = await client.query(query, [featureName]);
        client.release();

        return NextResponse.json({ success: true, task: res.rows[0] });

    } catch (error) {
        console.error('Task Assignment Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
