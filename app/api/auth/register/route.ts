import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'
import { encrypt, login } from '@/lib/auth'
import { allowRequest } from '@/lib/rate-limit'
import { normalizePhone, text, ValidationError, userFacingError } from '@/lib/commerce'
export async function POST(req:Request) {
  try {
    if(!(await allowRequest(req.headers,'register',10)))return NextResponse.json({error:'Please try again in 15 minutes.'},{status:429})
    const data=await req.json()
    const name=text(data.name,'name',120)
    const email=text(data.email,'email',254).toLowerCase()
    const phone=normalizePhone(data.phone)
    const password=data.password
    if(typeof password !== 'string')throw new ValidationError('Enter a password.')
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new ValidationError('Enter a valid email address.')
    if(password.length<8 || Buffer.byteLength(password)>72)throw new ValidationError('Password must have at least 8 characters and at most 72 bytes.')
    if((await db.select({id:users.id}).from(users).where(eq(users.email,email)).limit(1)).length)return NextResponse.json({error:'An account with this email already exists. Please sign in.'},{status:409})
    const user={id:crypto.randomUUID(),name,email}
    await encrypt({user})
    const inserted=await db.insert(users).values({...user,phone,password:await hash(password,12),createdAt:new Date()}).onConflictDoNothing().returning({id:users.id})
    if(!inserted.length)return NextResponse.json({error:'An account with this email already exists.'},{status:409})
    await login(user)
    return NextResponse.json({success:true,user},{status:201})
  }catch(e){return NextResponse.json({error:userFacingError(e,'Registration failed. Please try again.')},{status:e instanceof ValidationError?400:503})}
}
