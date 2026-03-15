import { db } from '@/db';
import { products, categories, productImages, brands, orders, orderItems, storeSettings, reviews } from '@/db/schema';
import { eq, desc, isNotNull, sql } from 'drizzle-orm';

export interface ProductForCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  stock: number;
}

export async function getNewArrivals(limit = 4): Promise<ProductForCard[]> {
  try {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        comparePrice: products.comparePrice,
        stock: products.stock,
        imageUrl: productImages.url,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .orderBy(desc(products.createdAt))
      .limit(limit * 2);

    const seen = new Set<string>();
    const result: ProductForCard[] = [];
    for (const row of rows) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      result.push({
        id: row.id,
        name: row.name,
        slug: row.slug,
        price: row.price,
        oldPrice: row.comparePrice ?? undefined,
        image: row.imageUrl || 'https://via.placeholder.com/400',
        category: row.categoryName || 'Uncategorized',
        stock: row.stock,
      });
      if (result.length >= limit) break;
    }
    return result;
  } catch (e) {
    console.error('Error fetching new arrivals:', e);
    return [];
  }
}

export async function getFlashSaleProducts(limit = 4): Promise<ProductForCard[]> {
  try {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        comparePrice: products.comparePrice,
        stock: products.stock,
        imageUrl: productImages.url,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(isNotNull(products.comparePrice))
      .limit(limit * 2);

    const seen = new Set<string>();
    const result: ProductForCard[] = [];
    for (const row of rows) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      result.push({
        id: row.id,
        name: row.name,
        slug: row.slug,
        price: row.price,
        oldPrice: row.comparePrice ?? undefined,
        image: row.imageUrl || 'https://via.placeholder.com/400',
        category: row.categoryName || 'Uncategorized',
        stock: row.stock,
      });
      if (result.length >= limit) break;
    }
    return result;
  } catch (e) {
    return [];
  }
}

export async function getAllCategoriesWithCount() {
  return db.select({
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    image: categories.image,
    productCount: sql<number>`count(${products.id})`,
  })
  .from(categories)
  .leftJoin(products, eq(products.categoryId, categories.id))
  .groupBy(categories.id)
  .orderBy(categories.name);
}
