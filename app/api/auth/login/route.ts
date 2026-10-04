import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { compare } from 'bcryptjs'
import { allowRequest } from '@/lib/rate-limit'
import { login, logout } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    if (!(await allowRequest(req.headers, 'customer-login', 20))) return NextResponse.json({error:'Too many attempts. Try again in 15 minutes.'},{status:429})
    const { email, password } = await req.json()

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password || email.length > 254 || password.length > 200) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const result = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1)
    if (result.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = result[0]
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    await login({ id: user.id, email: user.email, name: user.name })

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await logout()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
