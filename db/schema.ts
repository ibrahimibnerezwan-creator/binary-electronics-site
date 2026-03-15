import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ==================== USERS ====================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // uuid
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  password: text('password').notNull(),
  address: text('address'),
  city: text('city'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ==================== PRODUCTS ====================
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  price: real('price').notNull(),
  comparePrice: real('compare_price'),
  stock: integer('stock').notNull().default(0),
  specs: text('specs'), // JSON string
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  categoryId: text('category_id').references(() => categories.id),
  brandId: text('brand_id').references(() => brands.id),
  warranty: text('warranty'), // e.g. "1 year"
  sku: text('sku'),
  weight: text('weight'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== PRODUCT IMAGES ====================
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').default(0),
});

// ==================== CATEGORIES ====================
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  icon: text('icon'),
  description: text('description'),
  parentId: text('parent_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== BRANDS ====================
export const brands = sqliteTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
});

// ==================== ORDERS ====================
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  status: text('status').notNull().default('PENDING'),
  total: real('total').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  address: text('address').notNull(),
  shippingCity: text('shipping_city').notNull(),
  paymentMethod: text('payment_method').notNull(), // bkash, nagad, cod
  transactionId: text('transaction_id'),
  paymentStatus: text('payment_status').notNull().default('PENDING'),
  courierTrackingId: text('courier_tracking_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== ORDER ITEMS ====================
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

// ==================== REVIEWS ====================
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  reviewerName: text('reviewer_name').notNull().default('Anonymous'),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  status: text('status').default('pending'),
  adminReply: text('admin_reply'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ==================== STORE SETTINGS ====================
export const storeSettings = sqliteTable('store_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ==================== COUPONS ====================
export const coupons = sqliteTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountPercent: integer('discount_percent').notNull(),
  maxUses: integer('max_uses').default(100),
  usedCount: integer('used_count').default(0),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ==================== WISHLISTS ====================
export const wishlists = sqliteTable('wishlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').notNull().references(() => products.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ==================== RELATIONS ====================
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  wishlist: many(wishlists),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  images: many(productImages),
  reviews: many(reviews),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
