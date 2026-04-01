import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, mode } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return NextResponse.json({ success: true, token, user: { email } });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
