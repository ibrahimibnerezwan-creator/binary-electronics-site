import { db } from '@/db'
import { products as productsTable, categories, productImages } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { AdminProductsList } from './products-list'

export default async function AdminProductsPage() {
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      sku: productsTable.sku,
      price: productsTable.price,
      stock: productsTable.stock,
      category: categories.name,
      image: productImages.url,
      slug: productsTable.slug,
    })
    .from(productsTable)
    .leftJoin(categories, eq(productsTable.categoryId, categories.id))
    .leftJoin(productImages, eq(productImages.productId, productsTable.id))
    .orderBy(desc(productsTable.createdAt))

  // Group images into products (since left join repeats for each image, we just take the first one for the list)
  const uniqueProducts: any[] = []
  const seenIds = new Set()
  
  for (const p of products) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id)
      uniqueProducts.push({
        ...p,
        category: p.category || 'Uncategorized',
        image: p.image || 'https://via.placeholder.com/200',
        status: p.stock > 10 ? 'active' : p.stock > 0 ? 'low_stock' : 'out_of_stock'
      })
    }
  }

  return <AdminProductsList products={uniqueProducts} />
}
