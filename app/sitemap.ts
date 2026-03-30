import { MetadataRoute } from 'next'
import { db } from '@/db'
import { products, categories } from '@/db/schema'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://binary-electronics-site.vercel.app'

  // Fetch all products
  const allProducts = await db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products)
  const productUrls = allProducts.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Fetch all categories
  const allCategories = await db.select({ slug: categories.slug, updatedAt: categories.updatedAt }).from(categories)
  const categoryUrls = allCategories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
    ...categoryUrls,
  ]
}
