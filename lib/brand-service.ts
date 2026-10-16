import { db, writeTransaction } from '@/db'
import { brands, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { text, ValidationError } from './commerce'

const normalizedName = (name: string) => name.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()

export async function createBrandRecord(value: unknown) {
  const name = text(value, 'brand name', 150).replace(/\s+/g, ' ')
  const normalized = normalizedName(name)
  const baseSlug = normalized.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
  if (!baseSlug) throw new ValidationError('Brand name must contain at least one letter or number.')

  const all = await db.select({ id: brands.id, name: brands.name, slug: brands.slug }).from(brands)
  const existing = all.find(brand => normalizedName(brand.name) === normalized)
  if (existing) return { brand: { id: existing.id, name: existing.name }, created: false }

  const id = crypto.randomUUID()
  const slug = all.some(brand => brand.slug === baseSlug) ? `${baseSlug}-${id.slice(0, 8)}` : baseSlug
  const [inserted] = await db.insert(brands).values({ id, name, slug }).onConflictDoNothing().returning({ id: brands.id, name: brands.name })
  if (inserted) return { brand: inserted, created: true }
  const [concurrent] = await db.select({ id: brands.id, name: brands.name }).from(brands).where(eq(brands.slug, slug))
  if (concurrent && normalizedName(concurrent.name) === normalized) return { brand: concurrent, created: false }
  throw new ValidationError('Another brand was just added. Please try saving this brand again.')
}

export async function deleteBrandRecord(id: string) {
  return writeTransaction(async tx => {
    const used = await tx.select({ id: products.id }).from(products).where(eq(products.brandId, id)).limit(1)
    if (used.length) throw new ValidationError('This brand is used by products. Remove it from those products before deleting it.')
    const deleted = await tx.delete(brands).where(eq(brands.id, id)).returning({ id: brands.id })
    if (!deleted.length) throw new ValidationError('Brand no longer exists. Refresh the page.')
  })
}
