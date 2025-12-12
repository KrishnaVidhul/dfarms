import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import crypto from 'crypto';

import { pool } from '@/lib/db';

function hash_password(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        console.log(`Login attempt for: ${username} `);

        if (!password) {
            console.log('Login failed: Password missing');
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        console.log('Login Debug: Connecting to DB...');
        // Debug connection string (safe part)
        console.log('DB URL Host:', process.env.DATABASE_URL?.split('@')[1]);

        console.log('Login Debug: Connected. Querying user...');

        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        console.log(`Login Debug: Query complete. Found ${res.rows.length} users.`);

        if (res.rows.length === 0) {
            console.log(`Login failed: User ${username} not found`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = res.rows[0];
        const inputHash = hash_password(password);

        if (inputHash !== user.password_hash) {
            console.log(`Login failed: Invalid password for ${username}`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        console.log(`Login success for: ${username}, role: ${user.role} `);
        const response = NextResponse.json({ success: true, role: user.role });

        const isProduction = process.env.NODE_ENV === 'production';

        response.cookies.set({
            name: 'auth_role',
            value: user.role,
            httpOnly: true,
            path: '/',
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error: any) {
        console.error('Login Route Critical Error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
