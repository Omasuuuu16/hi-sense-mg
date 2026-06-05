import { NextRequest, NextResponse } from 'next/server';
import { emailExists, insertUser } from '@/app/lib/store';
import { hashPassword } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, phone, password } = body;

        const errors: Record<string, string> = {};

        const trimmedUsername = (username || '').trim();
        if (!trimmedUsername) {
            errors.username = 'Username is required';
        } else if (trimmedUsername.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        const trimmedEmail = (email || '').trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(trimmedEmail)) {
            errors.email = 'Invalid email format';
        }

        const trimmedPhone = (phone || '').trim();
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!trimmedPhone) {
            errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(trimmedPhone)) {
            errors.phone = 'Invalid phone number (must be 10-15 digits)';
        }

        const trimmedPassword = (password || '').trim();
        if (!trimmedPassword) {
            errors.password = 'Password is required';
        } else if (trimmedPassword.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        if (await emailExists(trimmedEmail)) {
            return NextResponse.json({ 
                error: 'Validation failed', 
                details: { email: 'Email already exists' } 
            }, { status: 400 });
        }

        const hashedPasswordStr = await hashPassword(trimmedPassword);
        await insertUser({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPasswordStr,
            phone: trimmedPhone,
            role: 'User',
        });

        return NextResponse.json({ success: true, message: 'User registered successfully!' }, { status: 201 });
    } catch (error) {
        console.error('Registration API error:', error);
        return NextResponse.json({ error: 'An unexpected database error occurred.' }, { status: 500 });
    }
}
