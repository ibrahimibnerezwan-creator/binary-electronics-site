'use server'

import { requireAdmin } from '@/lib/auth'
import { createBrandRecord, deleteBrandRecord } from '@/lib/brand-service'
import { userFacingError } from '@/lib/commerce'
import { revalidatePath } from 'next/cache'

function refreshBrands() {
  revalidatePath('/admin/brands')
  revalidatePath('/admin/products/new')
  revalidatePath('/admin/products/edit/[id]', 'page')
}

export async function createBrand(name: string) {
  try { await requireAdmin() } catch { return { success: false as const, error: 'Session expired. Please log in again.' } }
  try {
    const result = await createBrandRecord(name)
    refreshBrands()
    return { success: true as const, ...result }
  } catch (error) {
    return { success: false as const, error: userFacingError(error, 'Could not save the brand. Please try again.') }
  }
}

export async function deleteBrand(id: string) {
  try { await requireAdmin() } catch { return { success: false as const, error: 'Session expired. Please log in again.' } }
  try {
    await deleteBrandRecord(id)
    refreshBrands()
    return { success: true as const }
  } catch (error) {
    return { success: false as const, error: userFacingError(error, 'Could not delete the brand. Please try again.') }
  }
}
