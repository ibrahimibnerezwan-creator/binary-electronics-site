'use server'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
export async function markRead(form:FormData) {
  await requireAdmin()
  const id=form.get('id')
  if(typeof id!=='string')return
  await db.update(contactMessages).set({status:'READ'}).where(eq(contactMessages.id,id))
  revalidatePath('/admin/messages')
}
