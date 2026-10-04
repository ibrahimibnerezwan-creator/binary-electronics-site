'use server'
import { db, writeTransaction } from '@/db'
import { orders, storeSettings } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { changeOrderStatus } from '@/lib/order-service'
import { userFacingError, ValidationError } from '@/lib/commerce'

export async function updateOrderStatus(id: string, status: string) {
  try { await requireAdmin() } catch { return {success:false,error:'Session expired. Please log in again.'} }
  try { await changeOrderStatus(id,status); revalidatePath('/', 'layout'); return {success:true} }
  catch(e) { return {success:false,error:userFacingError(e,'Failed to save order status.')} }
}
export async function updatePaymentStatus(id: string, status: string) {
  try { await requireAdmin() } catch { return {success:false,error:'Session expired. Please log in again.'} }
  if (!['PENDING','VERIFYING','PAID','REFUNDED'].includes(status)) return {success:false,error:'Invalid payment status.'}
  try {
    const changed = await db.update(orders).set({paymentStatus:status,updatedAt:new Date()}).where(eq(orders.id,id)).returning({id:orders.id})
    if (!changed.length) return {success:false,error:'Order not found.'}
    revalidatePath('/', 'layout'); return {success:true}
  } catch { return {success:false,error:'Failed to save payment status.'} }
}
export async function sendToSteadfast(orderId: string) {
  try { await requireAdmin() } catch { return {error:'Session expired. Please log in again.'} }
  let claimed = false
  try {
    const order = await db.query.orders.findFirst({where:eq(orders.id,orderId)})
    if (!order) return {error:'Order not found.'}
    if (order.courierTrackingId) return {success:true,trackingId:order.courierTrackingId}
    if (order.status !== 'PROCESSING') return {error:'Set the verified order to PROCESSING before booking a courier.'}
    if (order.paymentMethod !== 'cod' && order.paymentStatus !== 'PAID') return {error:'Verify the prepaid payment before dispatch.'}
    const settings = Object.fromEntries((await db.select().from(storeSettings)).map(s=>[s.key,s.value]))
    if (!settings.steadfast_api_key || !settings.steadfast_secret_key) return {error:'Save your real Steadfast API credentials in Settings first.'}
    const claim = await db.update(orders).set({status:'DISPATCHING',updatedAt:new Date()}).where(and(eq(orders.id,orderId),eq(orders.status,'PROCESSING'))).returning({id:orders.id})
    if (!claim.length) return {error:'A courier booking is already in progress. Refresh to check the order.'}
    claimed = true
    const response = await fetch('https://portal.steadfast.com.bd/api/v1/create_order', {
      method:'POST', headers:{'Api-Key':settings.steadfast_api_key,'Secret-Key':settings.steadfast_secret_key,'Content-Type':'application/json'},
      body:JSON.stringify({invoice:order.id,recipient_name:order.customerName,recipient_phone:order.customerPhone,recipient_address:`${order.address}, ${order.shippingCity}`,cod_amount:order.paymentMethod === 'cod' && order.paymentStatus !== 'PAID' ? order.total : 0,note:`Binary Electronics order ${order.id}`}),
      signal:AbortSignal.timeout(20000),
    })
    const result = await response.json()
    const tracking = result?.consignment?.tracking_code
    if (!response.ok || result.status !== 200 || typeof tracking !== 'string' || !tracking) throw new Error('Booking not confirmed')
    await db.update(orders).set({status:'SHIPPED',courierTrackingId:tracking,updatedAt:new Date()}).where(eq(orders.id,orderId))
    revalidatePath('/', 'layout'); return {success:true,trackingId:tracking}
  } catch {
    if (claimed) {
      await db.update(orders).set({status:'DISPATCH_REVIEW',updatedAt:new Date()}).where(eq(orders.id,orderId))
      revalidatePath('/admin/orders')
      return {error:'Booking outcome is uncertain. Check this invoice in the Steadfast portal before retrying to avoid duplicate parcels.'}
    }
    return {error:'Could not connect to the courier. Please try again.'}
  }
}

export async function resolveCourierBooking(orderId: string, trackingId: string, confirmedAbsent: boolean) {
  try {
    await requireAdmin()
    if (typeof trackingId !== 'string' || trackingId.length > 100 || (trackingId && !/^[a-zA-Z0-9_-]+$/.test(trackingId))) throw new ValidationError('Enter the tracking code from the courier portal.')
    if (!trackingId && confirmedAbsent !== true) throw new ValidationError('Check the courier portal and confirm there is no booking for this invoice.')
    await writeTransaction(async tx => {
      const order = await tx.query.orders.findFirst({where:eq(orders.id, orderId)})
      if (!order || !['DISPATCHING','DISPATCH_REVIEW'].includes(order.status)) throw new ValidationError('Refresh this order before resolving its courier booking.')
      if (order.status === 'DISPATCHING' && Date.now() - order.updatedAt.getTime() < 300000) throw new ValidationError('The booking is still in progress. Wait five minutes before checking recovery.')
      await tx.update(orders).set({status:trackingId ? 'SHIPPED' : 'PROCESSING',courierTrackingId:trackingId || null,updatedAt:new Date()}).where(eq(orders.id,orderId))
    })
    revalidatePath('/', 'layout'); return {success:true}
  } catch (e) { return {success:false,error:userFacingError(e,'Could not resolve booking. Refresh and try again.')} }
}
