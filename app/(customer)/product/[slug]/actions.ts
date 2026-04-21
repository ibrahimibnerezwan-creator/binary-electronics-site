'use server'

import { db } from '@/db'
import { reviews } from '@/db/schema'
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

  const rating = Math.round(Number(data.rating))
  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Please select a rating from 1 to 5 stars.' }
  }

  const comment = (data.comment || '').trim()
  if (comment.length > 2000) {
    return { error: 'Review is too long (max 2000 characters).' }
  }

  try {
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
