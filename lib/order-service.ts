import { db, writeTransaction } from '@/db'
import { orders, orderItems, products, storeSettings } from '@/db/schema'
import { and, eq, gte, inArray, sql } from 'drizzle-orm'
import { CheckoutData, ValidationError, money, orderTotals, validateCheckout } from './commerce'

export async function saveOrder(input: CheckoutData, userId: string | null) {
  const data = validateCheckout(input)
  return writeTransaction(async tx => {
    const existing = await tx.query.orders.findFirst({ where: eq(orders.id, data.requestId), with: { items: true } })
    if (existing) {
      const same = existing.userId === userId && existing.customerName === data.customerName &&
        existing.customerPhone === data.customerPhone && existing.address === data.address &&
        existing.shippingCity === data.shippingCity && existing.paymentMethod === data.paymentMethod &&
        existing.transactionId === data.transactionId && money(existing.total) === money(data.total) &&
        existing.items.length === data.items.length && existing.items.every(item => data.items.some(i => i.id === item.productId && i.quantity === item.quantity))
      if (!same) throw new ValidationError('This checkout has already been submitted. Start a new checkout for a different order.')
      return { orderId: existing.id, total: existing.total }
    }
    const settings = Object.fromEntries((await tx.select().from(storeSettings)).map(s => [s.key, s.value]))
    if (data.paymentMethod !== 'cod' && !settings[`${data.paymentMethod}_number`]?.trim()) throw new ValidationError('This payment method is unavailable. Choose Cash on Delivery.')
    const catalogue = await tx.select().from(products).where(inArray(products.id, data.items.map(i => i.id)))
    const lines = data.items.map(item => {
      const product = catalogue.find(p => p.id === item.id)
      if (!product) throw new ValidationError('An item is no longer available. Remove it from your cart.')
      if (!Number.isFinite(product.price) || product.price <= 0) throw new ValidationError(`${product.name} is not available for online purchase.`)
      if (product.stock < item.quantity) throw new ValidationError(`Only ${product.stock} of ${product.name} remain in stock.`)
      return { product, quantity: item.quantity }
    })
    const totals = orderTotals(lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0), data.shippingCity, settings)
    if (Math.abs(totals.total - money(data.total)) > 0.001) throw new ValidationError('Prices or delivery charges changed. Refresh your cart before paying or placing the order.')
    for (const { product, quantity } of lines) {
      const updated = await tx.update(products).set({ stock: sql`${products.stock} - ${quantity}`, updatedAt: new Date() })
        .where(and(eq(products.id, product.id), gte(products.stock, quantity))).returning({ id: products.id })
      if (!updated.length) throw new ValidationError(`${product.name} just sold out. Please update your cart.`)
    }
    await tx.insert(orders).values({
      id: data.requestId, userId, status: 'PENDING', paymentStatus: data.paymentMethod === 'cod' ? 'PENDING' : 'VERIFYING',
      total: totals.total, customerName: data.customerName, customerPhone: data.customerPhone, address: data.address,
      shippingCity: data.shippingCity, paymentMethod: data.paymentMethod, transactionId: data.transactionId,
      createdAt: new Date(), updatedAt: new Date(),
    })
    await tx.insert(orderItems).values(lines.map(({ product, quantity }) => ({
      id: crypto.randomUUID(), orderId: data.requestId, productId: product.id, quantity, price: product.price,
    })))
    return { orderId: data.requestId, total: totals.total }
  })
}

export const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'] as const
const transitions: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'], PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURNED'], DELIVERED: ['RETURNED'], CANCELLED: [], RETURNED: [],
}

export async function changeOrderStatus(id: string, status: string) {
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) throw new ValidationError('Invalid order status.')
  await writeTransaction(async tx => {
    const order = await tx.query.orders.findFirst({ where: eq(orders.id, id), with: { items: true } })
    if (!order) throw new ValidationError('Order not found.')
    if (order.status === status) return
    if (!transitions[order.status]?.includes(status)) throw new ValidationError(`Cannot change ${order.status} to ${status}.`)
    if (['SHIPPED', 'DELIVERED'].includes(status) && order.paymentMethod !== 'cod' && order.paymentStatus !== 'PAID') throw new ValidationError('Verify the prepaid payment before shipping.')
    if (['CANCELLED', 'RETURNED'].includes(status)) {
      for (const item of order.items) await tx.update(products).set({ stock: sql`${products.stock} + ${item.quantity}`, updatedAt: new Date() }).where(eq(products.id, item.productId))
    }
    await tx.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id))
  })
}
