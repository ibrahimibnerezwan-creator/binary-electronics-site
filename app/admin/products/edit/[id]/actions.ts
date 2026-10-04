'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { saveProduct } from '@/lib/product-service'
import { userFacingError } from '@/lib/commerce'
export async function updateProduct(productId: string, formData: FormData) {
  try { await requireAdmin() } catch { return { success:false,error:'Session expired. Please log in again.' } }
  try {
    await saveProduct(formData,productId)
    revalidatePath('/', 'layout')
    return { success:true }
  } catch(error) { return { success:false,error:userFacingError(error,'Could not save changes. Your previous product is unchanged.') } }
}
