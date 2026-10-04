import { NextRequest, NextResponse } from 'next/server';
import { allowRequest } from '@/lib/rate-limit';
import { timingSafeEqual, createHash } from 'node:crypto';
import { login, logout } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (!(await allowRequest(req.headers, 'admin-login', 15))) return NextResponse.json({error:'Too many attempts. Try again in 15 minutes.'},{status:429});
    const { username, password } = await req.json();
    if (typeof username !== 'string' || typeof password !== 'string' || username.length > 150 || password.length > 200) return NextResponse.json({error:'Invalid credentials'},{status:400});

    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin password not set' }, { status: 500 });
    }

    if (username === adminUser && timingSafeEqual(createHash('sha256').update(password).digest(), createHash('sha256').update(adminPassword).digest())) {
      await login({
        id: 'admin-1',
        email: `${adminUser}@binaryelectronics.com.bd`,
        name: 'Admin'
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await logout();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
