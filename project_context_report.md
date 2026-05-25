# HRP Industrial Products — Full Project Context Report

> **Purpose**: Complete technical handoff document. A new developer or LLM agent reading only this file should be able to understand the entire codebase, make changes, and avoid known pitfalls without exploring any source files independently.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | HRP Industrial Products Website |
| **Root Directory** | `c:\projects\hrp-website` |
| **Package Name** | `hrp-website` |
| **Version** | `0.1.0` |
| **Framework** | Next.js 16.2.6 (App Router) |
| **Primary Language** | JavaScript (JSX) — no TypeScript in source files |
| **Description** | B2B industrial product catalogue + inquiry platform for Hyderabad-based distributor HRP, supplying SS Bellows, Hydraulic/Pneumatic Hoses, Pressure Gauges, Valves, and Fittings across India. |

---

## 2. Technology Stack (Exact Versions)

### Runtime Dependencies
| Package | Version | Role |
|---|---|---|
| `next` | `16.2.6` | Full-stack React framework (App Router) |
| `react` | `19.2.4` | UI library |
| `react-dom` | `19.2.4` | DOM renderer |
| `@supabase/supabase-js` | `^2.105.4` | Backend-as-a-service client (DB + Auth + Storage) |
| `framer-motion` | `^12.38.0` | Animation library |
| `lucide-react` | `^1.14.0` | Icon library (Phone, Mail, MapPin, Clock, etc.) |

### Dev Dependencies
| Package | Version | Role |
|---|---|---|
| `tailwindcss` | `^4` | Utility CSS framework (v4 — uses `@theme` syntax) |
| `@tailwindcss/postcss` | `^4` | PostCSS integration for Tailwind v4 |
| `eslint` | `^9` | Linter |
| `eslint-config-next` | `16.2.6` | Next.js ESLint rules |
| `typescript` | `^5` | Type checking (types only, source is plain JS) |
| `@types/node`, `@types/react`, `@types/react-dom` | `^20/^19/^19` | TypeScript types |

### NPM Scripts
```bash
npm run dev     # next dev   — local development server
npm run build   # next build — production build
npm run start   # next start — serve production build
npm run lint    # eslint
```

---

## 3. Environment Variables

