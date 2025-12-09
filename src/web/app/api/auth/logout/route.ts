import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth_role');
    return response;
}
