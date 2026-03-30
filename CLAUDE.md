# Binary Electronics — Project Bible

> Auto-loaded by Claude Code / Gemini every session. One file to understand everything.
> Owner: Bipub (developer) | Client: Anwar (store owner, non-technical)
> Live site: https://binary-electronics-site.vercel.app/
> GitHub: https://github.com/ibrahimibnerezwan-creator/binary-electronics-site
> Vercel project: https://vercel.com/ibrahimibnerezwan-creators-projects/binary-electronics-site/me
> Vercel plan: Hobby (2 cron jobs allowed, 100 GB-hours/month serverless)

---

## Business Context

Binary Electronics is a Bangladeshi electronics retail shop. It sells gadgets, components, accessories, and tech products. Products are sourced and photographed by the store owner (Anwar). He is non-technical — the admin panel must stay dead simple. Orders are fulfilled via Steadfast Courier (nationwide Bangladesh delivery). Payment methods include Cash on Delivery (COD), bKash, Nagad, and Rocket.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + PostCSS |
| Database | Turso DB (LibSQL/SQLite edge, `aws-ap-south-1`) via Drizzle ORM |
| Image Storage | Cloudflare R2 (S3-compatible), public CDN |
| UI Components | Radix UI primitives + shadcn/ui pattern |
| Icons | Lucide React |
| Animation | Framer Motion |
| Auth | JWT (jose) via httpOnly cookies, 7d expiry |
| Hosting | Vercel (auto-deploy on push to main) |
| Courier | Steadfast Courier API (portal.steadfast.com.bd) |
| Analytics | TBD (GA4 + Meta Pixel planned) |

---

## Repository Structure

```
project_anwar901/                       ← git root = Next.js app root
├── CLAUDE.md                           ← THIS FILE (project bible)
├── app/
│   ├── page.tsx                        ← Customer homepage (SSR, revalidates every 60s)
│   ├── layout.tsx                      ← Root layout (fonts: Sora + DM Sans, dark theme)
│   ├── globals.css                     ← Tailwind 4 theme (warm luxury palette)
│   ├── providers.tsx                   ← Client providers (ThemeProvider + CartProvider)
│   ├── favicon.ico
│   ├── about/page.tsx                  ← About Us page
│   ├── contact/page.tsx                ← Contact page (WhatsApp + socials)
│   ├── login/page.tsx                  ← Customer login page
│   ├── register/page.tsx               ← Customer registration page
│   ├── products/page.tsx               ← All products listing
│   ├── product/[slug]/page.tsx         ← Individual product detail (gallery, specs, reviews)
│   ├── categories/page.tsx             ← All categories listing
│   ├── category/[slug]/page.tsx        ← Products filtered by category
│   ├── cart/page.tsx                   ← Cart page (client-side)
│   ├── checkout/
│   │   ├── page.tsx                    ← Checkout page (SSR + client component)
│   │   ├── checkout-client.tsx         ← Full checkout form (billing, shipping, payment)
│   │   └── actions.ts                  ← Server action: placeOrder (DB-first, then Steadfast)
│   ├── order-confirmation/[id]/page.tsx ← Post-checkout success page
│   ├── privacy-policy/page.tsx         ← Privacy policy page
│   ├── shipping-policy/page.tsx        ← Shipping & return policy page
│   ├── admin/
│   │   ├── layout.tsx                  ← Admin sidebar layout (7 nav items, collapsible)
│   │   ├── page.tsx                    ← Admin dashboard (stats, orders, stock alerts, reviews)
│   │   ├── actions.ts                  ← createCategory, deleteCategory, deleteProduct
│   │   ├── products/
│   │   │   ├── page.tsx                ← Product list page
│   │   │   ├── products-list.tsx       ← Product list client component
│   │   │   └── new/
│   │   │       ├── page.tsx            ← New product form wrapper
│   │   │       ├── product-form.tsx    ← Full product creation form with image upload
│   │   │       └── actions.ts          ← createProduct server action
│   │   ├── orders/
│   │   │   ├── page.tsx                ← Orders table with status/payment badges
│   │   │   ├── actions.ts             ← updateOrderStatus, sendToSteadfast
│   │   │   └── steadfast-button.tsx    ← Steadfast courier dispatch button
│   │   ├── categories/
│   │   │   ├── page.tsx                ← Categories management page
│   │   │   └── new/page.tsx            ← New category form
│   │   ├── customers/page.tsx          ← Registered users list
│   │   ├── reviews/
│   │   │   ├── page.tsx                ← All reviews with moderation
│   │   │   ├── actions.ts             ← updateReviewStatus, deleteReview
│   │   │   └── review-actions.tsx      ← Review action buttons (client)
│   │   └── settings/
│   │       ├── page.tsx                ← Store settings (key-value pairs)
│   │       └── actions.ts             ← saveSettings server action
│   └── api/
│       └── upload/route.ts             ← POST → upload files to R2 (server-side)
├── components/
│   ├── home/
│   │   ├── category-grid.tsx           ← Category cards grid on homepage
│   │   ├── featured-products.tsx       ← New arrivals product grid
│   │   └── newsletter-form.tsx         ← Email subscription form (UI only)
│   ├── layout/
│   │   ├── header.tsx                  ← Global nav header (logo, search, cart, user)
│   │   ├── hero.tsx                    ← Full-screen hero section with CTA
│   │   ├── footer.tsx                  ← Site footer (links, socials, copyright)
│   │   └── whatsapp-cta.tsx            ← Floating WhatsApp button
│   ├── product/
│   │   ├── product-gallery.tsx         ← Product image gallery with thumbnails
│   │   └── add-to-cart-button.tsx      ← Add to cart button with quantity
│   └── ui/
│       ├── badge.tsx                   ← shadcn Badge component
│       ├── button.tsx                  ← shadcn Button (variant system)
│       ├── card.tsx                    ← shadcn Card container
│       ├── input.tsx                   ← shadcn Input field
│       └── label.tsx                   ← shadcn Label
├── db/
│   ├── schema.ts                       ← Drizzle table definitions (10 tables)
│   └── index.ts                        ← Turso client singleton
├── lib/
│   ├── auth.ts                         ← JWT sign/verify/login/logout/getSession
│   ├── cart-context.tsx                ← CartProvider + useCart hook (localStorage)
│   ├── data.ts                         ← All data-fetching functions (20+ queries)
│   ├── r2.ts                           ← Cloudflare R2 upload/delete helpers
│   └── utils.ts                        ← cn() + formatPrice() helpers
├── hooks/                              ← (empty, reserved for custom hooks)
├── public/
│   └── logo.png                        ← Binary Electronics logo
├── drizzle.config.ts                   ← Drizzle Kit config for Turso
├── next.config.ts                      ← Image domains, transpilePackages
├── package.json
├── tsconfig.json
├── .env                                ← All secrets (NEVER commit)
└── .env.example                        ← Template for env vars
```

