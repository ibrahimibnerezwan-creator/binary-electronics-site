import { NextResponse } from 'next/server'
import { db } from '@/db'
import { newsletter } from '@/db/schema'
import { allowRequest } from '@/lib/rate-limit'
export async function POST(req: Request) {
  try {
    if (!(await allowRequest(req.headers,'newsletter',15))) return NextResponse.json({error:'Please try again in 15 minutes.'},{status:429})
    const data = await req.json()
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
    if (data.website || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({error:'Enter a valid email address.'},{status:400})
    await db.insert(newsletter).values({id:crypto.randomUUID(),email,createdAt:new Date()}).onConflictDoNothing()
    return NextResponse.json({message:'Your subscription is saved.'})
  } catch { return NextResponse.json({error:'Could not save your subscription. Please try again.'},{status:503}) }
}
