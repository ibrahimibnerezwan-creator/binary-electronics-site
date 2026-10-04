import { db, writeTransaction } from '@/db'
import { products, productImages, categories, brands } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { text, ValidationError } from './commerce'

export function imageUrl(value: unknown) {
  const url = text(value, 'image URL', 2048)
  if (url.startsWith('/') && !url.startsWith('//') && !url.includes('\\')) return url
  let parsed: URL
  try { parsed = new URL(url) } catch { throw new ValidationError('Upload a permanent image before saving.') }
  const configured = process.env.CF_PUBLIC_DOMAIN ? new URL(process.env.CF_PUBLIC_DOMAIN).hostname : ''
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || !(parsed.hostname === configured || parsed.hostname === 'images.unsplash.com' || /^pub-[a-z0-9]+\.r2\.dev$/.test(parsed.hostname))) throw new ValidationError('Use an uploaded image from the configured media store.')
  return url
}

export function productInput(form: FormData) {
  const name = text(form.get('name'), 'product name', 200)
  const description = text(form.get('description'), 'description', 20000, false)
  const numeric = (key: string, min: number, max: number, integer = false) => {
    const raw = form.get(key)
    const n = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN
    if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isSafeInteger(n))) throw new ValidationError(`Invalid ${key}.`)
    return n
  }
  const price = numeric('price', 0.01, 10000000)
  const comparePrice = form.get('comparePrice') ? numeric('comparePrice', 0.01, 10000000) : null
  const stock = numeric('stock', 0, 1000000, true)
  const optional = (key: string, max: number) => form.has(key) ? text(form.get(key), key, max, false) : undefined
  const reference = (key: string) => {
    const value = optional(key, 100)
    return !value || value.startsWith('Select ') ? null : value
  }
  let specs: string | undefined
  if (form.has('specs')) {
    try {
      const parsed = JSON.parse(String(form.get('specs') || '{}'))
      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object' || Object.keys(parsed).length > 100 || Object.entries(parsed).some(([k,v]) => k.length > 100 || !['string','number','boolean'].includes(typeof v) || String(v).length > 1000)) throw new Error()
      specs = JSON.stringify(parsed)
    } catch { throw new ValidationError('Specifications must be a JSON object of names and values, e.g. {"Voltage":"12V"}.') }
  }
  let images: string[] | undefined
  if (form.has('images')) {
    try {
      const parsed = JSON.parse(String(form.get('images')))
      if (!Array.isArray(parsed) || parsed.length > 5) throw new Error()
      images = [...new Set(parsed.map(imageUrl))]
    } catch (e) { throw e instanceof ValidationError ? e : new ValidationError('Choose up to five valid product photos.') }
  }
  return { name, description, price, comparePrice, stock, categoryId: reference('categoryId'), brandId: reference('brandId'), sku: optional('sku',100), isFeatured: form.get('isFeatured') === 'true', specs, warranty: optional('warranty',200), weight: optional('weight',100), images }
}

export async function saveProduct(form: FormData, productId?: string) {
  const { images, ...input } = productInput(form)
  return writeTransaction(async tx => {
    const existing = productId ? await tx.query.products.findFirst({ where: eq(products.id, productId) }) : undefined
    if (productId && !existing) throw new ValidationError('Product no longer exists.')
    if (input.categoryId && !(await tx.select({ id: categories.id }).from(categories).where(eq(categories.id,input.categoryId))).length) throw new ValidationError('Choose an existing category.')
    if (input.brandId && !(await tx.select({ id: brands.id }).from(brands).where(eq(brands.id,input.brandId))).length) throw new ValidationError('Choose an existing brand.')
    const id = productId || crypto.randomUUID()
    const slug = existing?.slug || `${input.name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'product'}-${id.slice(0,8)}`
    if (existing) await tx.update(products).set({ ...input, updatedAt: new Date() }).where(eq(products.id,id))
    else await tx.insert(products).values({ ...input, id, slug, specs: input.specs || '{}', createdAt: new Date(), updatedAt: new Date() })
    if (images !== undefined) {
      await tx.delete(productImages).where(eq(productImages.productId,id))
      if (images.length) await tx.insert(productImages).values(images.map((url,sortOrder) => ({ id:crypto.randomUUID(),productId:id,url,sortOrder })))
    }
    return { id, slug }
  })
}