---

## Database Schema (Turso / SQLite)

```sql
users            id(pk), name, email(unique), phone, password(bcrypt), address, city, createdAt

products         id(pk), name, slug(unique), description, price(real), comparePrice(real, nullable),
                 stock(int), specs(JSON text), isFeatured(bool), categoryId(fk), brandId(fk),
                 warranty, sku, weight, createdAt, updatedAt

product_images   id(pk), url, productId(fk→products CASCADE DELETE), sortOrder(int)

categories       id(pk), name, slug(unique), image, icon, description, parentId, createdAt, updatedAt

brands           id(pk), name, slug(unique), logo

orders           id(pk), userId(fk→users), status('PENDING'|'PROCESSING'|'SHIPPED'|'DELIVERED'|'RETURNED'),
                 total(real), customerName, customerPhone, address, shippingCity,
                 paymentMethod('cod'|'bkash'|'nagad'|'rocket'), transactionId,
                 paymentStatus('PENDING'|'VERIFYING'|'PAID'), courierTrackingId,
                 createdAt, updatedAt

order_items      id(pk), orderId(fk→orders), productId(fk→products), quantity(int), price(real)

reviews          id(pk), rating(1-5), comment, reviewerName, productId(fk→products CASCADE DELETE),
                 status('pending'|'approved'|'rejected'), adminReply, createdAt

store_settings   key(pk), value, updatedAt

coupons          id(pk), code(unique), discountPercent(int), maxUses(int), usedCount(int),
                 expiresAt(timestamp), createdAt

wishlists        id(pk), userId(fk→users), productId(fk→products), createdAt
```

**Notable**:
- Products have both `price` and `comparePrice` (for strike-through pricing / flash sales)
- `specs` is a JSON string stored in SQLite text field
- Orders use `paymentStatus` separate from order `status` (order status = fulfillment, payment status = money)
- `store_settings` is a key-value store for dynamic config (Steadfast keys, store info, etc.)
- `coupons` and `wishlists` tables exist in schema but **UI is not yet implemented**

---

## Environment Variables

