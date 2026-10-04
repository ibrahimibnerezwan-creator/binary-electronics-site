'use server'

import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { encrypt, getCurrentUser } from '@/lib/auth'
import { allowRequest } from '@/lib/rate-limit'
import { saveOrder } from '@/lib/order-service'
import { CheckoutData, userFacingError } from '@/lib/commerce'

export async function placeOrder(data: CheckoutData) {
  try {
    if (!(await allowRequest(await headers(), 'checkout', 20))) return {error:'Please wait 15 minutes before trying checkout again.'}
    const user = await getCurrentUser()
    // Prepare receipt proof first so a missing secret cannot strand a saved order.
    const proof = await encrypt({ purpose: 'receipt', orderId: data?.requestId })
    const result = await saveOrder(data, user?.id && user.id !== 'admin-1' ? user.id : null)
    const jar = await cookies()
    jar.set(`receipt-${result.orderId}`, proof, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: `/order-confirmation/${result.orderId}`, maxAge: 7 * 24 * 60 * 60 })
    revalidatePath('/', 'layout')
    return { success: true, ...result }
  } catch (error) {
    return { error: userFacingError(error, 'We could not complete checkout. Your cart is saved; please try again.') }
  }
}
