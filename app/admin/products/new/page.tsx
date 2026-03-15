import { db } from '@/db'
import { categories, brands } from '@/db/schema'
import { ProductForm } from './product-form'

export default async function AddProductPage() {
  const categoriesList = await db.select({ id: categories.id, name: categories.name }).from(categories)
  const brandsList = await db.select({ id: brands.id, name: brands.name }).from(brands)

  return <ProductForm categories={categoriesList} brands={brandsList} />
}
