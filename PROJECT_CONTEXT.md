# HRP Industrial Products — Complete Project Context Document

> **Purpose**: Comprehensive technical handoff documentation for developers and LLM agents. This document enables anyone reading only this file to understand the entire codebase, architecture, recent changes, and implementation details without needing to explore source files independently.

> **Last Updated**: May 25, 2026
> **Project Version**: 0.1.0

---

## Table of Contents

1. [Project Identity](#1-project-identity)
2. [Technology Stack](#2-technology-stack)
3. [Environment Variables](#3-environment-variables)
4. [Project File Structure](#4-project-file-structure)
5. [Routing Architecture](#5-routing-architecture)
6. [Database Schema (Supabase)](#6-database-schema-supabase)
7. [Storage Buckets](#7-storage-buckets)
8. [API Routes](#8-api-routes)
9. [Design System](#9-design-system)
10. [Component Documentation](#10-component-documentation)
11. [Page Documentation](#11-page-documentation)
12. [Admin Panel](#12-admin-panel)
13. [Utility Functions](#13-utility-functions)
14. [Recent Updates & Changes](#14-recent-updates--changes)
15. [Known Issues & Fixes Applied](#15-known-issues--fixes-applied)
16. [Build & Development](#16-build--development)

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | HRP Industrial Products Website |
| **Root Directory** | `C:\projects\hrp-website` |
| **Package Name** | `hrp-website` |
| **Version** | `0.1.0` |
| **Framework** | Next.js 16.2.6 (App Router) |
| **Primary Language** | JavaScript (JSX) |
| **Type System** | TypeScript types available; source code is plain JS |
| **Description** | B2B industrial product catalogue + inquiry management platform for HRP (Hydraulics & Rubber Products), a Hyderabad-based distributor supplying SS Bellows, Hydraulic/Pneumatic Hoses, Pressure Gauges, Valves, and Fittings across India. |
| **Key Markets** | Pan-India industrial distribution; focus on authorized brands. |

---

## 2. Technology Stack

### Core Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | `16.2.6` | Full-stack React framework with App Router |
| `react` | `19.2.4` | UI library and React DOM |
| `react-dom` | `19.2.4` | DOM rendering |
| `@supabase/supabase-js` | `^2.105.4` | Backend (PostgreSQL DB, Auth, Storage) |
| `@anthropic-ai/sdk` | *(added)* | Claude API for vision-based spec extraction |
| `framer-motion` | `^12.38.0` | Animations and micro-interactions |
| `lucide-react` | `^1.14.0` | Icon library (Phone, Mail, MapPin, Clock, etc.) |

### Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^4` | Utility CSS framework (Tailwind v4 with `@theme` syntax) |
| `@tailwindcss/postcss` | `^4` | PostCSS integration |
| `eslint` | `^9` | Linter |
| `eslint-config-next` | `16.2.6` | Next.js ESLint configuration |
| `typescript` | `^5` | Type definitions and checking |
| `@types/node`, `@types/react`, `@types/react-dom` | Latest | Type definitions |
| `cross-env` | `^10.1.0` | Cross-platform environment variable setting |

### NPM Scripts

```bash
npm run dev      # Local development server with increased heap size (4GB)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

**Note**: The `dev` script uses `cross-env NODE_OPTIONS=--max-old-space-size=4096` to increase Node heap size for better memory management during development.

---

## 3. Environment Variables

All required in `.env.local` at project root. **Application will fail to start if critical variables are missing.**

| Variable | Required | Purpose | Default/Fallback |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL (format: `https://xxx.supabase.co`) | None — throws error if missing |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous (public) API key | None — throws error if missing |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ⚠️ Optional | WhatsApp number without `+` prefix (e.g. `919000000000`) | `"919999999999"` |
| `ANTHROPIC_API_KEY` | ⚠️ Optional | Anthropic Claude API key for spec extraction endpoint | None — endpoint returns 500 if missing |

### Environment Variable Usage

- `app/lib/supabase.js` — Validates `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` at module load; throws error if falsy.
- `app/lib/utils.js` → `getImageUrl()` — Uses `NEXT_PUBLIC_SUPABASE_URL` to construct storage URLs.
- `app/lib/utils.js` → `getWhatsAppUrl()` — Uses `NEXT_PUBLIC_WHATSAPP_NUMBER` with fallback.
- `app/contact/page.jsx` — Reads `NEXT_PUBLIC_WHATSAPP_NUMBER` for contact section.
- `app/api/extract-specs/route.js` — Requires `ANTHROPIC_API_KEY` to call Claude vision API.

---

## 4. Project File Structure

```
hrp-website/
├── .env.local                                # Environment secrets (gitignored)
├── .gitignore
├── AGENTS.md                                 # Agent instructions
├── CLAUDE.md                                 # Claude-specific instructions
├── README.md
├── PROJECT_CONTEXT.md                        # This file
├── eslint.config.mjs
├── jsconfig.json                             # Path aliases: "@/*" → "./*"
├── next.config.ts                            # Minimal Next.js config
├── package.json
├── package-lock.json
├── postcss.config.mjs                        # PostCSS + Tailwind v4
│
├── public/
│   └── images/
│       ├── hrp_logo.png                      # Official logo (120×120)
│       ├── hero.png                          # Hero section background
│       ├── brands/                           # 23+ brand logos (mix of .jpg/.svg/.png)
│       │   └── [parker.jpg, bosch.svg, janatics.jpg, schmalz.jpg, ...]
│       └── categories/                       # 11 category images (.png)
│           └── [bellows.png, hydraulics.png, pneumatics.png, ...]
│
└── app/
    ├── globals.css                           # Tailwind v4 @theme, design tokens, keyframes
    ├── layout.jsx                            # Root layout: IntroWrapper + PublicShell
    ├── page.jsx                              # Homepage (Server Component)
    ├── favicon.ico
    │
    ├── lib/
    │   ├── supabase.js                       # Singleton Supabase client
    │   └── utils.js                          # Helpers: getImageUrl(), getWhatsAppUrl(), truncate()
    │
    ├── components/
    │   ├── IntroWrapper.jsx                  # Dynamic import wrapper (SSR: false)
    │   ├── PageIntro.jsx                     # CRT scan animation (client)
    │   ├── about/
    │   │   ├── CompanyJourney.jsx            # Timeline with scroll-reveal
    │   │   └── AboutSections.jsx             # Why Choose HRP + Brands section (NEW)
    │   ├── home/
    │   │   ├── HeroSection.jsx
    │   │   ├── MarqueeStrip.jsx              # Scrolling text
    │   │   ├── StatsStrip.jsx
    │   │   ├── CategoryGrid.jsx
    │   │   ├── WhyChooseHRP.jsx
    │   │   ├── BrandsMarquee.jsx
    │   │   ├── FeaturedProducts.jsx
    │   │   └── CTABanner.jsx
    │   └── layout/
    │       ├── Navbar.jsx                    # Header with mobile menu
    │       ├── Footer.jsx                    # 4-column footer
    │       ├── PublicShell.jsx               # Conditional Navbar/Footer/FAB wrapper
    │       └── WhatsAppFAB.jsx               # Floating action button
    │
    ├── about/
    │   └── page.jsx                          # About page (Server)
    │
    ├── contact/
    │   ├── layout.jsx                        # Contact section layout (NEW)
    │   └── page.jsx                          # Inquiry form (Client)
    │
    ├── products/
    │   ├── layout.jsx                        # Products section layout (NEW)
    │   ├── page.jsx                          # Category grid (Client)
    │   ├── [category]/
    │   │   ├── layout.jsx                    # Category layout (NEW)
    │   │   ├── page.jsx                      # Subcategory listing
    │   │   └── [subcategory]/
    │   │       ├── layout.jsx                # Subcategory layout (NEW)
    │   │       └── page.jsx                  # Product grid
    │   └── item/
    │       ├── [id]/
    │       │   ├── layout.jsx                # Product detail layout (NEW)
    │       │   └── page.jsx                  # Product detail page
    │
    ├── api/
    │   └── extract-specs/
    │       └── route.js                      # Vision API for spec extraction (NEW)
    │
    └── admin/
        ├── page.jsx                          # Redirect to /admin/dashboard
        ├── layout.jsx                        # Auth guard + sidebar shell
        ├── login/
        │   └── page.jsx                      # Email/password login
        └── dashboard/
            ├── page.jsx                      # Overview: stats + activity feed
            ├── categories/
            │   └── page.jsx                  # Category CRUD
            ├── product/
            │   └── page.jsx                  # Product CRUD (note: singular)
            └── inquiries/
                └── page.jsx                  # Inquiry CRUD (NEWLY IMPLEMENTED)
```

---

## 5. Routing Architecture

### Public Routes

| URL | File | Type | Description |
|---|---|---|---|
| `/` | `app/page.jsx` | Server | Homepage with hero, stats, categories, brands, featured products |
| `/about` | `app/about/page.jsx` | Server | About page with company timeline (CompanyJourney) |
| `/contact` | `app/contact/page.jsx` | Client | Inquiry form submission |
| `/products` | `app/products/page.jsx` | Client | Category grid with search |
| `/products/[category]` | `app/products/[category]/page.jsx` | Client | Subcategory listing for selected category |
| `/products/[category]/[subcategory]` | `app/products/[category]/[subcategory]/page.jsx` | Client | Product grid filtered by subcategory |
| `/products/item/[id]` | `app/products/item/[id]/page.jsx` | Client | Product detail page with specs, gallery, related products |

### Admin Routes (Protected by Auth Guard)

| URL | File | Description |
|---|---|---|
| `/admin` | `app/admin/page.jsx` | Redirect → `/admin/dashboard` |
| `/admin/login` | `app/admin/login/page.jsx` | Login form (bypasses auth guard) |
| `/admin/dashboard` | `app/admin/dashboard/page.jsx` | Overview with stat cards + activity feed |
| `/admin/dashboard/categories` | `app/admin/dashboard/categories/page.jsx` | Full CRUD for categories |
| `/admin/dashboard/product` | `app/admin/dashboard/product/page.jsx` | Full CRUD for products + subcategories |
| `/admin/dashboard/inquiries` | `app/admin/dashboard/inquiries/page.jsx` | Inquiry management (NEWLY CREATED) |

---

## 6. Database Schema (Supabase)

All tables are in PostgreSQL on Supabase. Connection via `app/lib/supabase.js`.

### Table: `categories`

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint` | Primary key, auto-increment |
| `name` | `text` | Display name (e.g. "Pneumatics") |
| `slug` | `text` | URL-safe unique identifier (e.g. "pneumatics") |
| `description` | `text` | Short description for category cards |
| `icon` | `text` | Emoji fallback when no image (e.g. "🔧") |
| `image_url` | `text` | Full public URL from `category-images` storage bucket |
| `sort_order` | `int` | Lower = appears first in UI |
| `created_at` | `timestamptz` | Auto-set by Supabase (default: now()) |

**Key Queries**:
- `SELECT * ORDER BY sort_order ASC` — all categories (products page, admin categories page)
- `SELECT id, name, slug ORDER BY sort_order` — for dropdowns in product CRUD
- `SELECT name, slug, created_at ORDER BY created_at DESC LIMIT 4` — dashboard activity feed

---

### Table: `subcategories`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` or `int` | Primary key |
| `name` | `text` | Display name (e.g. "Cylinders", "Hoses") |
| `category_slug` | `text` | Foreign reference to `categories.slug` |
| `created_at` | `timestamptz` | Auto-set |

**Key Queries**:
- `SELECT id, name, category_slug ORDER BY name` — filter chips and dropdowns in product CRUD
- `INSERT { name, category_slug }`, `UPDATE`, `DELETE` — subcategory management within product page

---

### Table: `products`

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint` | Primary key |
| `name` | `text` | Full product name |
| `slug` | `text` | URL-safe unique identifier, used in `/products/item/[id]` route |
| `description` | `text` | Product description paragraph |
| `category_slug` | `text` | References `categories.slug` |
| `subcategory_id` | `uuid/int` | References `subcategories.id` (nullable) |
| `subcategory_name` | `text` | Denormalized copy of subcategory name (nullable) |
| `brand` | `text` | Manufacturer brand name (nullable) |
| `model_number` | `text` | Part/model number (nullable) |
| `image_url` | `text` | Full URL (from `product-images` bucket or external) |
| `gallery_urls` | `jsonb` | JSON array of image URLs (nullable) |
| `specs` | `jsonb` | JSON object of `{ key: value }` specification pairs (nullable) |
| `is_featured` | `boolean` | If true, appears on homepage featured section |
| `sort_order` | `numeric` | Lower = appears first within category |
| `created_at` | `timestamptz` | Auto-set |

**Key Queries**:
- **List (admin)**: `SELECT id, name, slug, category_slug, subcategory_id, subcategory_name, brand, is_featured, image_url, created_at, sort_order ORDER BY sort_order, created_at DESC`
- **Detail**: `SELECT * WHERE id = ? SINGLE`
- **Featured**: `SELECT id, slug, name, description, category_slug, image_url WHERE is_featured = true ORDER BY created_at DESC LIMIT 4`
- **By category**: `SELECT * WHERE category_slug = ? ORDER BY sort_order`

---

### Table: `inquiries`

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint` | Primary key |
| `name` | `text` | Submitter's full name (required) |
| `company` | `text` | Company name (nullable) |
| `phone` | `text` | Phone number (required) |
| `email` | `text` | Email address (nullable) |
| `category` | `text` | Selected product category slug (nullable) |
| `message` | `text` | Inquiry message (required) |
| `status` | `text` | Values: `'new'`, `'read'`, `'resolved'` (default: `'new'`) |
| `created_at` | `timestamptz` | Auto-set |

**Key Queries**:
- `INSERT { name, company, phone, email, category, message }` — contact form submission
- `SELECT id COUNT WHERE status = 'new'` — badge count on admin pages
- `SELECT * ORDER BY created_at DESC` — full inquiry list for admin
- `UPDATE ... SET status = ? WHERE id = ?` — status updates (new → read → resolved)
- `DELETE WHERE id = ?` — delete inquiry

---

## 7. Storage Buckets

| Bucket | Purpose | Path Pattern | Access |
|---|---|---|---|
| `product-images` | Product main + gallery images | `{timestamp}-{random}.{ext}` | Public (via signed URLs or public bucket) |
| `category-images` | Category card images | `categories/{timestamp}.{ext}` | Public |

### URL Construction

```js
// Product images (app/lib/utils.js):
const imageUrl = `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`

// Category images (via supabase.storage):
const { data } = supabase.storage
  .from("category-images")
  .getPublicUrl(path)
// Returns: { publicUrl: "https://xxx.supabase.co/storage/..." }
```

---

## 8. API Routes

### `POST /api/extract-specs` (NEW)

**Purpose**: Accept an image of a product specification sheet/datasheet and use Claude vision API to extract key-value specification pairs.

**Endpoint**: `app/api/extract-specs/route.js`

**Request Body**:
```json
{
  "imageBase64": "base64-encoded image data",
  "mediaType": "image/jpeg" // or "image/png", etc.
}
```

**Response** (success):
```json
{
  "specs": [
    { "key": "Bore Size", "value": "32 mm" },
    { "key": "Operating Pressure", "value": "0–10 bar" },
    { "key": "Weight", "value": "1.2 kg" }
  ]
}
```

**Response** (error):
```json
{
  "error": "ANTHROPIC_API_KEY is not configured. Add it to .env.local."
}
```

**Claude Model Used**: `claude-haiku-4-5-20251001`

**Implementation Details**:
- Receives base64-encoded image
- Sends to Anthropic Claude with vision capabilities
- Prompts Claude to extract ALL specification pairs from the image
- Returns JSON array of `{ key, value }` pairs
- Handles markdown code fence wrapping from Claude response
- Sanitizes output: ensures string keys/values, trims whitespace
- Returns empty array `[]` if no specs found or extraction fails

**Integration Points**:
- Used in product admin CRUD (`app/admin/dashboard/product/page.jsx`) for quick spec extraction from datasheets
- Reduces manual data entry when adding new products

---

## 9. Design System

### Tailwind v4 Theme Tokens (`app/globals.css`)

```css
@theme {
  --color-brand-primary:   #2B7EA1    /* Teal/Blue */
  --color-brand-secondary: #3A4555    /* Slate Grey */
  --color-brand-accent:    #8DC63F    /* Lime Green */
  --color-brand-dark:      #1A2533    /* Near-black */
  --color-brand-light:     #F4F6F8    /* Off-white */

  --font-heading: "Syne", sans-serif     /* Weights: 400–800 */
  --font-body:    "Inter", sans-serif    /* Weights: 300–700 */

  --animate-pulse-ring: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
  --animate-fade-in:    fadeIn 0.6s ease forwards
  --animate-slide-up:   slideUp 0.6s ease forwards
}
```

### Keyframe Animations

| Name | Effect | Duration |
|---|---|---|
| `pulseRing` | WhatsApp FAB glow: box-shadow pulses from `rgba(37,211,102,0.5)` to 0 | 2s |
| `fadeIn` | Opacity fade: 0 → 1 | 0.6s |
| `slideUp` | Transform: `translateY(24px), opacity: 0` → `translateY(0), opacity: 1` | 0.6s |

### Custom Component Classes

| Class | Purpose | Styling |
|---|---|---|
| `.navbar-glass` | Glassmorphism nav | `rgba(26,37,51,0.85)` bg + `blur(12px)` + subtle border |
| `.container-hrp` | Max-width layout wrapper | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| `.btn-accent` | Primary green CTA button | Brand accent green, bold text, hover brightness increase |
| `.btn-outline` | Secondary outline button | White border/text, hover background |
| `.glass-card` | Card with glass effect | `rgba(255,255,255,0.04)` bg + blur + white border |
| `.section-label` | Uppercase section eyebrow | Brand accent, `tracking-[0.2em]` |
| `.section-heading` | Dark section heading | `font-heading text-3xl sm:text-4xl font-bold` |
| `.section-heading-light` | White section heading | Same as above, white text |

### Custom Utilities

| Class | Effect |
|---|---|
| `.text-gradient` | `background-clip: text` gradient: `#2B7EA1` → `#8DC63F` at 135° |

### Google Fonts Import

```css
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap");
```

---

## 10. Component Documentation

### `IntroWrapper.jsx`
- **Type**: Client Component (`'use client'`)
- **Purpose**: Thin wrapper that dynamically imports `PageIntro` with SSR disabled, ensuring the CRT scan animation only runs client-side.
- **Renders**: `<PageIntro />`

### `PageIntro.jsx` — CRT Scan Animation
- **Type**: Client Component
- **Imports**: `framer-motion`, `next/image`
- **Duration**: ~2.4 seconds total (1.1s settling + 1.4s scan + 0.16s unmount delay)

**Sequence**:
1. Dark overlay covers screen, logo fades in with spring animation
2. Three pulsing dots appear below logo
3. At 1100ms, scan line sweeps top → bottom over 1.4s
4. Dark overlay `clipPath` reveals page beneath as scan passes
5. Logo fades out during scan (scanY 40-62%)
6. Component unmounts after full animation

**Layer z-indices**:
- `200`: Dark overlay with CRT effects
- `201`: Logo (centered, pulsing dots)
- `202`: Scan line with gradient + glow

**Visual Details**:
- Scan line: 2px height, gradient from transparent → brand-primary → white → brand-primary → transparent
- Glow: `0 0 18px 6px rgba(43,126,161,0.6)`
- CRT texture: Horizontal scanlines + grid pattern + vignette
- Readout text: `"SCAN ■ HRP-SYS"` monospace, 9px

### `PublicShell.jsx` — Layout Guard
- **Type**: Client Component
- **Logic**: Checks `pathname` — if starts with `/admin`, renders layout-less page; otherwise wraps with Navbar, Footer, FAB
- **Conditional Rendering**:
  - Admin pages: `<main>{children}</main>` only
  - Public pages: `<Navbar /> <main>{children}</main> <Footer /> <WhatsAppFAB />`

### `Navbar.jsx`
- **Type**: Client Component
- **Features**:
  - Fixed header with glass effect on scroll (or when menu open)
  - Special behavior on `/about`: navbar stays transparent even when scrolled
  - Nav items: Home, About, Products, Contact
  - Active indicator: Framer Motion spring animation (`stiffness: 380, damping: 30`)
  - Mobile menu: Full-screen overlay, items slide in with staggered delays
  - Logo: `/images/hrp_logo.png` (48×48) + wordmark

### `Footer.jsx`
- **Type**: Server/Client Component
- **Layout**: 4-column grid on large screens
  - **Column 1**: Brand info + WhatsApp CTA button
  - **Column 2**: Quick Links (Home, About, Products, Contact)
  - **Column 3**: Product Categories list
  - **Column 4**: Contact Details (phone, email, address with lucide icons)
- **Hardcoded Contact**:
  - Phone: `+91 99999 99999`
  - Email: `info@hrpindustrial.in`
  - Address: Hyderabad, Telangana

### `WhatsAppFAB.jsx`
- **Type**: Client Component
- **Behavior**:
  - Hidden for first 1200ms, then springs in with Framer Motion
  - 56×56px round button, WhatsApp green (`#25D366`)
  - Pulsing ring animation via custom keyframe
  - Tooltip: "Chat with us on WhatsApp" on hover
  - Links to WhatsApp with pre-filled message via `getWhatsAppUrl()`
  - Position: `fixed bottom-8 right-5 z-50`

### `CompanyJourney.jsx` — About Timeline
- **Type**: Client Component
- **Styling**: BEM-like CSS class names injected as `<style>` block (not Tailwind)
- **Custom Font**: DM Sans (weights 200, 300, 400 italic)

**Timeline (MILESTONES array)**:
- 1982: The Origin (Est. 1983)
- 2012: Chapter II (3× Product Range)
- 2015: Chapter III (10+ Brand Partners)
- 2018: Chapter IV (10+ Cities Served)
- 2021: Chapter V (200+ Product SKUs)
- 2024: Chapter VI (200+ Active Clients)
- 2026: Present Day (15+ Years Strong)

**Features**:
- Scroll-driven spine fill (0-100% based on viewport scroll)
- Scroll-reveal animations for each milestone (IntersectionObserver with varying thresholds)
- Column layout alternates: even indices (text LEFT, image RIGHT), odd indices (text RIGHT, image LEFT)
- Closing CTA with 4 stat pills and 2 action buttons
- Brands row after Chapter III (currently hidden: `showBrands: false`)

**Closing Stats**: 44+ Years, 100K+ Active Clients, 10K+ Products, Pan India

### `AboutSections.jsx` (NEW)
- **Type**: Client Component
- **Purpose**: Why Choose HRP section + Brands we carry + CTA section
- **Features**:
  - 4-card "Why Choose HRP" grid with icons (Quality Assured, Pan India Delivery, Expert Support, Premium Brands)
  - 23+ brand logos in a horizontal scrolling carousel
  - Each card has hover glow effect + top accent line
  - Framer Motion staggered entry animations

### Home Components (`home/`)

#### `HeroSection.jsx`
- Full viewport dark hero section with background image
- Headline, subheading, CTA button
- Optional secondary CTA link

#### `MarqueeStrip.jsx`
- Infinite scrolling text marquee
- Dark background with repeating text

#### `StatsStrip.jsx`
- Key statistics row (e.g., "500+ Products", "50+ Brands")
- Formatted as stat cards with icons

#### `CategoryGrid.jsx`
- Dynamic grid of category cards
- Fetches from Supabase `categories` table
- Each card links to `/products/[slug]`
- Hover effects: scale + border animation

#### `WhyChooseHRP.jsx`
- Value proposition section
- 4 feature cards (might be consolidated with AboutSections)

#### `BrandsMarquee.jsx`
- Brand logos in animated carousel
- Infinite scroll, framer-motion powered

#### `FeaturedProducts.jsx`
- Homepage featured products section
- Fetches `SELECT ... FROM products WHERE is_featured = true LIMIT 4`
- Product cards with hover effects + CTA

#### `CTABanner.jsx`
- Call-to-action banner section
- Links to contact or products page

---

## 11. Page Documentation

### Homepage (`app/page.jsx`) — Server Component

**Section Order**:
1. `<HeroSection />` — Full viewport hero
2. `<MarqueeStrip />` — Scrolling text
3. `<StatsStrip />` — Key stats
4. `<CategoryGrid />` — Product categories
5. `<WhyChooseHRP />` — Value proposition
6. `<BrandsMarquee />` — Brand logos
7. `<FeaturedProducts />` — Featured products
8. `<CTABanner />` — Call-to-action

**Data Fetching**:
- `getFeaturedProducts()` queries: `SELECT id, slug, name, description, category_slug, image_url FROM products WHERE is_featured = true ORDER BY created_at DESC LIMIT 4`
- Errors caught silently; returns empty array `[]` on failure

**SEO Metadata**:
- Title: "HRP — Industrial Products"
- Description: "HRP supplies SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves, and Fittings..."

---

### About Page (`app/about/page.jsx`) — Server Component

**Content**:
- `<CompanyJourney />` — Timeline component
- Future sections TBD

**SEO Metadata**:
- Title: "About Us | HRP"

---

### Contact Page (`app/contact/page.jsx`) — Client Component

**Form Fields**:
| Field | Type | Required | DB Column |
|---|---|---|---|
| Full Name | text | ✅ Yes | `name` |
| Company Name | text | No | `company` |
| Phone Number | tel | ✅ Yes | `phone` |
| Email Address | email | No | `email` |
| Product Category | select | No | `category` |
| Your Inquiry | textarea | ✅ Yes | `message` |

**Category Options** (hardcoded):
`instrumentation, pneumatics, hydraulics, vacuum, valves, rubber, power-tools, compressors, paint, lifting, bellows, other`

**Status Flow**: `idle` → `loading` → `success`/`error`

**On Success**: Form resets, confirmation shown with "Send another →" link

**Left Column Contact Cards**:
- WhatsApp CTA (gradient)
- Phone: +91 99999 99999 (Mon–Sat, 9am–6pm)
- Email: info@hrpindustrial.in
- Location: Hyderabad, Telangana
- Hours: Monday–Saturday, 9:00 AM – 6:00 PM IST

**Animations**: `fadeUp()` helper with staggered delays

---

### Products Page (`app/products/page.jsx`) — Client Component

**Data**: `SELECT id, name, slug, description FROM categories ORDER BY sort_order ASC`

**`CAT_META` Object** (hardcoded metadata keyed by slug):
```js
{
  instrumentation: { icon: "⬡", count: "80+ Products", image: "/images/categories/instrumentation.png" },
  pneumatics:      { icon: "◈", count: "65+ Products", image: "..." },
  // ... etc for all 11 categories
}
```

**Features**:
- Hero section with 4 stat pills: `11+ Categories`, `500+ Products`, `50+ Brands`, `20+ Years`
- Real-time search filter (client-side) on category name + description
- Sticky search bar below navbar at `top-16 z-30`
- Cards: each links to `/products/[category_slug]`
- Hover effects: image scale + top border animation

---

### Product Detail Page (`app/products/item/[id]/page.jsx`) — Client Component

**Data**:
- Main: `SELECT * FROM products WHERE id = ?`
- Related: `SELECT * FROM products WHERE category_slug = ? ORDER BY sort_order LIMIT 4`

**Layout**:
- **Left**: Main image + gallery thumbnails (if `gallery_urls` present)
- **Right**: Category/subcategory pills → name → brand/model badges → description → specs table → CTA buttons

**Specs Rendering**:
- `Object.entries(product.specs)` as alternating-stripe table
- `col-span-2` for label, `col-span-3` for value

**CTAs**:
- "Send Inquiry" → `/contact?product={slug}`
- "WhatsApp" → `wa.me/{number}?text={product name}`
- Shown as sticky mobile footer + desktop inline buttons

**Related Products**: Up to 4 from same category, card grid at bottom

**Breadcrumb**: Category → Subcategory (if present)

---

## 12. Admin Panel

### Auth Guard (`app/admin/layout.jsx`)

**Session Check Flow**:
1. On mount: `supabase.auth.getSession()`
2. If no session: `router.replace("/admin/login")`
3. While checking: spinner shown (28px, brand-primary border)
4. If valid: `authChecked = true`, layout renders
5. `onAuthStateChange` listener: If `SIGNED_OUT`, redirect to login

**Inquiry Badge**:
- After auth confirmed, queries: `SELECT id COUNT WHERE status = 'new'`
- Re-queries on pathname change
- Displayed in sidebar + top navigation

**Sign Out**: `supabase.auth.signOut()` → `SIGNED_OUT` listener redirects to login

**Sidebar**:
- Animated width: `224px` (open) ↔ `64px` (closed), transition `0.22s ease`
- Nav array:
  ```js
  [
    { href: "/admin/dashboard",            label: "Dashboard" },
    { href: "/admin/dashboard/categories", label: "Categories" },
    { href: "/admin/dashboard/product",    label: "Products" },
    { href: "/admin/dashboard/inquiries",  label: "Inquiries", badge: "inquiries" },
  ]
  ```
- Active detection: `pathname === item.href` OR `pathname.startsWith(item.href)`
- Special case: `/admin/login` bypasses layout entirely

**Header Breadcrumb**: `Admin / {last path segment}`

---

### Login Page (`app/admin/login/page.jsx`)

**Auth Method**: `supabase.auth.signInWithPassword({ email, password })`

**On Success**: `router.push("/admin/dashboard")`

**Inputs**:
- Email: `type="email"`, placeholder `"admin@hrpindustrial.in"`
- Password: `type="password"` with eye toggle to text

**UX**:
- Error display: Red banner with white text
- Loading state: Spinner + "Signing in…" on button, disabled
- Background: `#0E1520` with radial glow
- Card: 400px max-width, glassmorphism `rgba(255,255,255,0.04)`, blur(16px), 20px border-radius

---

### Dashboard Overview (`app/admin/dashboard/page.jsx`)

**Stat Cards** (linkable):
| Label | Color | Links To |
|---|---|---|
| Categories | `#2B7EA1` | `/admin/dashboard/categories` |
| Products | `#8DC63F` | `/admin/dashboard/product` |
| Inquiries | `#E5A020` | `/admin/dashboard/inquiries` |

**Action Cards** (linkable):
| Title | Links To |
|---|---|
| Manage Categories | `/admin/dashboard/categories` |
| Manage Products | `/admin/dashboard/product` |
| View Inquiries | `/admin/dashboard/inquiries` |

**Activity Feed**:
- Merges last 4 of each: categories, products, inquiries
- Sorted by `created_at` DESC, shows top 8 total
- Per entry: colored icon, label, sub-text (slug/phone/category), relative time via `timeAgo()`

**Status Bar**: Green pulsing dot + "All systems operational — Supabase connected"

---

### Categories CRUD (`app/admin/dashboard/categories/page.jsx`)

**State**:
- `categories[]`, `loading`, `drawerOpen`, `editing` (null = add mode, object = edit mode)
- `form: { name, slug, description, icon, image_url, sort_order }`
- `deleteConfirm` (id waiting second click), `saving`, `toast`, `imageUploading`, `search`

**Slug Generation** (`slugify(str)`):
```js
str.toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "")
```

**Auto-slug**: In ADD mode, slug auto-generates from name. In EDIT mode, slug remains manual.

**Image Upload**:
- Bucket: `"category-images"`
- Path: `categories/${Date.now()}.${ext}`
- `upsert: true`
- Supports drag-drop, click-upload, paste URL
- Recommended: 800×500px, JPG/PNG/WebP

**Delete Pattern**:
- First click: `deleteConfirm = id`, button turns red "Confirm?"
- 3-second timeout
- Second click within 3s: executes `DELETE`

**Toast**: Bottom-right fixed, auto-dismisses after 3s, green (success) or red (error)

**Drawer**: 440px wide, slides from right, dark overlay dismisses on click

---

### Products CRUD (`app/admin/dashboard/product/page.jsx`)

**Note**: File at `product/page.jsx` (singular), but previously linked as `/admin/dashboard/products` (plural) — **now corrected**.

**EMPTY Form Default**:
```js
{
  name: "", slug: "", category_slug: "", subcategory_id: "",
  subcategory_name: "", description: "", brand: "", model_number: "",
  image_url: "", gallery_urls: [], specs: [], is_featured: false, sort_order: 0
}
```

**State**:
- Data: `categories[]`, `subcategories[]`, `products[]`, `loading`
- Filters: `activeCat` (default `"all"`), `activeSubcat` (default `"all"`), `search`
- Product drawer: `open`, `editId`, `form`, `slugManual`, `saving`, `saveErr`
- Subcategory drawer: `subcatDrawerOpen`, `subcatForm`, `subcatSaving`, `subcatErr`, `editSubcatId`
- Delete: `deletePending` (id), `delTimer` (timeout ref)
- Images: `imgUploading`, `galleryUploading`, `imgRef`, `galleryRef`

**Slug Auto-generation**: Tracks `slugManual` bool. If false, auto-slugifies name. Once user edits slug manually, `slugManual = true` and auto-generation stops.

**Category Tabs**: Horizontal scrollable row `[All | Cat1 | Cat2 | ...]` with product count badges. Switching tab resets `activeSubcat` to `"all"`.

**Subcategory Chips**: Shown only when `activeCat !== "all"`. Each shows name + count. Edit button (pencil) opens subcategory drawer.

**Product Table Columns**:
- Product (thumbnail + name + slug)
- Category (blue badge)
- Subcategory (text)
- Brand (text)
- Status (Featured/Standard badge)
- Added (timeAgo)
- Actions (Edit/Delete)

**`timeAgo(ts)` Logic**:
```
< 60s   → "{s}s ago"
< 3600s → "{m}m ago"
< 86400s→ "{h}h ago"
else    → "{d}d ago"
```

**Product Drawer Sections**:
1. **Product Name*** (auto-slugifies)
2. **URL Slug*** (shows preview `/products/item/{slug}`)
3. **Category*** + **Subcategory** (dependent dropdown)
4. **Brand** + **Model Number** (2-col grid)
5. **Description** (textarea)
6. **Specifications** (key-value array, reorderable with ▲▼, deletable with ×)
   - Serialized to DB as JSON object: `{ key1: value1, key2: value2 }`
7. **Main Image** (upload zone + URL input, 110×110 preview + delete)
8. **Gallery Images** (multi-file upload, 68×68 thumbnails + delete per image)
9. **Sort Order** + **Featured toggle** (2-col, toggle green when on)

**Image Upload** (products):
- Bucket: `"product-images"`
- Path: `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
- Gallery: Sequential, appends each URL to `gallery_urls[]`

**Save Validation**:
- Name required
- Slug required
- Category required
- DB enforces slug uniqueness (error code `23505`)

**Subcategory Drawer**:
- Opens from "+ Subcategory" header button OR "+ New" link in product form
- Lists existing subcats for selected category with Edit/Delete per row

**Delete Pattern** (products): Same as categories — `deletePending` + 3s timeout + color change

---

### Inquiries Management (`app/admin/dashboard/inquiries/page.jsx`) (NEW)

**Purpose**: Full inquiry CRUD with status management, filtering, search, and detail modal.

**Stat Cards**:
- **New Inquiries** (`#E5A020`): Count of `status = 'new'`
- **Total Inquiries** (`#2B7EA1`): Total record count
- **This Month** (`#8DC63F`): Count created in current month

**Status Badge Configuration**:
- `new`: Amber background
- `read`: Teal background
- `resolved`: Green background

**Features**:
- **Filter Tabs**: `All` | `New` | `Read` | `Resolved` — switches active filter
- **Search**: Real-time client-side filter on name, email, phone, message
- **Table Columns**: Name, Phone, Category, Message (truncated), Status, Created, Actions
- **Actions**: View (detail modal) | Change Status | Delete

**Detail Modal**:
- Shows full inquiry with all fields
- Status dropdown to change `new` → `read` → `resolved`
- Contact details (phone, email) with copy buttons
- Company name (if present)
- Full message text
- Creation timestamp
- Two-click delete with confirmation

**Delete Pattern**: First click → "Confirm?", second within 3s executes `DELETE`

**Toast Notifications**: Success (green) or error (red), auto-dismiss 3s

**Time Formatting**: Uses `timeAgo()` for list view, full datetime for modal

---

## 13. Utility Functions

### `app/lib/utils.js`

#### `getImageUrl(path: string): string`
```js
if (!path) return "/images/placeholder.jpg"
if (path.startsWith("http")) return path  // Already full URL
return `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
```

#### `getWhatsAppUrl(message?: string): string`
```js
// Default: "Hello! I found your website and would like to make an enquiry."
const number = NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"
return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
```

#### `truncate(str: string, length?: number): string`
```js
// Default length: 120 characters
if (!str) return ""
return str.length > length ? str.slice(0, length) + "…" : str
```

### `app/lib/supabase.js`

Singleton Supabase client:
```js
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
export { supabase }
```

Throws error at module load if environment variables are missing.

---

## 14. Recent Updates & Changes

### Major Updates Since Reference Document

#### 1. **Inquiries Admin Page Created** ✅
- File: `app/admin/dashboard/inquiries/page.jsx`
- Fully functional CRUD interface for managing customer inquiries
- Status management (new → read → resolved)
- Detailed modal view with copy buttons for contact info
- Real-time search and status filtering
- Two-click delete with confirmation

#### 2. **Vision API for Spec Extraction** ✅
- New API route: `app/api/extract-specs/route.js`
- Accepts base64 image of product datasheets
- Uses Claude Haiku vision to extract specification pairs
- Returns clean JSON array of `{ key, value }` specs
- Integrated into product CRUD for faster data entry

#### 3. **New Layout Files** ✅
- `app/contact/layout.jsx`
- `app/products/layout.jsx`
- `app/products/[category]/layout.jsx`
- `app/products/[category]/[subcategory]/layout.jsx`
- `app/products/item/[id]/layout.jsx`
- Provides section-specific context and metadata

#### 4. **AboutSections Component** ✅
- File: `app/components/about/AboutSections.jsx`
- "Why Choose HRP" feature cards (4 items)
- Brand logos carousel (23+ brands)
- Visual polish: hover glows, accent lines, animations

#### 5. **Anthropic SDK Integration** ✅
- Added `@anthropic-ai/sdk` dependency
- Uses `claude-haiku-4-5-20251001` model
- Requires `ANTHROPIC_API_KEY` in `.env.local`

#### 6. **Admin Sidebar Link Fix** ✅
- Corrected `/admin/dashboard/products` (plural) → `/admin/dashboard/product` (singular)
- Matches actual filesystem structure

---

## 15. Known Issues & Fixes Applied

### Issue 1: Featured Products Query Column Name
**Status**: ⚠️ **NOT YET FIXED**
**Location**: `app/page.jsx`, line ~23
**Problem**: Query selects `'category'` but schema uses `'category_slug'`
**Impact**: Featured products may fail silently (caught by try-catch)
**Recommended Fix**:
```js
// Change from:
.select('id, slug, name, description, category, image_url')
// To:
.select('id, slug, name, description, category_slug, image_url')
```

### Issue 2: CompanyJourney BrandsRow Hidden
**Status**: ⚠️ **NOT YET FIXED**
**Location**: `app/components/about/CompanyJourney.jsx`, line ~40
**Problem**: `showBrands: false` prevents brands grid from rendering after 2015 milestone
**Recommended Fix**:
```js
// Change:
{ year: 2015, label: "Chapter III", ... showBrands: false }
// To:
{ year: 2015, label: "Chapter III", ... showBrands: true }
```

### Issue 3: Admin Products Page Light Theme
**Status**: ⚠️ **INCONSISTENCY**
**Location**: `app/admin/dashboard/product/page.jsx`
**Problem**: Uses light theme (white bg) while rest of admin is dark (`#0E1520`)
**Impact**: Visual inconsistency, may confuse users
**Recommendation**: Align to dark theme with rest of admin panel

### Issue 4: Hardcoded Contact Information
**Status**: ⚠️ **MAINTENANCE RISK**
**Locations**:
- `app/components/layout/Footer.jsx` (phone, email, address)
- `app/contact/page.jsx` (phone, email, address, hours)
**Recommendation**: Move to environment variables or database configuration table

---

## 16. Build & Development

### Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with required variables
cp .env.local.example .env.local  # if example exists
# Add: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_WHATSAPP_NUMBER, ANTHROPIC_API_KEY

# 3. Start development server (runs on http://localhost:3000)
npm run dev

# 4. Start browser, navigate to http://localhost:3000
```

### Build for Production

```bash
# Build
npm run build

# Test production build locally
npm run start
```

### Environment File Template

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_WHATSAPP_NUMBER=919000000000
ANTHROPIC_API_KEY=sk-ant-...
```

### Configuration Files

**`jsconfig.json`**:
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```
Path alias `@/*` resolves to project root.

**`postcss.config.mjs`**:
Configured with `@tailwindcss/postcss` for Tailwind v4.

**`next.config.ts`**:
Minimal configuration. No special redirects, rewrites, or image domain configuration.

**Note**: If serving external Supabase images via `next/image`, add to `images.domains` or `images.remotePatterns` in next.config.ts.

---

## Additional Notes for LLM Agents

### Critical Integration Points

1. **Supabase Operations**: Always import `supabase` from `@/app/lib/supabase`
2. **Environment Validation**: Check for required env vars before using them
3. **Anthropic API**: Only available on `/api/extract-specs` endpoint; requires `ANTHROPIC_API_KEY`
4. **Image URLs**: Use `getImageUrl()` utility for product images; handle category images via Supabase storage method
5. **WhatsApp Integration**: Use `getWhatsAppUrl()` to generate properly formatted wa.me links

### Code Conventions

- **No TypeScript in source**: All files are `.jsx`/`.js`, but type definitions available in `@types/*` packages
- **Client Components**: Use `'use client'` directive sparingly; prefer Server Components where possible
- **Styling**: Tailwind v4 @theme tokens preferred; avoid inline styles except for dynamic values
- **Animations**: Framer Motion for complex animations; CSS keyframes for simple, reusable animations
- **Error Handling**: Wrap Supabase queries in try-catch; use toast notifications for user feedback

### Performance Considerations

- Homepage uses Server Components by default; only specific interactive sections use Client Components
- Featured products query includes `LIMIT 4` — change as needed but keep reasonable
- Category/product queries use `ORDER BY sort_order` — ensure sort_order is populated for consistent UX
- Image optimization: Next.js Image component recommended for `next/image` but not enforced in current setup

### Testing & Verification

- Admin pages require Supabase authentication — use test credentials from project settings
- Contact form submissions go directly to `inquiries` table — verify via admin/dashboard/inquiries
- API routes return JSON; always validate response structure before using in components
- Product spec extraction: test with clear, well-formatted datasheet images

---

## File Index by Feature

### Authentication & Security
- `app/admin/layout.jsx` — Auth guard
- `app/admin/login/page.jsx` — Login form
- `app/lib/supabase.js` — Supabase client initialization

### Product Management
- `app/products/page.jsx` — Category listing
- `app/products/[category]/page.jsx` — Subcategory listing
- `app/products/[category]/[subcategory]/page.jsx` — Product grid
- `app/products/item/[id]/page.jsx` — Product detail
- `app/admin/dashboard/product/page.jsx` — Product CRUD

### Content Management
- `app/admin/dashboard/categories/page.jsx` — Category CRUD
- `app/admin/dashboard/inquiries/page.jsx` — Inquiry management
- `app/api/extract-specs/route.js` — Vision API for specs

### Frontend Components
- `app/components/home/` — Homepage sections
- `app/components/about/` — About page sections
- `app/components/layout/` — Header, footer, navigation

### Utilities
- `app/lib/utils.js` — Helper functions
- `app/globals.css` — Design tokens and animations

---

*Document Generated: May 25, 2026*
*For updates, reference the git log and recently modified files*
*Last Project Version: 0.1.0*
