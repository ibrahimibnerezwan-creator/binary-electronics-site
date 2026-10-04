'use server'

import { db, writeTransaction } from '@/db'
import { categories, products, orderItems, productImages, reviews, wishlists } from '@/db/schema'
import { imageUrl } from '@/lib/product-service'
import { userFacingError, ValidationError } from '@/lib/commerce'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export async function createCategory(formData: FormData) {
    try {
        await requireAdmin()
    } catch {
        return { error: 'Session expired. Please log in again.', authError: true }
    }

    const name = (formData.get('name') as string)?.trim()
    const photo = formData.get('imageUrl') as string

    if (!name || name.length > 150) return { error: 'Name must contain 1–150 characters' }

    const slug = name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    if (!slug) return { error: 'Name must contain at least one letter or number' }

    try {
        const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1)
        if (existing.length > 0) {
            return { error: 'A category with that name already exists.' }
        }

        await db.insert(categories).values({
            id: uuidv4(),
            name,
            slug,
            image: photo ? imageUrl(photo) : null,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    } catch (e) {
        return { error: userFacingError(e,'Failed to create category') }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/categories')
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function deleteCategory(id: string) {
    try {
        await requireAdmin()
    } catch {
        return { error: 'Session expired. Please log in again.', authError: true }
    }

    try {
        // Detach products from this category instead of cascading the delete,
        // so the products themselves are preserved (unassigned).
        await writeTransaction(async tx => {
            await tx.update(products).set({ categoryId: null, updatedAt: new Date() }).where(eq(products.categoryId, id))
            const deleted = await tx.delete(categories).where(eq(categories.id, id)).returning()
            if (!deleted.length) throw new ValidationError('Category no longer exists.')
        })
    } catch (e) {
        return { error: userFacingError(e,'Failed to delete category') }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/categories')
    revalidatePath('/admin/products')
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function deleteProduct(id: string) {
    try {
        await requireAdmin()
    } catch {
        return { error: 'Session expired. Please log in again.', authError: true }
    }

    try {
        await writeTransaction(async tx => {
            if ((await tx.select().from(orderItems).where(eq(orderItems.productId, id)).limit(1)).length) throw new ValidationError('This product has order history. Set stock to zero to stop sales; keep it for receipts.')
            await tx.delete(productImages).where(eq(productImages.productId,id))
            await tx.delete(reviews).where(eq(reviews.productId,id))
            await tx.delete(wishlists).where(eq(wishlists.productId,id))
            const deleted = await tx.delete(products).where(eq(products.id, id)).returning()
            if (!deleted.length) throw new ValidationError('Product no longer exists.')
        })
    } catch (e) {
        return { error: userFacingError(e,'Failed to delete product') }
    }

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
    try { await requireAdmin() } catch { return {error:'Session expired. Please log in again.',authError:true} }
    const name = String(formData.get('name') || '').trim()
    if (!name || name.length > 150) return {error:'Name must contain 1–150 characters'}
    try {
        const photo = String(formData.get('imageUrl') || '')
        const result = await db.update(categories).set({name,image:photo ? imageUrl(photo) : null,updatedAt:new Date()}).where(eq(categories.id,id)).returning({id:categories.id})
        if (!result.length) return {error:'Category no longer exists.'}
        revalidatePath('/', 'layout'); return {success:true}
    } catch (e) { return {error:userFacingError(e,'Failed to save category')} }
}
