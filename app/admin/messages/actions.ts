'use server'
import { db } from '@/db'
import { contactMessages, itemRequests } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { deleteItemRequest } from '@/lib/item-request-service'
import { r2Storage } from '@/lib/r2-storage'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
export async function markRead(form:FormData) {
  await requireAdmin()
  const id=form.get('id')
  if(typeof id!=='string')return
  await db.update(contactMessages).set({status:'READ'}).where(eq(contactMessages.id,id))
  revalidatePath('/admin/messages')
}
export async function markRequestRead(form:FormData) {
  await requireAdmin()
  const id=form.get('id')
  if(typeof id!=='string')return
  await db.update(itemRequests).set({status:'READ'}).where(eq(itemRequests.id,id))
  revalidatePath('/admin/messages')
}
export async function deleteRequest(form:FormData) {
  await requireAdmin()
  const id=form.get('id')
  if(typeof id!=='string')return
  await deleteItemRequest(id,r2Storage)
  revalidatePath('/admin/messages')
}
