import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const role = request.cookies.get('auth_role')?.value;
    const path = request.nextUrl.pathname;

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

    // 3. User Role Based Routing (Driver/Staff/Admin)
    if (path.startsWith('/login') && role) {
        if (role === 'super_admin' || role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
        if (role === 'driver') return NextResponse.redirect(new URL('/driver-portal', request.url));
        if (role === 'staff') return NextResponse.redirect(new URL('/staff-portal', request.url));
        return NextResponse.redirect(new URL('/app', request.url));
    }

    // 4. Protect Specific Portals
    if (path.startsWith('/driver-portal') && role !== 'driver') {
        return NextResponse.redirect(new URL('/app', request.url));
    }
    if (path.startsWith('/staff-portal') && role !== 'staff') {
        return NextResponse.redirect(new URL('/app', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/app/:path*', '/login'],
};
