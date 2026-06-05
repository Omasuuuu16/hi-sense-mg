import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/lib/store';
import { comparePassword, signToken, getCookieConfig } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const errors: Record<string, string> = {};

        const trimmedEmail = (email || '').trim().toLowerCase();
        if (!trimmedEmail) {
            errors.email = 'Email is required';
        }

        const trimmedPassword = (password || '').trim();
        if (!trimmedPassword) {
            errors.password = 'Password is required';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        const user = await getUserByEmail(trimmedEmail);
        if (!user) {
            return NextResponse.json({ 
                error: 'Validation failed', 
                details: { email: 'Email address not found' } 
            }, { status: 400 });
        }

        const passwordMatch = await comparePassword(trimmedPassword, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ 
                error: 'Validation failed', 
                details: { password: 'Wrong password' } 
            }, { status: 400 });
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone
        };

        const token = signToken(payload);
        const cookieConfig = getCookieConfig(token);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

        response.cookies.set(cookieConfig);

        return response;
    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({ error: 'An unexpected database error occurred.' }, { status: 500 });
    }
}
