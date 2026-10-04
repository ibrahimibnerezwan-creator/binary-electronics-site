'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { saveProduct } from '@/lib/product-service'
import { userFacingError } from '@/lib/commerce'
export async function createProduct(formData: FormData) {
  try { await requireAdmin() } catch { return { success: false, error: 'Session expired. Please log in again.' } }
  try {
    const product = await saveProduct(formData)
    revalidatePath('/admin/products')
    revalidatePath('/', 'layout')
    return { success: true, productId: product.id }
  } catch(error) { return { success:false, error:userFacingError(error,'Could not save the product. Please try again.') } }
}
