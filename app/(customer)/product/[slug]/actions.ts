'use server'

import { db } from '@/db'
import { reviews, products } from '@/db/schema'
import { headers } from 'next/headers'
import { allowRequest } from '@/lib/rate-limit'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function submitReview(data: {
  productId: string
  productSlug: string
  rating: number
  comment: string
  reviewerName?: string
  honeypot?: string
}) {
  if (data.honeypot) return { error: 'Invalid submission' }

  const user = await getCurrentUser()
  const name = user?.name || data.reviewerName?.trim() || 'Anonymous'

  const rating = Number(data.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Please select a rating from 1 to 5 stars.' }
  }

  const comment = typeof data.comment === 'string' ? data.comment.trim() : ''
  if (comment.length > 2000) {
    return { error: 'Review is too long (max 2000 characters).' }
  }

  try {
    if (!(await allowRequest(await headers(), 'review', 10))) return { error: 'Please wait 15 minutes before submitting another review.' }
    if (!data.productId || name.length > 120 || !(await db.select({id:products.id}).from(products).where(eq(products.id,data.productId))).length) return {error:'This product is unavailable.'}
    await db.insert(reviews).values({
      id: crypto.randomUUID(),
      productId: data.productId,
      rating,
      comment: comment || null,
      reviewerName: name,
      status: 'pending',
      createdAt: new Date(),
    })

    revalidatePath(`/product/${data.productSlug}`)
    revalidatePath('/admin/reviews')
    return { success: true }
  } catch {
    return { error: 'Could not submit review. Please try again.' }
  }
}
