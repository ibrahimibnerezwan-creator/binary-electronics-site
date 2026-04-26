'use server'

import { db } from '@/db'
import { categories, products } from '@/db/schema'
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
    const imageUrl = formData.get('imageUrl') as string

    if (!name) return { error: 'Name is required' }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
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
            image: imageUrl || null,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    } catch (e: any) {
        return { error: e?.message || 'Failed to create category' }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/categories')
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
        await db.update(products).set({ categoryId: null, updatedAt: new Date() }).where(eq(products.categoryId, id))
        await db.delete(categories).where(eq(categories.id, id))
    } catch (e: any) {
        return { error: e?.message || 'Failed to delete category' }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/categories')
    revalidatePath('/admin/products')
    return { success: true }
}

export async function deleteProduct(id: string) {
    try {
        await requireAdmin()
    } catch {
        return { error: 'Session expired. Please log in again.', authError: true }
    }

    try {
        await db.delete(products).where(eq(products.id, id))
    } catch (e: any) {
        return { error: e?.message || 'Failed to delete product' }
    }

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
}
