'use server'

import { db } from '@/db'
import { products, productImages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin()
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const comparePrice = formData.get('comparePrice') ? parseFloat(formData.get('comparePrice') as string) : null
    const stock = parseInt(formData.get('stock') as string)
    const categoryId = formData.get('categoryId') === 'Select Category' ? null : (formData.get('categoryId') as string)
    const brandId = formData.get('brandId') === 'Select Brand' ? null : (formData.get('brandId') as string)
    const sku = formData.get('sku') as string
    const isFeatured = formData.get('isFeatured') === 'true'

    await db.update(products).set({
      name,
      description,
      price,
      comparePrice,
      stock,
      categoryId,
      brandId,
      sku,
      isFeatured,
      updatedAt: new Date(),
    }).where(eq(products.id, productId))

    // Handle images - delete old ones and insert new
    const imagesJson = formData.get('images') as string
    if (imagesJson) {
      const urls: string[] = JSON.parse(imagesJson)

      // Delete existing images
      await db.delete(productImages).where(eq(productImages.productId, productId))

      // Insert new images
      if (urls.length > 0) {
        const imageInserts = urls.map((url, index) => ({
          id: uuidv4(),
          url,
          productId,
          sortOrder: index,
        }))
        await db.insert(productImages).values(imageInserts)
      }
    }

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath(`/product/${formData.get('slug')}`)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update product' }
  }
}
