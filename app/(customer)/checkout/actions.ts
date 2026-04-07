'use server'

import { db } from '@/db'
import { orders, orderItems, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

interface CheckoutData {
    customerName: string
    customerPhone: string
    address: string
    shippingCity: string
    paymentMethod: string
    transactionId?: string
    items: Array<{ id: string, quantity: number, price: number }>
    total: number
    honeypot?: string
}

export async function placeOrder(data: CheckoutData) {
    try {
        // Honeypot check
        if (data.honeypot) {
            console.warn('Honeypot triggered, possible bot order.')
            return { error: 'Invalid submission' }
        }

        const user = await getCurrentUser()
        const orderId = crypto.randomUUID()

        // 1. Validate input
        if (!data.customerName || !data.customerPhone || !data.address || !data.shippingCity || !data.paymentMethod) {
            return { error: 'All fields are required.' }
        }

        // Phone validation (Bangladesh format: 01XXXXXXXXX)
        const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/
        if (!phoneRegex.test(data.customerPhone.replace(/\s/g, ''))) {
            return { error: 'Please provide a valid Bangladesh phone number (e.g., 01712345678).' }
        }

        if (data.items.length === 0) {
            return { error: 'Cart is empty.' }
        }

        // 2. Validate prices and total
        const storeSettings = await db.query.storeSettings.findMany()
        const settingsMap = Object.fromEntries(storeSettings.map((s: { key: string, value: string }) => [s.key, s.value]))
        const shippingInsideDhaka = parseFloat(settingsMap['shippingInsideDhaka'] || '0')
        const shippingOutsideDhaka = parseFloat(settingsMap['shippingOutsideDhaka'] || '0')
        const shippingCost = data.shippingCity.toLowerCase() === 'dhaka' ? shippingInsideDhaka : shippingOutsideDhaka

        let calculatedSubtotal = 0
        const itemIds = data.items.map(i => i.id)
        const dbProducts = await db.query.products.findMany({
            where: (products, { inArray }) => inArray(products.id, itemIds)
        })

        for (const item of data.items) {
            const product = dbProducts.find(p => p.id === item.id)
            if (!product) throw new Error(`Product mapping failed for ${item.id}`)
            calculatedSubtotal += product.price * item.quantity
        }

        const calculatedTotal = calculatedSubtotal + shippingCost
        
        // Use a small epsilon for float comparison if necessary, but here simple equality or within 1 TK
        if (Math.abs(calculatedTotal - data.total) > 1) {
            console.error('Total mismatch:', { calculatedTotal, submittedTotal: data.total })
            return { error: 'Price calculation mismatch. Please refresh your cart.' }
        }

        // 3. Start transaction
        await db.transaction(async (tx) => {
            // Check stock and decrement
            for (const item of data.items) {
                const product = await tx.query.products.findFirst({
                    where: eq(products.id, item.id)
                })

                if (!product) {
                    throw new Error(`Product not found: ${item.id}`)
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`)
                }

                // Decrement stock
                await tx.update(products)
                    .set({ stock: product.stock - item.quantity, updatedAt: new Date() })
                    .where(eq(products.id, item.id))
            }

            // Create Order
            await tx.insert(orders).values({
                id: orderId,
                userId: user?.id || null,
                status: 'PENDING',
                paymentStatus: data.paymentMethod === 'cod' ? 'PENDING' : 'VERIFYING',
                total: data.total,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                address: data.address,
                shippingCity: data.shippingCity,
                paymentMethod: data.paymentMethod,
                transactionId: data.transactionId || null,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            // Create Order Items
            for (const item of data.items) {
                await tx.insert(orderItems).values({
                    id: crypto.randomUUID(),
                    orderId,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })
            }
        })

        revalidatePath('/admin/orders')
        return { success: true, orderId }
    } catch (error: any) {
        console.error('Checkout error:', error)
        return { error: error.message || 'An unexpected error occurred during checkout.' }
    }
}
