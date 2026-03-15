import { db } from '@/db';
import { products, categories, productImages, brands, orders, storeSettings, reviews, users } from '@/db/schema';
import { eq, desc, isNotNull, sql, ne, and, lt } from 'drizzle-orm';

export interface ProductForCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
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
        rating: 5,
        reviews: 0,
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
        rating: 5,
        reviews: 0,
      });
      if (result.length >= limit) break;
    }
    return result;
  } catch (e) {
    return [];
  }
}

export async function getAllProducts(): Promise<ProductForCard[]> {
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
      .orderBy(desc(products.createdAt));

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
        rating: 5,
        reviews: 0,
      });
    }
    return result;
  } catch (e) {
    console.error('Error fetching all products:', e);
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

export async function getCategoryBySlug(slug: string) {
  try {
    return await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
  } catch (e) {
    return null;
  }
}

export async function getProductsByCategory(categoryId: string, limit = 20): Promise<ProductForCard[]> {
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
      .where(eq(products.categoryId, categoryId))
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
        rating: 5,
        reviews: 0,
      });
    }
    return result;
  } catch (e) {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        images: {
          orderBy: (image, { asc }) => [asc(image.sortOrder)],
        },
        category: true,
        brand: true,
      },
    });

    if (!product) return null;

    return {
      ...product,
      specs: product.specs ? JSON.parse(product.specs) : {},
      categoryName: product.category?.name || 'Uncategorized',
      images: product.images.length > 0 
        ? product.images.map(img => img.url)
        : ['https://via.placeholder.com/1000'],
      rating: 5,
      reviewsCount: 0, // Used on detail page
    };
  } catch (e) {
    console.error('Error fetching product by slug:', e);
    return null;
  }
}

export async function getRelatedProducts(categoryId: string | null, currentProductId: string, limit = 4) {
  if (!categoryId) return [];
  
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
      .where(and(eq(products.categoryId, categoryId), ne(products.id, currentProductId)))
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
        rating: 5,
        reviews: 0,
      });
      if (result.length >= limit) break;
    }
    return result;
  } catch (e) {
    return [];
  }
}

// ==================== ADMIN QUERIES ====================

export async function getAllOrders() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (e) {
    return [];
  }
}

export async function getRecentOrders(limit = 5) {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  } catch (e) {
    return [];
  }
}

export async function getAllCategories() {
  try {
    return await db.select().from(categories).orderBy(categories.name);
  } catch (e) {
    return [];
  }
}

export async function getAllReviews() {
  try {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        reviewerName: reviews.reviewerName,
        createdAt: reviews.createdAt,
        status: reviews.status,
        adminReply: reviews.adminReply,
        productName: products.name,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .orderBy(desc(reviews.createdAt));
  } catch (e) {
    return [];
  }
}

export async function getUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (e) {
    return [];
  }
}

export async function getStoreSettings() {
  try {
    const result = await db.select().from(storeSettings);
    return result.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (e) {
    return {};
  }
}

export async function getStoreSetting(key: string, defaultValue = '') {
  try {
    const result = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
    return result.length > 0 ? result[0].value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

// DASHBOARD HELPERS
export async function getProductCount() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(products);
  return result[0].count;
}

export async function getOrderCount() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(orders);
  return result[0].count;
}

export async function getUserCount() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(users);
  return result[0].count;
}

export async function getTotalRevenue() {
  const result = await db.select({ sum: sql<number>`sum(${orders.total})` }).from(orders);
  return result[0].sum || 0;
}

export async function getLowStockProducts(threshold = 5) {
  return await db.select().from(products).where(lt(products.stock, threshold)).limit(5);
}
