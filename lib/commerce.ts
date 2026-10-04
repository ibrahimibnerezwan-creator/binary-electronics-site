export class ValidationError extends Error {}

export const PUBLIC_SETTING_KEYS = [
  'storeName', 'storeDescription', 'phone', 'email', 'address', 'whatsapp',
  'facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin',
  'bkash_number', 'nagad_number', 'shipping_inside_dhaka', 'shipping_outside_dhaka', 'vat_percentage',
] as const

export function publicSettings(settings: Record<string, string>) {
  return Object.fromEntries(PUBLIC_SETTING_KEYS.filter(key => key in settings).map(key => [key, settings[key]]))
}

export function text(value: unknown, label: string, max: number, required = true): string {
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) throw new ValidationError(`Please provide a valid ${label}.`)
  return value.trim()
}

export function normalizePhone(value: unknown) {
  const phone = text(value, 'Bangladesh phone number', 30).replace(/[\s()-]/g, '').replace(/^(?:\+88|88)/, '')
  if (!/^01[3-9]\d{8}$/.test(phone)) throw new ValidationError('Please enter a valid Bangladesh mobile number, e.g. 01712345678.')
  return phone
}

export function whatsappNumber(value: string) {
  const digits = value.replace(/\D/g, '')
  return /^01[3-9]\d{8}$/.test(digits) ? `88${digits}` : digits
}

export function money(value: number) { return Math.round((value + Number.EPSILON) * 100) / 100 }

export function deliverySettings(settings: Record<string, string>) {
  const read = (key: string, fallback: number, max: number) => {
    const raw = settings[key]
    const n = raw === undefined || raw.trim() === '' ? fallback : Number(raw)
    if (!Number.isFinite(n) || n < 0 || n > max) throw new ValidationError('Delivery or tax settings need correction. Please contact the store.')
    return n
  }
  return { inside: read('shipping_inside_dhaka', 60, 10000), outside: read('shipping_outside_dhaka', 120, 10000), vat: read('vat_percentage', 0, 100) }
}

export function orderTotals(subtotal: number, city: string, settings: Record<string, string>) {
  const rates = deliverySettings(settings)
  const shipping = city === 'Dhaka' ? rates.inside : rates.outside
  const tax = money(subtotal * rates.vat / 100)
  return { subtotal: money(subtotal), shipping, tax, total: money(subtotal + shipping + tax) }
}

export interface CheckoutData {
  customerName: string; customerPhone: string; address: string; shippingCity: string
  paymentMethod: string; transactionId?: string; requestId: string
  items: Array<{ id: string; quantity: number; price?: number }>; total: number; honeypot?: string
}

export function validateCheckout(data: CheckoutData) {
  if (!data || data.honeypot) throw new ValidationError('Invalid submission.')
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(data.requestId || '')) throw new ValidationError('Please refresh checkout and try again.')
  const customerName = text(data.customerName, 'name', 120)
  const customerPhone = normalizePhone(data.customerPhone)
  const address = text(data.address, 'delivery address', 600)
  if (!['Dhaka', 'Outside Dhaka'].includes(data.shippingCity)) throw new ValidationError('Choose a delivery region.')
  if (!['cod', 'bkash', 'nagad'].includes(data.paymentMethod)) throw new ValidationError('Choose a supported payment method.')
  const transactionId = data.paymentMethod === 'cod' ? null : text(data.transactionId, 'payment transaction ID', 100)
  if (!Array.isArray(data.items) || !data.items.length || data.items.length > 100) throw new ValidationError('Your cart is empty or too large.')
  const seen = new Set<string>()
  for (const item of data.items) {
    if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 100 || seen.has(item.id)) throw new ValidationError('Invalid or duplicate cart item.')
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) throw new ValidationError('Quantities must be whole numbers between 1 and 999.')
    seen.add(item.id)
  }
  if (!Number.isFinite(data.total) || data.total <= 0) throw new ValidationError('Invalid order total.')
  return { ...data, customerName, customerPhone, address, transactionId }
}

export function userFacingError(error: unknown, fallback: string) {
  return error instanceof ValidationError ? error.message : fallback
}
