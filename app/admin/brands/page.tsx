import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { brands, products } from '@/db/schema'
import { asc, count, eq } from 'drizzle-orm'
import { BrandManager } from './brand-manager'

export const dynamic = 'force-dynamic'

export default async function BrandsPage() {
  await requireAdmin()
  const list = await db.select({ id: brands.id, name: brands.name, productCount: count(products.id) })
    .from(brands).leftJoin(products, eq(brands.id, products.brandId)).groupBy(brands.id).orderBy(asc(brands.name))
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl lg:text-4xl font-display font-black uppercase tracking-tight">Brands</h1>
        <p className="mt-2 text-sm text-text-secondary">Add brands here or directly while adding a product.</p>
      </div>
      <BrandManager brands={list} />
    </div>
  )
}