Stored in `.env` (never commit) and must be mirrored in Vercel project settings.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_NAME` | Display name: "Binary Electronics" |
| `TURSO_DATABASE_URL` | Turso DB connection string (Mumbai region) |
| `TURSO_AUTH_TOKEN` | Turso JWT auth token |
| `JWT_SECRET` | JWT signing secret for auth cookies |
| `CF_ACCOUNT_ID` | Cloudflare account ID |
| `CF_ACCESS_KEY_ID` | R2 S3 access key |
| `CF_SECRET_ACCESS_KEY` | R2 S3 secret key |
| `CF_BUCKET_NAME` | `binary-electronics-anwar` |
| `CF_ENDPOINT` | R2 endpoint URL |
| `CF_PUBLIC_DOMAIN` | R2 public CDN URL for serving images |
| `ADMIN_USER` | Admin panel username (`admin`) |
| `ADMIN_PASSWORD` | Admin panel password |

**⚠️ Not yet implemented as env vars** (currently stored in `store_settings` DB table):
- `STEADFAST_API_KEY` — Steadfast Courier API key
- `STEADFAST_SECRET_KEY` — Steadfast Courier secret

**⚠️ Not yet added** (planned):
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4
- `NEXT_PUBLIC_FB_PIXEL_ID` — Meta Pixel
- `CRON_SECRET` — Protects cron endpoints (if added)

---

## Customer-Facing Flow

```
Homepage (SSR, 60s revalidate)
  → Hero (full-screen with CTA buttons: Shop Now / Learn More)
  → CategoryGrid (category cards with product count)
  → Trust Stats ("10,000+ customers", "24H support", "100% genuine", "FAST delivery")
  → FeaturedProducts (new arrivals grid, max 8)
  → Newsletter Section (email form, UI-only currently)
  → Footer → WhatsApp floating CTA

Products Page (/products)
  → All products grid with links to detail pages

Category Page (/category/[slug])
  → Products filtered by category

Product Detail (/product/[slug])
  → Image gallery (thumbnails + main image)
  → Product info: name, price, compare price, stock, description, specs, warranty
  → Add to Cart button (quantity selector)
  → Related products from same category

Cart (/cart)
  → Client-side cart (localStorage via CartContext)
  → Quantity update, remove items, total calculation

Checkout (/checkout)
  → Customer info: name, phone, address, city
  → Payment: COD / bKash / Nagad / Rocket
  → Prepaid methods show Transaction ID field
  → placeOrder server action:
      → STEP 1: Validates stock, decrements inventory in DB transaction
      → STEP 2: Creates order + order_items in DB
      → Order is NEVER lost (DB-first approach)

Order Confirmation (/order-confirmation/[id])
  → Success page with order details
```

---

## Admin Panel Flow

URL: `/admin` | **⚠️ CURRENTLY NO AUTH GUARD — ANYONE CAN ACCESS**

**Sidebar navigation (7 sections):**
Dashboard → Products → Orders → Categories → Customers → Reviews → Settings

### Dashboard (`/admin`)
- Stats cards: Total Revenue, Active Orders, Total Customers, Total Products
- Recent Sales list (last 5 orders)
- Stock Alerts (products with <5 stock)
- Pending Reviews notification

### Products (`/admin/products`)
- Product table with name, price, stock, category
- Delete button per product
- "Add New Product" → `/admin/products/new`
  - Form: name, slug (auto-generated), description, price, compare price, stock, SKU, weight, warranty, specs (JSON), category, brand
  - Image upload via drag-drop (react-dropzone) → POST `/api/upload` → R2
  - Featured toggle

### Orders (`/admin/orders`)
- Order table: ID, customer, total, payment method, payment status, order status, date
- Status dropdown to update each order
- "Send to Steadfast" button per order (reads API keys from `store_settings`)
  - Creates Steadfast shipment → saves tracking ID to order
- Status badges: color-coded by fulfillment stage

### Categories (`/admin/categories`)
- Category list with product count
- Create new category with name + image upload
- Delete category

### Customers (`/admin/customers`)
- Registered user table: name, email, phone, join date

### Reviews (`/admin/reviews`)
- All reviews with status badges (pending/approved/rejected)
- Approve / Reject buttons
- Delete button
- Admin reply field

### Settings (`/admin/settings`)
- Key-value settings editor
- Stores Steadfast API keys, store info, etc.
- Save all settings button

---

## Design System

**Palette** — "Warm Luxury" dark theme:
```
Primary:  hsl(20, 90%, 50%)  — warm orange
Accent:   hsl(35, 80%, 50%)  — golden amber
Bg Void:  hsl(20, 15%, 6%)   — near-black with warm undertone
Bg Base:  hsl(20, 12%, 9%)
Bg Elevated: hsl(20, 10%, 12%)
Text Primary: hsl(35, 20%, 95%) — warm white
Text Muted: hsl(20, 8%, 45%)
Borders:  hsl(20, 10%, 18%)
```

**Fonts**: Sora (display/headings) + DM Sans (body)

**Effects**:
- `.glass` / `.glass-card` — frosted glass backgrounds
- `.text-gradient` — orange→gold gradient text
- Animations: shimmer, reveal-up, float, pulse-ring
- Custom scrollbar (orange thumb)

---

## Image Upload Architecture

```
Admin selects files (product photos)
  ↓
