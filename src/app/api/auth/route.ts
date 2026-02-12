import { NextResponse } from 'next/server';
import { encryptData } from '@/lib/crypto';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();
  const correctPassword = process.env.APP_PASSWORD;

  if (password === correctPassword) {
    const sessionToken = encryptData('valid-session', correctPassword!);
    const cookieStore = await cookies();
    cookieStore.set('pan_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('pan_session');
  if (session) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('pan_session');
  return NextResponse.json({ success: true });
}
