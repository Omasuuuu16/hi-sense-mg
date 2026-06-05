import { NextRequest, NextResponse } from 'next/server';
import { getClearCookieConfig } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
        response.cookies.set(getClearCookieConfig());
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
}