react-dropzone → File[] in browser
  ↓
POST /api/upload (server-side)
  ↓
uploadToR2() — PutObjectCommand to Cloudflare R2
  ↓
Returns public URL: CF_PUBLIC_DOMAIN/products/{uuid}.{ext}
  ↓
URL saved to product_images table

⚠️ No client-side compression currently — raw files (could be 4-8 MB each)
⚠️ No presigned URL pattern — server handles binary (potential memory/cost issue)
```

---

## Cart System

Client-side only, using React Context + localStorage:
- `CartProvider` wraps the app via `providers.tsx`
- Cart persisted in `localStorage` key: `binary_cart`
- `useCart()` hook provides: `cart`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `cartTotal`, `cartCount`
- Cart badge count shown in header

---

## Steadfast Courier Integration

- API keys stored in `store_settings` table (keys: `steadfast_api_key`, `steadfast_secret_key`)
- Admin clicks "Send to Steadfast" button on order row
- Calls `sendToSteadfast(orderId)` server action:
  1. Fetches order from DB
  2. Reads API keys from store_settings
  3. POST to `https://portal.steadfast.com.bd/api/v1/create_order`
  4. On success: updates order status to 'SHIPPED', saves `courierTrackingId`

---

## Git & Deployment

- **Branch `main`** → auto-deploys to Vercel production
- Remote: `https://github.com/ibrahimibnerezwan-creator/binary-electronics-site.git`
- Run git/npm commands from: `/home/bipu/Music/project_anwar901/`

```bash
# Development
npm run dev

# Push to production
git add <files> && git commit -m "feat: ..." && git push origin main

# Drizzle DB push (apply schema changes)
npx drizzle-kit push

# Drizzle DB studio (browse DB)
npx drizzle-kit studio
```

---

## Key Decisions & Why

| Decision | Reason |
|----------|--------|
| Next.js 16 App Router | Latest, best DX, built-in SSR/ISR |
| Turso (ap-south-1) | Closest edge DB to Bangladesh (Mumbai) |
| Drizzle ORM | Type-safe, lightweight, SQLite-native |
| Cloudflare R2 | S3-compatible, zero egress cost for images |
| Radix UI + shadcn pattern | Accessible primitives, consistent styling |
| `revalidate = 60` | Products stay fresh without hammering DB |
| Cart in localStorage | No server-side cart needed for simplicity |
| Separate `paymentStatus` from `status` | Payment verification is different from order fulfillment |
| `store_settings` table | Admin can update Steadfast keys, store info without code deploy |
| DB-first checkout | Order saved to DB before courier — order is NEVER lost |

---

## Security Status

| Protection | Implementation | Status |
|-----------|---------------|--------|
| **Admin Auth** | None — `/admin` is publicly accessible | ❌ CRITICAL |
| **JWT_SECRET** | Has a fallback key in code — should crash if missing | ⚠️ Needs Fix |
| **Phone validation** | Not validated on server (only client may have basic checks) | ⚠️ Needs Fix |
| **Honeypot anti-bot** | Not implemented on checkout or review forms | ⚠️ Needs Fix |
| **PII in logs** | Checkout action logs full error objects | ⚠️ Needs Fix |
| **CSRF** | Standard Next.js CORS + SameSite cookies | ⚠️ Acceptable |
| **Rate limiting** | Not implemented | ⚠️ Future |
| **Prepaid trxId verification** | Not verified server-side | ⚠️ Future |
| **Image upload auth** | `/api/upload` has NO auth check | ⚠️ Needs Fix |

---

## Known Gaps (Prioritized for Handover)

| # | Priority | Gap | Effort |
|---|----------|-----|--------|
| 1 | 🔴 CRITICAL | Admin panel has basic password auth, but needs session management overhaul | Medium |
| 2 | 🟡 HIGH | No image compression — raw uploads could be huge | 1 hour |
| 3 | 🟡 HIGH | No CSP or security headers | 30 min |
| 4 | 🟢 MEDIUM | Placeholder images (via.placeholder.com) used as fallback | 15 min |
| 5 | 🟢 MEDIUM | Coupons table exists but no UI | Large |
| 6 | 🟢 MEDIUM | Wishlists table exists but no UI | Large |
| 7 | 🟢 MEDIUM | No analytics tracking (GA4/Pixel IDs pending) | 30 min |

---

## Common Commands

```bash
# Development
npm run dev

# Build & check for errors
npm run build

# Push to production
git add . && git commit -m "feat: ..." && git push origin main

# Drizzle: push schema to DB
npx drizzle-kit push

# Drizzle: open DB studio
npx drizzle-kit studio

# Drizzle: generate migration
npx drizzle-kit generate
```