All required in `.env.local` at the project root. **The app throws at startup if any are missing.**

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL (`https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous (public) API key |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ⚠️ Optional | WhatsApp number without `+` (e.g. `919000000000`). Falls back to `"91XXXXXXXXXX"` if missing. |

**How they are used:**
- `app/lib/supabase.js` — throws `Error("Missing Supabase environment variables…")` if URL or key are falsy.
- `app/lib/utils.js` `getImageUrl()` — uses `NEXT_PUBLIC_SUPABASE_URL` to build Storage URLs.
- `app/lib/utils.js` `getWhatsAppUrl()` — uses `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- `app/contact/page.jsx` — directly reads `NEXT_PUBLIC_WHATSAPP_NUMBER` (fallback `"919999999999"`).

---

## 4. Project File Tree (All Tracked Files)

```
hrp-website/
├── .env.local                          # Environment secrets (gitignored)
├── .gitignore
├── AGENTS.md                           # Agent instructions
├── CLAUDE.md                           # Claude agent note
├── README.md
├── eslint.config.mjs
├── jsconfig.json                       # Path aliases: "@/*" → "./*"
├── next.config.ts                      # Minimal config
├── package.json
├── package-lock.json
├── postcss.config.mjs
│
├── public/
│   ├── images/
│   │   ├── hrp_logo.png               # Official HRP logo (120×120px in intro)
│   │   ├── hero.png                   # Hero section background
│   │   ├── brands/                    # 23 brand logo files (.jpg/.svg/.png)
│   │   │   ├── Hydraulics And Rubber Products.jpg
│   │   │   ├── baumer.svg, bosch.svg, cona.jpg, conact.svg
│   │   │   ├── dowsil.jpg, dunlop.svg, fevicol.jpg
│   │   │   ├── janatics.jpg, jolly.jpg, khaitan.png
│   │   │   ├── loctite.jpg, makita.jpg, molykote.jpg
│   │   │   ├── painter.png, parker.jpg, piab.png
│   │   │   ├── pix.jpg, pneumax.svg, schmalz.jpg
│   │   │   ├── techno.jpg, wadfow.png, wikai.jpg
│   │   └── categories/                # 11 category images (.png)
│   │       ├── bellows.png, compressors.png, hydraulics.png
│   │       ├── instrumentation.png, lifting.png, paint.png
│   │       ├── pneumatics.png, power-tools.png, rubber.png
│   │       ├── vacuum.png, valves.png
│   └── (next.svg, vercel.svg, etc.)   # Default Next.js assets
│
└── app/
    ├── globals.css                     # Design system: @theme, @layer base/components/utilities
    ├── layout.jsx                      # Root layout: IntroWrapper + PublicShell
    ├── page.jsx                        # Homepage (Server Component)
    ├── favicon.ico
    │
    ├── lib/
    │   ├── supabase.js                 # Singleton Supabase client export
    │   └── utils.js                   # getImageUrl(), getWhatsAppUrl(), truncate()
    │
    ├── components/
    │   ├── IntroWrapper.jsx            # Dynamic import of PageIntro (SSR: false)
    │   ├── PageIntro.jsx               # First-paint CRT scan animation (client)
    │   ├── about/
    │   │   └── CompanyJourney.jsx      # Timeline scroll-reveal component (client)
    │   ├── home/
    │   │   ├── HeroSection.jsx
    │   │   ├── MarqueeStrip.jsx
    │   │   ├── StatsStrip.jsx
    │   │   ├── CategoryGrid.jsx
    │   │   ├── WhyChooseHRP.jsx
    │   │   ├── BrandsMarquee.jsx
    │   │   ├── FeaturedProducts.jsx
    │   │   └── CTABanner.jsx
    │   └── layout/
    │       ├── Navbar.jsx              # Fixed header, glass blur on scroll, mobile menu
    │       ├── Footer.jsx              # 4-column footer with links, contact, WhatsApp CTA
    │       ├── PublicShell.jsx         # Conditionally renders Navbar/Footer/FAB
    │       └── WhatsAppFAB.jsx         # Floating action button (appears after 1200ms)
    │
    ├── about/
    │   └── page.jsx                    # Renders <CompanyJourney />
    │
    ├── contact/
    │   └── page.jsx                    # Inquiry form → inserts to `inquiries` table
    │
    ├── products/
    │   ├── page.jsx                    # Category grid (client, fetches from Supabase)
    │   ├── [category]/
    │   │   ├── page.jsx               # Subcategory listing for one category
    │   │   └── [subcategory]/
    │   │       └── page.jsx           # Product grid filtered by subcategory
    │   └── item/
    │       └── [id]/
    │           └── page.jsx           # Product detail page
    │
    └── admin/
        ├── page.jsx                   # redirect("/admin/dashboard")
        ├── layout.jsx                 # Auth guard + sidebar shell (client)
        ├── login/
        │   └── page.jsx               # Email/password login via Supabase Auth
        └── dashboard/
            ├── page.jsx               # Overview: stat cards + activity feed
            ├── categories/
            │   └── page.jsx           # Full CRUD for categories table
            └── product/               # ⚠️ NAMED "product" (singular) — see Bug §12
                └── page.jsx           # Full CRUD for products + subcategories
```

---

## 5. Routing Architecture

### Public Routes

| URL | File | Rendering | Description |
|---|---|---|---|
| `/` | `app/page.jsx` | **Server** | Homepage with 8 sections |
| `/about` | `app/about/page.jsx` | **Server** | About page renders `<CompanyJourney>` |
| `/contact` | `app/contact/page.jsx` | **Client** | Inquiry form |
| `/products` | `app/products/page.jsx` | **Client** | Category grid (fetches Supabase) |
| `/products/[category]` | `app/products/[category]/page.jsx` | **Client** | Subcategory listing |
| `/products/[category]/[subcategory]` | `app/products/[category]/[subcategory]/page.jsx` | **Client** | Product grid |
| `/products/item/[id]` | `app/products/item/[id]/page.jsx` | **Client** | Product detail |

### Admin Routes

| URL | File | Description |
|---|---|---|
| `/admin` | `app/admin/page.jsx` | Hard redirect → `/admin/dashboard` |
| `/admin/login` | `app/admin/login/page.jsx` | Login form (bypasses layout guard) |
| `/admin/dashboard` | `app/admin/dashboard/page.jsx` | Stat cards + activity feed |
| `/admin/dashboard/categories` | `app/admin/dashboard/categories/page.jsx` | Category CRUD |
| `/admin/dashboard/product` | `app/admin/dashboard/product/page.jsx` | Product + Subcategory CRUD |
| `/admin/dashboard/inquiries` | ❌ **DOES NOT EXIST** | See Bug §12 |
| `/admin/dashboard/products` | ❌ **DOES NOT EXIST** | See Bug §12 |

---

## 6. Supabase Database Schema

### Table: `categories`

| Column | Type | Notes |
|---|---|---|
| `id` | `int` / `bigint` | Primary key, auto-increment |
| `name` | `text` | Display name (e.g. "Pneumatics") |
| `slug` | `text` | URL-safe identifier (e.g. "pneumatics"), unique |
| `description` | `text` | Short description shown on cards |
| `icon` | `text` | Emoji fallback when no image (e.g. "🔧") |
| `image_url` | `text` | Full URL from `category-images` storage bucket |
| `sort_order` | `int` | Lower = appears first |
| `created_at` | `timestamptz` | Auto-set by Supabase |

**Queries used:**
- `SELECT * ORDER BY sort_order ASC` — admin categories page, public products page
- `SELECT id, name, slug ORDER BY sort_order` — product CRUD page (populates dropdowns)
- `INSERT payload` / `UPDATE ... WHERE id = ?` / `DELETE WHERE id = ?` — admin CRUD
- `SELECT name, slug, created_at ORDER BY created_at DESC LIMIT 4` — dashboard activity feed

---

### Table: `subcategories`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` or `int` | Primary key |
| `name` | `text` | Display name (e.g. "Cylinders") |
| `category_slug` | `text` | Foreign reference to `categories.slug` |
| `created_at` | `timestamptz` | Auto-set |

**Queries used:**
- `SELECT id, name, category_slug ORDER BY name` — product CRUD (filter chips + drawer dropdowns)
- `INSERT { name, category_slug }` / `UPDATE ... WHERE id = ?` / `DELETE WHERE id = ?` — subcat management inside product page

---

### Table: `products`

| Column | Type | Notes |
|---|---|---|
| `id` | `int` / `bigint` | Primary key |
| `name` | `text` | Full product name |
| `slug` | `text` | URL-safe unique identifier, used in `/products/item/[id]` |
| `description` | `text` | Product description paragraph |
| `category_slug` | `text` | References `categories.slug` |
| `subcategory_id` | `int`/`uuid` | References `subcategories.id` (nullable) |
| `subcategory_name` | `text` | Denormalized name copy (nullable) |
| `brand` | `text` | Manufacturer brand name (nullable) |
| `model_number` | `text` | Part/model number (nullable) |
| `image_url` | `text` | Full URL (from `product-images` bucket or external) |
| `gallery_urls` | `jsonb` | JSON array of image URL strings (nullable) |
| `specs` | `jsonb` | JSON object of key-value spec pairs (nullable) |
| `is_featured` | `boolean` | If true, appears on homepage Featured section |
| `sort_order` | `numeric` | Lower = appears first within category |
| `created_at` | `timestamptz` | Auto-set |

**Key query patterns:**
- List (admin): `SELECT id, name, slug, category_slug, subcategory_id, subcategory_name, brand, is_featured, image_url, created_at, sort_order ORDER BY sort_order, created_at DESC`
- Detail: `SELECT * WHERE id = ? SINGLE`
- Homepage featured: `SELECT id, slug, name, description, category, image_url ORDER BY created_at DESC LIMIT 4`
- Dashboard activity: `SELECT name, category_slug, created_at ORDER BY created_at DESC LIMIT 4`

> **⚠️ Schema Mismatch Note**: The homepage query (`app/page.jsx` line 23) selects `category` (without `_slug`), but all other code uses `category_slug`. This is a likely legacy column name issue — the actual DB column may be `category_slug` and the homepage query may fail silently (the `getFeaturedProducts` function catches all errors with `console.warn`).

---

### Table: `inquiries`

| Column | Type | Notes |
|---|---|---|
| `id` | `int` / `bigint` | Primary key |
| `name` | `text` | Submitter's full name (required) |
| `company` | `text` | Company name (nullable) |
| `phone` | `text` | Phone number (required) |
| `email` | `text` | Email address (nullable) |
| `category` | `text` | Selected product category slug (nullable) |
| `message` | `text` | Inquiry message (required) |
| `status` | `text` | `'new'` (default) or `'read'`/other admin-set values |
| `created_at` | `timestamptz` | Auto-set |

**Query patterns:**
- Insert: `INSERT { name, company, phone, email, category, message }` — contact form
- Count new: `SELECT id COUNT WHERE status = 'new'` — admin layout badge + admin dashboard
- Total count: `SELECT id COUNT` — dashboard stat card
- Recent: `SELECT name, phone, category, created_at ORDER BY created_at DESC LIMIT 4` — activity feed

---

## 7. Supabase Storage Buckets

| Bucket Name | Used By | Path Pattern |
|---|---|---|
| `product-images` | Product image uploads | `{timestamp}-{random}.{ext}` (e.g. `1716393600000-abc123.jpg`) |
| `category-images` | Category image uploads | `categories/{timestamp}.{ext}` (e.g. `categories/1716393600000.png`) |

**URL construction** (`app/lib/utils.js`):
```js
// getImageUrl(path) — for product-images bucket:
`${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
```
Category images return a full public URL from `supabase.storage.from("category-images").getPublicUrl(path).data.publicUrl`.

---

## 8. Design System (`app/globals.css`)

### Tailwind v4 `@theme` Tokens

```css
/* Colors */
--color-brand-primary:   #2B7EA1   /* Teal/Blue — main CTA, active states */
--color-brand-secondary: #3A4555   /* Slate Grey — body text default */
--color-brand-accent:    #8DC63F   /* Lime Green — highlights, buttons */
--color-brand-dark:      #1A2533   /* Near-black — dark section backgrounds */
--color-brand-light:     #F4F6F8   /* Off-white — light backgrounds */

/* Fonts */
--font-heading: "Syne", sans-serif    /* Bold display font, weights 400–800 */
--font-body:    "Inter", sans-serif   /* Body/UI text, weights 300–700 */

/* Animations (custom) */
--animate-pulse-ring: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
--animate-fade-in:    fadeIn 0.6s ease forwards
--animate-slide-up:   slideUp 0.6s ease forwards
```

**Google Fonts import** (top of globals.css):
```css
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap");
```

### Keyframe Definitions

| Name | Effect |
|---|---|
| `pulseRing` | WhatsApp FAB glow ring: `box-shadow` pulses from `rgba(37,211,102,0.5)` → 0 at 50% |
| `fadeIn` | `opacity: 0 → 1` over 0.6s |
| `slideUp` | `opacity: 0, translateY(24px) → opacity: 1, translateY(0)` over 0.6s |

### Custom CSS Classes (`@layer components`)

| Class | Purpose |
|---|---|
| `.navbar-glass` | Glassmorphism nav: `rgba(26,37,51,0.85)` bg + `blur(12px)` + bottom border |
| `.container-hrp` | Max-width layout: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| `.btn-accent` | Primary green CTA button: `bg-brand-accent text-brand-dark font-heading font-bold px-6 py-3 rounded-lg` with hover/active states |
| `.btn-outline` | Secondary outline button: `border-white/30 text-white` with hover bg |
| `.glass-card` | Card with `rgba(255,255,255,0.04)` bg + `blur(8px)` + white border |
| `.section-label` | Uppercase eyebrow text in brand-accent, `tracking-[0.2em]` |
| `.section-heading` | Dark heading: `font-heading text-3xl sm:text-4xl font-bold text-brand-dark` |
| `.section-heading-light` | White variant of the above |

### Custom Utilities (`@layer utilities`)

| Class | Effect |
|---|---|
| `.text-gradient` | `background-clip: text` gradient from `#2B7EA1` → `#8DC63F` at 135° |

---

## 9. Application Entry Points

### Root Layout (`app/layout.jsx`)

```
<html lang="en">
  <body className="min-h-screen flex flex-col">
    <IntroWrapper />          ← Client-only, dynamically imported (SSR disabled)
    <PublicShell>
      {children}              ← All page content goes here
    </PublicShell>
  </body>
</html>
```

**SEO metadata** defined here:
- Default title: `"HRP — Industrial Products"`
- Template: `"%s | HRP"` (pages override with `export const metadata`)
- Default description: `"HRP supplies SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves, and Fittings for industrial applications."`
- Keywords: SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves, Fittings, Industrial Products, HRP

---

## 10. Component Documentation

### `IntroWrapper.jsx`
- **Type**: Client Component (`'use client'`)
- **Purpose**: Thin wrapper that dynamically imports `PageIntro` with `ssr: false`, ensuring the intro animation only runs on the client and never during SSR.
- **Renders**: `<PageIntro />`

---

### `PageIntro.jsx` — CRT Scan Animation
- **Type**: Client Component (`'use client'`)
- **Imports**: `framer-motion` (`useMotionValue`, `useTransform`, `animate`), `next/image`

#### Timing Constants
```js
const LOGO_SETTLE_MS = 1100    // ms logo is visible before scan starts
const SCAN_DURATION_S = 1.4    // seconds for scan sweep top → bottom
const UNMOUNT_DELAY  = 160     // ms after sweep completes, before unmounting
```

#### Animation Sequence (total ≈ 2.42s)
1. **0–1100ms**: Dark overlay covers screen. Logo fades in with spring animation (`duration: 0.7, ease: [0.16, 1, 0.3, 1]`). Three pulsing dots appear below logo.
2. **1100ms**: `animate(scanY, 100, { duration: 1.4, ease: [0.5, 0, 0.4, 1] })` — scan line sweeps from top to bottom.
3. **As scan progresses**: Dark overlay `clipPath: inset(${scanY}% 0 0 0)` clips away from top, revealing the page beneath.
4. **scanY 40→62%**: Logo `opacity` fades from 1 to 0 (logo disappears as scan passes through it).
5. **After 1100ms + 1400ms + 160ms**: Component unmounts (`setVisible(false)`).
6. **Reduced motion**: If `prefers-reduced-motion: reduce`, component immediately unmounts without animation.

#### Layer Structure (z-index)
| z-index | Layer | Description |
|---|---|---|
| `200` | Dark overlay `motion.div` | Clips away from top as scan progresses |
| `201` | Logo `motion.div` | Centered logo, fades out during scan |
| `202` | Scan line `motion.div` | The moving luminous line |

#### Scan Line Visual Details
- **Height**: 2px
- **Gradient**: `transparent 0% → #2B7EA1 8% → #9be8ff 42% → #ffffff 50% → #9be8ff 58% → #2B7EA1 92% → transparent 100%`
- **Glow**: `0 0 18px 6px rgba(43,126,161,0.6)` + 2 additional box-shadow layers
- **Motion blur trail above**: 70px gradient from `rgba(43,126,161,0.14)` to transparent
- **Fade trail below**: 30px gradient from `rgba(43,126,161,0.08)` to transparent
- **Readout text** (right edge): `"SCAN ■ HRP-SYS"` in monospace, 9px, `rgba(43,126,161,0.7)`

#### Background Layers Inside Dark Overlay
1. Solid `#0d1520` base
2. CRT scanline texture: `repeating-linear-gradient(0deg, transparent 3px, rgba(255,255,255,0.016) 4px)`
3. Grid: `52×52px` white `rgba(0.022)` grid lines
4. Vignette: `radial-gradient(ellipse 100% 100%, transparent 50%, rgba(0,0,0,0.55) 100%)`

---

### `PublicShell.jsx` — Layout Guard
- **Type**: Client Component
- **Logic**: `const isAdmin = pathname.startsWith("/admin")`
- If `isAdmin` → renders ONLY `<main>{children}</main>` (no Navbar, Footer, FAB)
- If not admin → renders `<Navbar />` + `<main>{children}</main>` + `<Footer />` + `<WhatsAppFAB />`

---

### `Navbar.jsx`
- **Type**: Client Component
- **Nav Links**: `[{ Home, / }, { About, /about }, { Products, /products }, { Contact, /contact }]`
- **State**: `scrolled` (bool), `menuOpen` (bool)
- **Glass effect**: Applied when `scrolled && !isAbout` OR `menuOpen` — uses `.navbar-glass` class
- **Special behavior on `/about`**: Navbar stays transparent even when scrolled (because about page has its own dark header)
- **Active indicator**: Framer Motion `layoutId="nav-indicator"` — animated underline slides between active nav items using spring physics (`stiffness: 380, damping: 30`)
- **Mobile menu**: Full-screen overlay, items slide in with staggered delays (`i * 0.07s`)
- **Logo**: `/images/hrp_logo.png` (48×48) + "Hydraulics & Rubber Products" wordmark

---

### `Footer.jsx`
- **Type**: Server or Client Component (uses standard HTML)
- **Layout**: 4-column grid on large screens
  - **Col 1**: Brand info + WhatsApp CTA button
  - **Col 2**: Quick Links (Home, About, Products, Contact)
  - **Col 3**: Product categories list (all link to `/products`)
  - **Col 4**: Contact details (Phone, Email, Address with lucide icons)
- **Contact constants** hardcoded in file:
  - Phone: `+91 99999 99999`
  - Email: `info@hrpindustrial.in`
  - Address: Hyderabad, Telangana

---

### `WhatsAppFAB.jsx`
- **Type**: Client Component
- **Behavior**: Hidden for first 1200ms after mount (via `setTimeout`), then springs in with Framer Motion (`stiffness: 300, damping: 24`)
- **Button**: 56×56px round, `#25D366` (WhatsApp green), uses `animate-pulse-ring` from globals.css
- **Tooltip**: Shows `"Chat with us on WhatsApp"` on hover, animated with slide-in
- **URL**: Calls `getWhatsAppUrl("Hello HRP! I would like to make an enquiry.")` from `app/lib/utils.js`
- **Position**: `fixed bottom-8 right-5 z-50`

---

### `CompanyJourney.jsx` — About Timeline
- **Type**: Client Component (`'use client'`)
- **Additional font**: Imports `DM Sans` directly via `<style>` block (weights 200, 300, 400 italic)
- **Styling approach**: All styles are scoped via BEM-like CSS class names (`hrptl-*`) injected as a raw `<style>` block inside the component (not Tailwind)

#### Timeline Data (`MILESTONES` array — 7 entries)
| Year | Label | Key Stat |
|---|---|---|
| 1982 | The Origin | Est. 1983 |
| 2012 | Chapter II | 3× Product Range |
| 2015 | Chapter III | 10+ Brand Partners |
| 2018 | Chapter IV | 10+ Cities Served |
| 2021 | Chapter V | 200+ Product SKUs |
| 2024 | Chapter VI | 200+ Active Clients |
| 2026 | Present Day | 15+ Years Strong |

All milestone images are external Unsplash URLs with `w=900&q=80` parameters.

#### `BRANDS` array (8 entries) — rendered in `BrandsRow` component after Chapter III milestone
`Festo, Schmalz, Indef, Graco, Binks, Kito, Yale, Parker`
(Note: `showBrands` property is set to `false` on the 2015 milestone object — brands row will NOT render unless changed to `true`)

#### Scroll-Driven `Spine` Component
- Listens to `window.scroll` (passive)
- Calculates: `passed = min(max(-rect.top + windowHeight * 0.55, 0), totalHeight)`
- Sets `fill.style.height` as a percentage — creating a "fill as you scroll" effect
- Fill gradient: `#4a9ec5 → #3b82f6 → #8DC63F` (blue to green)

#### `useReveal(threshold)` Hook
- Uses `IntersectionObserver` with the given threshold
- Returns `[ref, visible]`
- Disconnects after first trigger (one-shot, not recurring)

#### Reveal Thresholds Used
| Element | Threshold |
|---|---|
| Header block | 0.25 |
| Milestone row (node trigger) | 0.10 |
| Text content | 0.12 |
| Image | 0.08 |
| BrandsRow | 0.15 |
| ClosingCTA | 0.20 |

#### Column Layout Logic
- Even-indexed milestones (`0, 2, 4, 6`): Text on LEFT, Image on RIGHT
- Odd-indexed milestones (`1, 3, 5`): Text on RIGHT, Image on LEFT
- Implemented via CSS `order` property on `.hrptl-cols--even/odd`

#### Closing CTA Section
Stats bar: `44+ Years`, `100K+ Active Clients`, `10K+ Products`, `Pan India`
Buttons: "Explore Our Products" → `/products`, "Get a Custom Quote" → `/contact`

---

## 11. Page Documentation

### Homepage (`app/page.jsx`) — Server Component
```
Order of sections:
1. <HeroSection />        — Full viewport dark hero
2. <MarqueeStrip />       — Scrolling text marquee
3. <StatsStrip />         — Key statistics row
4. <CategoryGrid />       — Category cards grid
5. <WhyChooseHRP />       — Value proposition section
6. <BrandsMarquee />      — Brand logos scroll
7. <FeaturedProducts />   — Receives `featuredProducts` prop from Supabase
8. <CTABanner />          — Call-to-action section
```

`getFeaturedProducts()` fetches `SELECT id, slug, name, description, category, image_url FROM products ORDER BY created_at DESC LIMIT 4`. Errors are caught silently; empty array returned on failure.

---

### About Page (`app/about/page.jsx`) — Server Component
```jsx
<main>
  <CompanyJourney />
  {/* Other about sections go here — Chat 4 */}
</main>
```
SEO: `"About Us | HRP Industrial Products"`

---

### Contact Page (`app/contact/page.jsx`) — Client Component

**Form Fields:**
| Field | Input Type | Required | Maps to DB column |
|---|---|---|---|
| Full Name | `text` | ✅ | `name` |
| Company Name | `text` | No | `company` |
| Phone Number | `tel` | ✅ | `phone` |
| Email Address | `email` | No | `email` |
| Product Category | `select` | No | `category` |
| Your Inquiry | `textarea` | ✅ | `message` |

**Category dropdown options** (hardcoded, not from DB):
`instrumentation, pneumatics, hydraulics, vacuum, valves, rubber, power-tools, compressors, paint, lifting, bellows, other`

**Status states**: `idle` → `loading` → `success` | `error`

**On success**: Form resets, success confirmation shown with option to "Send another →"

**Left column** contact cards:
- WhatsApp CTA (gradient card, hero CTA)
- Phone: +91 99999 99999 (Mon–Sat, 9am–6pm)
- Email: info@hrpindustrial.in
- Location: Hyderabad, Telangana
- Hours: Monday–Saturday, 9:00 AM – 6:00 PM IST

**Animation**: `fadeUp()` helper using `whileInView` with staggered delays (0.1s, 0.15s, 0.15+i*0.08s)

---

### Products Page (`app/products/page.jsx`) — Client Component

**Data**: Fetches `SELECT id, name, slug, description FROM categories ORDER BY sort_order ASC`

**`CAT_META` object** (hardcoded metadata keyed by slug):
```js
{
  instrumentation: { icon: "⬡", count: "80+ Products", image: "/images/categories/instrumentation.png" },
  pneumatics:      { icon: "◈", count: "65+ Products", image: "..." },
  hydraulics:      { icon: "◉", count: "70+ Products", image: "..." },
  vacuum:          { icon: "◎", count: "40+ Products", image: "...", badge: "Schmalz" },
  valves:          { icon: "◆", count: "90+ Products", image: "..." },
  rubber:          { icon: "▣", count: "55+ Products", image: "..." },
  "power-tools":   { icon: "⬟", count: "60+ Products", image: "..." },
  compressors:     { icon: "◐", count: "30+ Products", image: "..." },
  paint:           { icon: "◑", count: "35+ Products", image: "..." },
  lifting:         { icon: "◒", count: "45+ Products", image: "..." },
  bellows:         { icon: "◓", count: "25+ Products", image: "..." },
}
```

**`CategoryCard` animation**: `framer-motion` `initial={{ opacity: 0, y: 28 }}` staggered by `index * 0.06s`

**Hero stats pills**: `11+ Categories`, `500+ Products`, `50+ Brands`, `20+ Years`

**Search**: Real-time client-side filter on category `name` + `description`. Sticky below Navbar at `top-16 z-30`.

**Card behavior**: Each card links to `/products/${cat.slug}`. Hover effect: `scale-105` on bg image, top gradient border slides in.

---

### Product Detail Page (`app/products/item/[id]/page.jsx`) — Client Component

**Data**: `SELECT * FROM products WHERE id = ? SINGLE` + `SELECT * FROM products WHERE category_slug = ? ORDER BY sort_order LIMIT 4` for related products.

**Layout**: 
- Left side: Main image + gallery thumbnails (if `gallery_urls` present)
- Right side: Category/subcategory pills → `<h1>` name → Brand/Model badges → description → specs table → CTA buttons

**Specs rendering**: `Object.entries(product.specs)` rendered as alternating-stripe table, `col-span-2` label + `col-span-3` value.

**CTAs**:
- "Send Inquiry" → `/contact?product=${product.slug}` (links to contact page with query param)
- "WhatsApp" → `wa.me/...` constructed with product name in message
- Both displayed as sticky mobile bar at bottom + desktop version inline

**Related products**: Up to 4 from same `category_slug`, displayed as a card grid section at bottom.

**Breadcrumb navigation**: Category pill → Subcategory pill (if present)

---

## 12. Admin Panel Documentation

### Auth Guard (`app/admin/layout.jsx`)

**Session check flow:**
1. On mount: `supabase.auth.getSession()` called.
2. If no session → `router.replace("/admin/login")` immediately.
3. While checking: spinner shown (28px circle, `#2B7EA1` border, `spin` animation).
4. If session valid: `authChecked = true`, `userEmail` stored, layout renders.
5. `onAuthStateChange` listener: If `SIGNED_OUT` event fires, redirect to login.

**Inquiry badge:** After auth confirmed, queries `SELECT id COUNT WHERE status = 'new'`. Re-queries on every pathname change.

**Sign out:** `supabase.auth.signOut()` → `SIGNED_OUT` event triggers redirect.

**Sidebar state:** `sidebarOpen` (bool), default `true`. Width animates `224px ↔ 64px` over `0.22s ease`.

**NAV array** (drives sidebar links):
```js
[
  { href: "/admin/dashboard",            label: "Dashboard" },
  { href: "/admin/dashboard/categories", label: "Categories" },
  { href: "/admin/dashboard/products",   label: "Products" },    // ⚠️ BUG
  { href: "/admin/dashboard/inquiries",  label: "Inquiries",     // ⚠️ BUG
    badge: "inquiries" },
]
```

**Active detection:** `pathname === item.href` OR (for non-dashboard items) `pathname.startsWith(item.href)`

**Special case:** `pathname === "/admin/login"` → layout skips rendering, returns `<>{children}</>` directly.

**Header breadcrumb:** `Admin / {pathname.split("/").pop()}` (capitalizes last path segment)

**Badge styling:** Amber `#E5A020` pill, appears in both sidebar (next to label) and top bar (as clickable notification).

---

### Login Page (`app/admin/login/page.jsx`)

- **Auth method**: `supabase.auth.signInWithPassword({ email, password })`
- **On success**: `router.push("/admin/dashboard")`
- **Email input**: `type="email"`, placeholder `"admin@hrpindustrial.in"`
- **Password input**: `type="password"` with toggle to `type="text"` (eye icon button)
- **Error display**: Red banner `rgba(220,38,38,0.1)` with `#FCA5A5` text
- **Loading state**: Button shows spinner + "Signing in…", disabled
- **Background**: `#0E1520` with radial gradient glow at top `rgba(43,126,161,0.25)`
- **Card**: `max-width: 400px`, glassmorphism `rgba(255,255,255,0.04)`, `blur(16px)`, 20px border-radius
- **Footer note**: "This page is not publicly linked. Admin access only."

---

### Dashboard Overview (`app/admin/dashboard/page.jsx`)

**Stat Cards** (uses local `StatCard` component):
| Label | Color | Links To |
|---|---|---|
| Categories | `#2B7EA1` | `/admin/dashboard/categories` |
| Products | `#8DC63F` | `/admin/dashboard/product` ← (singular, correct link) |
| Inquiries | `#E5A020` | `/admin/dashboard/inquiries` ← (404, page missing) |

**Action Cards** (uses local `ActionCard` component):
| Title | Links To |
|---|---|
| Manage Categories | `/admin/dashboard/categories` |
| Manage Products | `/admin/dashboard/product` |
| View Inquiries | `/admin/dashboard/inquiries` ← (404) |

**Activity Feed** (`ActivityFeed` component): Merges last 4 of each: categories, products, inquiries. Sorted by `created_at` descending, shows top 8. Each entry: colored icon, label, sub-text (slug/phone/category), relative time via `timeAgo()`.

**`timeAgo(ts)` logic**: `< 1min → "just now"`, `< 60min → "${m}m ago"`, `< 24h → "${h}h ago"`, else `"${d}d ago"`.

**Status bar**: Green pulsing dot + "All systems operational — Supabase connected"

---

### Categories CRUD (`app/admin/dashboard/categories/page.jsx`)

**`slugify(str)`**: `str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")`

**State variables:**
- `categories[]`, `loading`, `drawerOpen`, `editing` (null=add mode, object=edit mode)
- `deleteConfirm` (id waiting second click), `saving`, `toast`, `imageUploading`, `search`
- `form: { name, slug, description, icon, image_url, sort_order }`

**Table columns**: Image (40×40), Name/Slug, Description (truncated), Sort Order, Actions

**Auto-slug**: On name change in ADD mode, slug auto-generates. In EDIT mode, slug stays manual.

**Image upload**: 
- Storage bucket: `"category-images"`
- Path: `categories/${Date.now()}.${ext}`
- `upsert: true`
- Supports drag-and-drop + click-to-upload + paste URL
- Recommended size: 800×500px, formats JPG/PNG/WebP

**Two-click delete**: First click sets `deleteConfirm = id` (button turns red, says "Confirm?"). Times out after 3000ms. Second click within 3s executes `DELETE`.

**Toast system**: Bottom-right fixed, green (#14532d) or red (#7f1d1d), auto-dismisses after 3000ms.

**Drawer**: 440px wide, slides from right. `transform: translateX(0/100%)`, transition `0.28s cubic-bezier(0.25,0.46,0.45,0.94)`. Dark overlay dismisses on click.

**Form fields in Drawer**: Category Name*, Slug*, Description (textarea), Icon (emoji), Category Image (upload zone + URL input + preview), Sort Order (number).

---

### Products CRUD (`app/admin/dashboard/product/page.jsx`)

> ⚠️ **File is at `product/page.jsx` (singular)** but the file header comment says `products/page.jsx`. The admin sidebar links to `/admin/dashboard/products` (plural) — causing a 404.

**`EMPTY` form default:**
```js
{
  name: "", slug: "", category_slug: "", subcategory_id: "",
  subcategory_name: "", description: "", brand: "", model_number: "",
  image_url: "", gallery_urls: [], specs: [], is_featured: false, sort_order: 0
}
```

**State variables:**
- Data: `categories[]`, `subcategories[]`, `products[]`, `loading`
- Filters: `activeCat` (default `"all"`), `activeSubcat` (default `"all"`), `search`
- Product drawer: `open`, `editId`, `form`, `slugManual`, `saving`, `saveErr`
- Subcategory drawer: `subcatDrawerOpen`, `subcatForm`, `subcatSaving`, `subcatErr`, `editSubcatId`
- Delete: `deletePending` (id), `delTimer` (ref to timeout)
- Image: `imgUploading`, `galleryUploading`, `imgRef`, `galleryRef`

**Slug auto-generation**: Tracks `slugManual` bool. If `false`, auto-slugifies product name. Once user manually edits slug field, `slugManual = true` and auto-generation stops.

**Category tabs**: Horizontal scrollable tab row `[All | cat1 | cat2 | ...]` with product count badges. Switching tab resets `activeSubcat` to `"all"`.

**Subcategory chips**: Shown only when `activeCat !== "all"`. Each chip shows subcat name + product count. Edit button (pencil ✎) opens subcategory drawer.

**Product table columns**: Product (thumbnail + name + slug), Category (blue badge), Subcategory (text), Brand (text), Status (Featured/Standard badge), Added (timeAgo), Actions (Edit/Delete)

**`timeAgo(ts)` in this file** (slightly different than dashboard version):
`< 60s → "${s}s ago"`, `< 3600s → "${m}m ago"`, `< 86400s → "${h}h ago"`, else `"${d}d ago"`.

**Product drawer sections (in order)**:
1. Product Name* (auto-slugifies)
2. URL Slug* (shows preview: `/products/item/{slug}`)
3. Category* + Subcategory (dependent dropdown, filtered by category)
4. Brand + Model Number (2-col grid)
5. Description (textarea)
6. Specifications builder (key-value pairs, reorderable with ▲▼, deletable with ×)
7. Main Image (upload zone + URL input, 110×110 preview with delete button)
8. Gallery Images (multi-file upload, 68×68 thumbnails with delete)
9. Sort Order + Featured toggle (2-col; toggle uses brand-accent green when on)

**Spec builder internals:**
```js
form.specs = [{ key: string, value: string }, ...]  // array of pairs
// Serialized to DB as: { key1: value1, key2: value2, ... } JSON object
```

**Image upload** (products):
- Bucket: `"product-images"`
- Path: `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
- Gallery: Sequential upload, appends each URL to `gallery_urls` array.

**Save validation**: Name required, Slug required, Category required. Slug uniqueness enforced by DB (`23505` error code = "A product with this slug already exists.").

**Subcategory drawer**: Opens from both "+ Subcategory" header button AND "+ New" link inside product form Category field. Shows list of existing subcats for selected category with Edit/Delete per row.

**Two-click delete** (products): Same pattern as categories — `deletePending` id + 3s timeout + button color change.

---

## 13. Utility Functions (`app/lib/utils.js`)

### `getImageUrl(path: string): string`
```js
// Returns full URL for product-images storage bucket
if (!path) return "/images/placeholder.jpg"
if (path.startsWith("http")) return path   // Already full URL, pass through
return `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
```

### `getWhatsAppUrl(message?: string): string`
```js
// Default message: "Hello! I found your website and would like to make an enquiry."
const number = NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX"
return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
```

### `truncate(str: string, length?: number): string`
```js
// Default length: 120 characters
if (!str) return ""
return str.length > length ? str.slice(0, length) + "…" : str
```

---

## 14. Supabase Client (`app/lib/supabase.js`)

```js
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Check your .env.local file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Single singleton exported as named `supabase`. Used everywhere via `import { supabase } from "@/app/lib/supabase"`.

---

## 15. Path Aliases (`jsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

All internal imports use `@/app/...` resolving to the project root. Examples:
- `@/app/lib/supabase` → `./app/lib/supabase.js`
- `@/app/components/layout/Navbar` → `./app/components/layout/Navbar.jsx`

---

## 16. Static Assets (`public/`)

### Category Images (for `CAT_META` in `products/page.jsx`)
All 11 category PNG images match the slugs used in the database:
`bellows, compressors, hydraulics, instrumentation, lifting, paint, pneumatics, power-tools, rubber, vacuum, valves`

### Brand Images (for `BrandsMarquee` home component)
23 files in `public/images/brands/` — mix of `.jpg`, `.svg`, `.png`.

### Key Images
- `/images/hrp_logo.png` — used in `PageIntro`, `Navbar`
- `/images/hero.png` — used in `HeroSection`

---

## 17. Known Bugs & Structural Issues

### Bug 1: Sidebar Navigation — Plural vs. Singular Path Mismatch

**Severity**: High — causes 404 when clicking "Products" in admin sidebar

**Location**: `app/admin/layout.jsx`, line 33

**Problem**: The `NAV` array links "Products" to `/admin/dashboard/products` (plural), but the actual filesystem directory is `app/admin/dashboard/product/` (singular).

```js
// Current (BROKEN):
{ href: "/admin/dashboard/products", label: "Products" }

// Should be:
{ href: "/admin/dashboard/product", label: "Products" }
```

**Fix**: Change line 33 in `app/admin/layout.jsx` from `"/admin/dashboard/products"` to `"/admin/dashboard/product"`.

---

### Bug 2: Missing Inquiries Admin Page

**Severity**: High — causes 404 when clicking "Inquiries" anywhere in admin

**Affected locations**:
- `app/admin/layout.jsx` line 42: sidebar nav href
- `app/admin/layout.jsx` line 242: top-bar badge link
- `app/admin/dashboard/page.jsx` line 177: Inquiries stat card href
- `app/admin/dashboard/page.jsx` line 190: "View Inquiries" action card href

**Problem**: `/admin/dashboard/inquiries` is linked everywhere but the directory `app/admin/dashboard/inquiries/page.jsx` does not exist.

**Fix**: Create `app/admin/dashboard/inquiries/page.jsx`. It should query the `inquiries` table, display all records with status badge, allow marking as read/resolved, and delete records.

---

### Bug 3: Homepage Featured Products — Wrong Column Name

**Severity**: Medium — featured products may fail silently

**Location**: `app/page.jsx`, line 23

**Problem**: Query selects `'category'` but all other code + schema uses `'category_slug'`.

```js
// Current (may be wrong):
.select('id, slug, name, description, category, image_url')

// Likely correct:
.select('id, slug, name, description, category_slug, image_url')
```

The function wraps the entire call in `try/catch` and returns `[]` on error, so this fails silently.

---

### Issue 4: CompanyJourney BrandsRow Never Renders

**Severity**: Low — feature gap, not a crash

**Location**: `app/components/about/CompanyJourney.jsx`, line 40

**Problem**: The 2015 milestone has `showBrands: false`. The `MilestoneRow` component conditionally renders `<BrandsRow />` only when `m.showBrands` is truthy. Since it's `false`, the brands row never appears.

**Fix**: Change `showBrands: false` to `showBrands: true` to enable the brands grid after the 2015 Chapter III milestone.

---

## 18. Admin Panel Design Inconsistency

The products CRUD page (`app/admin/dashboard/product/page.jsx`) uses a **light-themed** design (white background `#fff`, light grey borders `#F0F0F0`, dark text `#1A2533`) while all other admin pages use a **dark-themed** design (`#0E1520` background, white text, glass-morphism).

This is a visual inconsistency — the products page was likely built separately or at a different time. The categories page is dark-themed; the products page is light-themed.

---

## 19. Next.js Configuration (`next.config.ts`)

```ts
// Minimal config — no image domains, no redirects, no rewrites defined
```

> **Note**: If external images from Supabase storage need to be served through `next/image`, the Supabase storage domain must be added to `images.domains` or `images.remotePatterns` in `next.config.ts`. Currently the project uses standard `<img>` tags for dynamic images and `next/image` only for the HRP logo in `PageIntro`.

---

## 20. Build & Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local   # (if example exists, else create manually)
# Add: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_WHATSAPP_NUMBER

# Start development server (default port 3000)
npm run dev

# Production build
npm run build
npm run start
```

**PostCSS config** (`postcss.config.mjs`): Uses `@tailwindcss/postcss` plugin for Tailwind v4.

---

## 21. Summary of All Immediate Action Items

| Priority | Action | File(s) |
|---|---|---|
| 🔴 Critical | Fix sidebar link: `/products` → `/product` | `app/admin/layout.jsx` L33 |
| 🔴 Critical | Create missing inquiries page | Create `app/admin/dashboard/inquiries/page.jsx` |
| 🟡 Medium | Fix homepage featured products query column name | `app/page.jsx` L23 |
| 🟡 Medium | Unify products CRUD page to dark theme | `app/admin/dashboard/product/page.jsx` |
| 🟢 Low | Enable BrandsRow in CompanyJourney | `app/components/about/CompanyJourney.jsx` L40 |
| 🟢 Low | Add Supabase image domain to next.config.ts | `next.config.ts` |
| 🟢 Low | Replace hardcoded contact info in Footer/Contact | `app/components/layout/Footer.jsx`, `app/contact/page.jsx` |

---

*Report generated: 2026-05-21. All file paths are relative to `c:\projects\hrp-website\`.*
