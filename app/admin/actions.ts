'use server'

import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string
    const imageUrl = formData.get('imageUrl') as string
    
    if (!name) return { error: 'Name is required' }
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    
    try {
        await db.insert(categories).values({
            id: uuidv4(),
            name,
            slug,
            image: imageUrl || null,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    } catch (e) {
        return { error: 'Failed to create category' }
    }
    
    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
    try {
        await db.delete(categories).where(eq(categories.id, id))
    } catch (e) {
        return { error: 'Failed to delete category' }
    }
    
revalidatePath('/admin/categories')
}

export async function deleteProduct(id: string) {
    try {
        await db.delete(products).where(eq(products.id, id))
    } catch (e) {
        return { error: 'Failed to delete product' }
    }
    
    revalidatePath('/admin/products')
}
