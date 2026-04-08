import { db } from '@/db'
import { products, productImages, categories, brands } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { EditProductForm } from './edit-product-form'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      images: {
        orderBy: (image, { asc }) => [asc(image.sortOrder)],
      },
    },
  })

  if (!product) notFound()

  const categoriesList = await db.select({ id: categories.id, name: categories.name }).from(categories)
  const brandsList = await db.select({ id: brands.id, name: brands.name }).from(brands)

  return (
    <EditProductForm
      product={{
        ...product,
        images: product.images.map(img => img.url),
      }}
      categories={categoriesList}
      brands={brandsList}
    />
  )
}
