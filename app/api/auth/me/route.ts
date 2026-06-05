import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = getCurrentUser(req);
        if (!user) {
            return NextResponse.json({ user: null });
        }
        return NextResponse.json({ user });
    } catch (error) {
        console.error('Check session error:', error);
        return NextResponse.json({ user: null });
    }
}
