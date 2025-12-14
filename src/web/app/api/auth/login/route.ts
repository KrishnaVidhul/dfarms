import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        console.log(`Login attempt for: ${username}`);

        if (!password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (res.rows.length === 0) {
            console.log(`Login failed: User ${username} not found`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = res.rows[0];

        let isValid = false;
        try {
            isValid = await bcrypt.compare(password, user.password_hash);
        } catch (err) {
            console.error('Bcrypt comparison error:', err);
        }

        if (!isValid) {
            console.log(`Login failed: Invalid password for ${username}`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        console.log(`Login success for: ${username}, role: ${user.role}`);

        // Generate JWT Session
        const token = await signSession({
            sub: user.id,
            username: user.username,
            role: user.role
        });

        const response = NextResponse.json({ success: true, role: user.role });
        const isProduction = process.env.NODE_ENV === 'production';

        // Set Secure HTTP-Only Cookie
        response.cookies.set({
            name: 'session', // Standard name
            value: token,
            httpOnly: true,
            path: '/',
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        // Clean up legacy insecurity if it exists
        response.cookies.delete('auth_role');

        return response;

    } catch (error: any) {
        console.error('Login Route Critical Error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
