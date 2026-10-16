'use server'

import { requireAdmin } from '@/lib/auth'
import { createBrandRecord, deleteBrandRecord } from '@/lib/brand-service'
import { userFacingError, ValidationError } from '@/lib/commerce'
import { revalidatePath } from 'next/cache'

function refreshBrands() {
  revalidatePath('/admin/brands')
  revalidatePath('/admin/products/new')
  revalidatePath('/admin/products/edit/[id]', 'page')
}

function logBrandFailure(operation: string, error: unknown) {
  if (error instanceof ValidationError) return
  const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error
  console.error(`Brand ${operation} failed`, {
    name: cause instanceof Error ? cause.name : 'UnknownError',
    code: cause && typeof cause === 'object' && 'code' in cause ? String(cause.code) : undefined,
    message: cause instanceof Error ? cause.message.replace(/(?:https?|libsql):\/\/\S+/g, '[service URL]') : 'Unexpected failure',
  })
}

export async function createBrand(name: string) {
  try { await requireAdmin() } catch { return { success: false as const, error: 'Session expired. Please log in again.' } }
  try {
    const result = await createBrandRecord(name)
    refreshBrands()
    return { success: true as const, ...result }
  } catch (error) {
    logBrandFailure('creation', error)
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
    logBrandFailure('deletion', error)
    return { success: false as const, error: userFacingError(error, 'Could not delete the brand. Please try again.') }
  }
}
