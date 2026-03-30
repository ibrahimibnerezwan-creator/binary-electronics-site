import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin password not set' }, { status: 500 });
    }

    if (username === adminUser && password === adminPassword) {
      await login({ 
        id: 'admin-1', 
        email: 'admin@binaryelectronics.com.bd', 
        name: 'Admin' 
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
