import { NextResponse } from 'next/server'
import { db } from '@/db'
import { newsletter } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await db.select().from(newsletter).where(eq(newsletter.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }

    // Add to newsletter
    await db.insert(newsletter).values({
      id: uuidv4(),
      email,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
