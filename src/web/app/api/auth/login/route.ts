import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

function hash_password(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const client = await pool.connect();
        const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        client.release();

        if (res.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = res.rows[0];
        const inputHash = hash_password(password);

        if (inputHash !== user.password_hash) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Success - Set Cookie
        // In a production app, verify secure flags and use a signed JWT/Session.
        const response = NextResponse.json({ success: true, role: user.role });

        response.cookies.set({
            name: 'auth_role',
            value: user.role,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
