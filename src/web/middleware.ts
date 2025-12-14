import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/auth';

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value;
    const path = request.nextUrl.pathname;

    // Verify Session
    let payload = null;
    if (sessionCookie) {
        payload = await verifySession(sessionCookie);
    }

    // Extract role from verified payload, or null if invalid
    const role = payload ? (payload.role as string) : null;

    // 1. Protect Admin Routes
    if (path.startsWith('/admin')) {
        if (!role || (role !== 'super_admin' && role !== 'admin')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. Protect Internal App Routes
    if (path.startsWith('/app')) {
        if (!role) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. User Role Based Routing (Redirect if already logged in)
    if (path.startsWith('/login') && role) {
        if (role === 'super_admin' || role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
        if (role === 'driver') return NextResponse.redirect(new URL('/driver-portal', request.url));
        if (role === 'staff') return NextResponse.redirect(new URL('/staff-portal', request.url));
        return NextResponse.redirect(new URL('/app', request.url));
    }

    // 4. Protect Specific Portals
    if (path.startsWith('/driver-portal') && role !== 'driver') {
        // If not logged in at all, go to login
        if (!role) return NextResponse.redirect(new URL('/login', request.url));
        // If logged in but wrong role, go to default app
        return NextResponse.redirect(new URL('/app', request.url));
    }
    if (path.startsWith('/staff-portal') && role !== 'staff') {
        if (!role) return NextResponse.redirect(new URL('/login', request.url));
        return NextResponse.redirect(new URL('/app', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/app/:path*', '/login', '/driver-portal/:path*', '/staff-portal/:path*'],
};
