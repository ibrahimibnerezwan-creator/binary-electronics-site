import { publicSettings } from './commerce';
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

export async function getNewArrivals(limit = 4, featuredFirst = false): Promise<ProductForCard[]> {
  try {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        comparePrice: products.comparePrice,
        stock: products.stock,
        imageUrl: sql<string>`(SELECT url FROM product_images WHERE product_id = ${products.id} ORDER BY sort_order, id LIMIT 1)`,
        categoryName: categories.name,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(reviews, and(eq(reviews.productId, products.id), eq(reviews.status, 'approved')))
      .groupBy(products.id)
      .orderBy(...(featuredFirst ? [desc(products.isFeatured), desc(products.createdAt)] : [desc(products.createdAt)]))
      .limit(limit);

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
        oldPrice: row.comparePrice && row.comparePrice > row.price ? row.comparePrice : undefined,
        image: row.imageUrl || '/logo.png',
        category: row.categoryName || 'Uncategorized',
        stock: row.stock,
        rating: Math.round(row.avgRating),
        reviews: row.reviewCount,
      });
      if (result.length >= limit) break;
    }
    return result;
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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
        imageUrl: sql<string>`(SELECT url FROM product_images WHERE product_id = ${products.id} ORDER BY sort_order, id LIMIT 1)`,
        categoryName: categories.name,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(reviews, and(eq(reviews.productId, products.id), eq(reviews.status, 'approved')))
      .where(isNotNull(products.comparePrice))
      .groupBy(products.id)
      .limit(limit);

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
        oldPrice: row.comparePrice && row.comparePrice > row.price ? row.comparePrice : undefined,
        image: row.imageUrl || '/logo.png',
        category: row.categoryName || 'Uncategorized',
        stock: row.stock,
        rating: Math.round(row.avgRating),
        reviews: row.reviewCount,
      });
      if (result.length >= limit) break;
    }
    return result;
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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
        imageUrl: sql<string>`(SELECT url FROM product_images WHERE product_id = ${products.id} ORDER BY sort_order, id LIMIT 1)`,
        categoryName: categories.name,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(reviews, and(eq(reviews.productId, products.id), eq(reviews.status, 'approved')))
      .groupBy(products.id)
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
        oldPrice: row.comparePrice && row.comparePrice > row.price ? row.comparePrice : undefined,
        image: row.imageUrl || '/logo.png',
        category: row.categoryName || 'Uncategorized',
        stock: row.stock,
        rating: Math.round(row.avgRating),
        reviews: row.reviewCount,
      });
    }
    return result;
  } catch (e) {
    throw new Error("Catalogue unavailable. Please try again.");
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
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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
        imageUrl: sql<string>`(SELECT url FROM product_images WHERE product_id = ${products.id} ORDER BY sort_order, id LIMIT 1)`,
        categoryName: categories.name,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(reviews, and(eq(reviews.productId, products.id), eq(reviews.status, 'approved')))
      .where(eq(products.categoryId, categoryId))
      .groupBy(products.id)
      .limit(limit);

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
        oldPrice: row.comparePrice && row.comparePrice > row.price ? row.comparePrice : undefined,
        image: row.imageUrl || '/logo.png',
        category: row.categoryName || 'Uncategorized',
        stock: row.stock,
        rating: Math.round(row.avgRating),
        reviews: row.reviewCount,
      });
    }
    return result;
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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

    // Fetch aggregate rating
    const ratingResult = await db
      .select({
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, product.id), eq(reviews.status, 'approved')));

    return {
      ...product,
      specs: product.specs ? JSON.parse(product.specs) : {},
      categoryName: product.category?.name || 'Uncategorized',
      images: product.images.length > 0 
        ? product.images.map(img => img.url)
        : ['/logo.png'],
      rating: Math.round(ratingResult[0].avgRating),
      reviewsCount: ratingResult[0].count,
    };
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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
        imageUrl: sql<string>`(SELECT url FROM product_images WHERE product_id = ${products.id} ORDER BY sort_order, id LIMIT 1)`,
        categoryName: categories.name,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(reviews, and(eq(reviews.productId, products.id), eq(reviews.status, 'approved')))
      .where(and(eq(products.categoryId, categoryId), ne(products.id, currentProductId)))
      .groupBy(products.id)
      .limit(limit);

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
        oldPrice: row.comparePrice && row.comparePrice > row.price ? row.comparePrice : undefined,
        image: row.imageUrl || '/logo.png',
        category: row.categoryName || 'Uncategorized',
        stock: row.stock,
        rating: Math.round(row.avgRating),
        reviews: row.reviewCount,
      });
      if (result.length >= limit) break;
    }
    return result;
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
  }
}

export async function getProductReviews(productId: string) {
  try {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        reviewerName: reviews.reviewerName,
        createdAt: reviews.createdAt,
        adminReply: reviews.adminReply,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')))
      .orderBy(desc(reviews.createdAt));
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
  }
}

// ==================== ADMIN QUERIES ====================

export async function getAllOrders() {
  try {
    return await db.query.orders.findMany({ orderBy: desc(orders.createdAt), with: { items: { with: { product: true } } } });
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
  }
}

export async function getRecentOrders(limit = 5) {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
  }
}

export async function getAllCategories() {
  try {
    return await db.select().from(categories).orderBy(categories.name);
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
  }
}

export async function getUsers() {
  try {
    return await db.select({ id: users.id, name: users.name, email: users.email, phone: users.phone, address: users.address, city: users.city, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt));
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
  }
}

export async function getPublicStoreSettings() {
  return publicSettings(await getStoreSettings());
}

export async function getStoreSetting(key: string, defaultValue = '') {
  try {
    const result = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
    return result.length > 0 ? result[0].value : defaultValue;
  } catch (e) {
    throw new Error('Store data could not be loaded. Please retry.', { cause: e });
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
  const result = await db.select({ sum: sql<number>`sum(${orders.total})` }).from(orders).where(and(eq(orders.paymentStatus, 'PAID'), ne(orders.status, 'CANCELLED'), ne(orders.status, 'RETURNED')));
  return result[0].sum || 0;
}

export async function getLowStockProducts(threshold = 5) {
  return await db.select().from(products).where(lt(products.stock, threshold)).limit(5);
}
