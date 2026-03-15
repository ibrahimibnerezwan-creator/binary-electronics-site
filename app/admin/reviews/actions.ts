'use server'

import { db } from '@/db'
import { reviews } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected') {
    try {
        await db.update(reviews)
            .set({ status })
            .where(eq(reviews.id, id))
            
        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error('Failed to update review status:', error)
        return { success: false, error: 'Database update failed' }
    }
}

export async function replyToReview(id: string, reply: string) {
    if (!reply.trim()) return { error: 'Reply content is required' }
    
    try {
        await db.update(reviews)
            .set({ adminReply: reply })
            .where(eq(reviews.id, id))
            
        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error('Failed to reply to review:', error)
        return { success: false, error: 'Database update failed' }
    }
}
