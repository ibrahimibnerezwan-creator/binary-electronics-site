'use server'

import { db } from '@/db'
import { orders, storeSettings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(id: string, status: string) {
    try {
        await db.update(orders)
            .set({ status, updatedAt: new Date() })
            .where(eq(orders.id, id))
            
        revalidatePath('/admin/orders')
        revalidatePath(`/admin/orders/${id}`)
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to update order status' }
    }
}

export async function sendToSteadfast(orderId: string) {
    try {
        // 1. Get order details
        const orderRows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
        if (orderRows.length === 0) return { error: 'Order not found' }
        const order = orderRows[0]

        // 2. Get Steadfast API keys
        const settingsRows = await db.select().from(storeSettings)
        const settings = settingsRows.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)

        const apiKey = settings.steadfast_api_key
        const secretKey = settings.steadfast_secret_key

        if (!apiKey || !secretKey) {
            return { error: 'Steadfast API keys not configured in Settings' }
        }

        // 3. Prepare Steadfast payload (Generic structure for Steadfast)
        const payload = {
            invoice: order.id,
            recipient_name: order.customerName,
            recipient_phone: order.customerPhone,
            recipient_address: order.address,
            cod_amount: order.paymentMethod === 'cod' ? order.total : 0,
            note: `Order from Binary Electronics - ID: ${order.id}`
        }

        // 4. API Call to Steadfast
        // Note: Using a standard Steadfast endpoint structure. 
        // In production, this would use the official endpoint from their documentation.
        const response = await fetch('https://portal.steadfast.com.bd/api/v1/create_order', {
            method: 'POST',
            headers: {
                'Api-Key': apiKey,
                'Secret-Key': secretKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const result = await response.json()

        if (result.status === 200 || result.success) {
            // 5. Update order with tracking info
            await db.update(orders).set({
                status: 'SHIPPED',
                courierTrackingId: result.consignment_id || result.tracking_code,
                updatedAt: new Date()
            }).where(eq(orders.id, orderId))

            revalidatePath('/admin/orders')
            return { success: true, trackingId: result.consignment_id || result.tracking_code }
        } else {
            return { error: result.message || 'Steadfast API error' }
        }

    } catch (error) {
        console.error('Steadfast Integration Error:', error)
        return { error: 'Failed to connect to Steadfast' }
    }
}
