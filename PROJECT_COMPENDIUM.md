# Binary Electronics: The Complete Project Compendium

Welcome to the **Binary Electronics** Project Bible. This document provides an exhaustive technical and design overview of the platform, serving as the single source of truth for developers, stakeholders, and maintainers.

---

## 1. Project Vision & Mission
**Binary Electronics** is a premium, high-performance e-commerce platform specializing in high-end gadgets, computer parts, and technical accessories. The platform is designed to bridge the gap between human interaction and the digital age through a sophisticated "Cyber-Digital" interface.

- **Primary Goal**: Provide a seamless, secure, and visually stunning shopping experience for tech enthusiasts.
- **Secondary Goal**: Offer an autonomous administrative ecosystem where business logic (pricing, logistics, content) can be managed with zero code changes.

---

## 2. Design Language: "Cyber-Flux"
The platform utilizes a custom-engineered design language called **Cyber-Flux**. It is characterized by:

- **Typography**: Primary use of `JetBrains Mono` for that technical "terminal" feel, complemented by `Sora` for readable displays.
- **Visual Elements**:
    - **Tech Grids**: Background layers that simulate architectural circuits.
    - **Scanning Lines**: CSS-animated `animate-scan` lines that provide a sense of real-time "telemetry."
    - **Glassmorphism**: High-blur backdrops (`backdrop-blur-xl`) with subtle border glows.
    - **Color Palette**: Void Black (`#000000`), Primary Cyan (`#0ea5e9`), and Accent Magenta (`#d946ef`) with high-contrast safe zones.

---

## 3. Technical Stack
The project is built on the modern "Bleeding Edge" web stack to ensure speed, SEO, and developer productivity.

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router, ISR, Server Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [LibSQL / SQLite](https://github.com/tursodatabase/libsql) (Edge Compatible) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | Custom **JWT Strategy** with Secure Secure Encryption |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 4. Key Platform Features

### 🛒 Customer Experience
- **Dynamic Catalog**: Real-time filtering and high-speed search.
- **Category Intelligence**: Automated grouping with custom SEO metadata.
- **Secure Checkout**:
    - Supports **COD** (Cash on Delivery) and **Electronic Payment** methods.
    - Dynamic VAT calculation and multi-zone shipping (Dhaka vs Outside Dhaka).
- **Interactive Reviews**: Verified customer feedback system with admin moderation.
- **Newsletter**: High-retention subscriber uplink.

### 🛡️ Admin Dashboard
- **Modular Architecture**: Specialized sub-pages for Products, Categories, Orders, and Reviews.
- **Hero Manager**: Dynamic management of landing page visuals and calls-to-action.
- **Financial Control Tower**: Real-time management of shipping fees and tax rates.
- **Review Moderation**: Approve/Reject and reply to technical feedback.

---

## 5. The Dynamic Configuration System
A core pillar of the project is the `store_settings` table. This allows the site to be 100% configurable via the **Admin -> Settings** interface.

**Driven by Settings:**
- **Store Identity**: Name, Description, Logo.
- **Contact Nodes**: Primary Phone, Email, Physical Address.
- **Logistics**: Shipping fees (Inside/Outside Dhaka) and VAT percentages.
- **Social Infrastructure**: Links to Twitter, LinkedIn, TikTok, Facebook, etc.
- **SEO**: Meta descriptions and Keyword clusters.

---

## 6. Database Schema Overview
The database is structured to be lightweight yet highly relational.

- **`users`**: Profiles and encrypted credentials.
- **`products`**: Tech specs, pricing, and stock telemetry.
- **`categories` & `brands`**: Hierarchical organization.
- **`orders` & `order_items`**: Transactional history and fulfillment status.
- **`store_settings`**: Global configuration key-value store.
- **`reviews`**: Peer-to-peer verification and moderation.
- **`newsletter`**: Growth nodes.

---

## 7. Deployment & Environment
The project is optimized for [Vercel](https://vercel.com).

### Required Environment Variables
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Connection string to your LibSQL/Turso database. |
| `NEXT_PUBLIC_BASE_URL` | The production domain (e.g., `https://binary-electronics.com`). |
| `ADMIN_USER` | The primary administrator username. |
| `ADMIN_PASSWORD` | The primary administrator password (plain text or hash depending on sync). |
| `JWT_SECRET` | A secure string for transaction signing. |

### Build Command
```bash
npm run build
```

---

## 8. Development Timeline & Recent Audit
The platform recently underwent a **"Production Readiness Audit"** to ensure zero hardcoded values remain.

**Audit Results:**
1. ✅ **Financial Purge**: All hardcoded pricing and logistics fees removed from the frontend.
2. ✅ **Global Synchronization**: Implemented **Incremental Static Regeneration (ISR)** with 60-second revalidation for site-wide settings.
3. ✅ **Visual Standard**: All catalog pages upgraded to the "Cyber-Flux" aesthetic.
4. ✅ **Social Link Migration**: Social icons now pull directly from the database settings.

---

## 9. Maintainer's Protocol
- **Code Edits**: Always prioritize Server Components over Client Components for better performance.
- **Styling**: Use the standardized tokens in `globals.css` instead of ad-hoc Tailwind classes.
- **Security**: Never expose the `ADMIN_USER` or `ADMIN_PASSWORD` in client-side code.

---
**Status**: `STABLE` // **Build**: `VERIFIED` // **Design**: `CYBER-FLUX v4.0`
