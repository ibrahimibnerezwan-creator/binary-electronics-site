import { NextResponse } from 'next/server'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'
import { allowRequest } from '@/lib/rate-limit'
import { text, ValidationError, userFacingError } from '@/lib/commerce'
export async function POST(req: Request) {
  try {
    if (!(await allowRequest(req.headers,'contact',10))) return NextResponse.json({error:'Please try again in 15 minutes.'},{status:429})
    const data = await req.json()
    if (data.website) throw new ValidationError('Invalid submission.')
    const email = text(data.email,'email',254).toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ValidationError('Enter a valid email address.')
    await db.insert(contactMessages).values({id:crypto.randomUUID(), name:text(data.name,'name',120), email,
      subject:text(data.subject,'subject',200),message:text(data.message,'message',5000),createdAt:new Date()})
    return NextResponse.json({success:true})
  } catch(e) { return NextResponse.json({error:userFacingError(e,'Could not save your message. Please try again.')},{status:e instanceof ValidationError?400:503}) }
}
