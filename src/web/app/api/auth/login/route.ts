import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (res.rows.length === 0) {
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
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT Session with Tenant ID
        const token = await signSession({
            sub: user.id,
            username: user.username,
            role: user.role,
            tenant_id: user.tenant_id // Critical for data isolation
        });

        const response = NextResponse.json({ success: true, role: user.role });
        const isProduction = process.env.NODE_ENV === 'production';

        response.cookies.set({
            name: 'session',
            value: token,
            httpOnly: true,
            path: '/',
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;

    } catch (error: any) {
        console.error('Login Route Critical Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
