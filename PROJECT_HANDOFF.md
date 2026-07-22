# HRP Website Project Handoff

Generated: 2026-06-01  
Project root: `C:\projects\hrp-website`  
Package: `hrp-website` v0.1.0

This document is a detailed handoff for other developers and LLM agents. It describes what the project is, how the code is arranged, which data it expects, how the UI behaves, and where the main business rules live.

## 1. Project Summary

HRP is a Next.js App Router website for Hydraulics & Rubber Products, an industrial products supplier based in Visakhapatnam, Andhra Pradesh. The public site presents company history, product categories, searchable product catalog pages, product detail pages, a contact/inquiry form, brand credibility sections, and WhatsApp CTAs. The protected admin area manages categories, products, product subcategories, customer inquiries, and homepage notices.

The app is not a static brochure. It is a Supabase-backed catalog and lead capture system:

- Public users browse categories/products and submit inquiries.
- Admin users sign in with Supabase Auth.
- Admin users manage product data, upload product/category images, import product specs, and respond to inquiries.
- Homepage notices are stored in Supabase and shown as dismissible popups.
- Product spec extraction can call Anthropic Claude Vision through `/api/extract-specs`.
- Inquiry submission stores records in Supabase, sends email through Resend when configured, and opens WhatsApp with a structured message.

Important local instruction from `AGENTS.md`: this project uses Next.js 16.2.6, and the repo explicitly warns that this is not the older Next.js API surface. Before changing Next-specific APIs or routing conventions, inspect the relevant docs under `node_modules/next/dist/docs/`.

## 2. Technology Stack

Runtime dependencies:

| Package | Version | Purpose |
| --- | --- | --- |
| `next` | `16.2.6` | React framework, App Router, server/client components, API routes |
| `react` | `19.2.4` | UI runtime |
| `react-dom` | `19.2.4` | DOM renderer |
| `@supabase/supabase-js` | `^2.105.4` | Database, auth, storage client |
| `@anthropic-ai/sdk` | `^0.98.0` | Vision-based spec extraction API |
| `resend` | `^6.12.4` | Inquiry notification email |
| `framer-motion` | `^12.38.0` | Client-side animations and transitions |
| `lucide-react` | `^1.14.0` | UI icons |
| `xlsx` | `^0.18.5` | Excel spec import in product admin |

Development dependencies:

| Package | Version | Purpose |
| --- | --- | --- |
| `tailwindcss` | `^4` | Utility CSS and theme tokens |
| `@tailwindcss/postcss` | `^4` | Tailwind v4 PostCSS integration |
| `eslint` | `^9` | Linting |
| `eslint-config-next` | `16.2.6` | Next lint config |
| `typescript` | `^5` | Types available, though source files are JS/JSX |
| `cross-env` | `^10.1.0` | Cross-platform env var setting in scripts |

NPM scripts:

```bash
npm run dev      # cross-env NODE_OPTIONS=--max-old-space-size=4096 next dev
npm run build    # next build
npm run start    # next start
npm run lint     # eslint
```

## 3. Environment Variables

Variables referenced by source code:

| Variable | Required | Used by | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `app/lib/supabase.js`, API routes, utilities | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `app/lib/supabase.js`, API routes | Public Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended for server API routes | `/api/send-inquiry`, `/api/categories`, `/api/inquiries/[id]` | Bypasses RLS for server-side inserts/updates/deletes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | WhatsApp links and contact flow | Defaults vary by file, mostly `919014538495` |
| `NEXT_PUBLIC_SITE_URL` | Optional | SEO and JSON-LD | Defaults to `https://hrpindustrial.in` |
| `ANTHROPIC_API_KEY` | Optional unless using spec scan | `/api/extract-specs` | Claude Vision API key |
| `RESEND_API_KEY` | Optional | `/api/send-inquiry` | Enables email notifications |
| `INQUIRY_RECIPIENT` | Optional | `/api/send-inquiry` | Defaults to `info@hrpvizag.com` |

`app/lib/supabase.js` throws at module load if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing. Because many client components import this singleton, missing public Supabase values can break the app very early.

## 4. File Structure

Key files and folders:

```text
app/
  layout.jsx                         Root HTML/body, IntroWrapper, PublicShell
  page.jsx                           Homepage server component
  globals.css                        Tailwind v4 import, theme tokens, shared classes
  sitemap.js                         Sitemap route
  robots.js                          Robots route
  favicon.ico

  lib/
    supabase.js                      Shared Supabase browser/client singleton
    utils.js                         getImageUrl, getWhatsAppUrl, truncate, slugify

  components/
    IntroWrapper.jsx                 Dynamic client-only wrapper for PageIntro
    PageIntro.jsx                    First-paint scan animation
    NoticePopup.jsx                  Homepage notice modal backed by Supabase
    layout/
      Navbar.jsx                     Public fixed nav with products dropdown
      Footer.jsx                     Footer with live/fallback categories
      PublicShell.jsx                Hides public chrome on /admin
      WhatsAppFAB.jsx                Scroll-triggered WhatsApp floating button
    home/
      HeroSection.jsx
      MarqueeStrip.jsx
      StatsStrip.jsx
      CategoryGrid.jsx
      WhyChooseHRP.jsx
      BrandsMarquee.jsx
      FeaturedProducts.jsx
      CTABanner.jsx
    products/
      ProductsCatalog.jsx            Main URL-driven catalog/filter system
      ProductCard.jsx
      FilterSidebar.jsx
      CategoryStrip.jsx
      SubcategoryChips.jsx
    about/
      CompanyJourney.jsx             About hero, intro, timeline
      AboutSections.jsx              Leadership, why HRP, brands, CTA

  about/page.jsx
  contact/
    layout.jsx
    page.jsx
  products/
    layout.jsx
    page.jsx
    [category]/
      layout.jsx
      page.jsx
      [subcategory]/
        layout.jsx
        page.jsx                     Legacy redirect to ?sub=
    item/[id]/
      layout.jsx
      page.jsx                       Product detail; id param is product slug
  admin/
    layout.jsx                       Protected admin shell
    page.jsx                         Redirects to dashboard
    login/page.jsx
    dashboard/
      page.jsx
      categories/page.jsx
      product/page.jsx               Singular route: /admin/dashboard/product
      inquiries/page.jsx
      notice/page.jsx
  api/
    categories/route.js
    send-inquiry/route.js
    extract-specs/route.js
    inquiries/[id]/route.js

public/images/
  hrp_logo.png
  hrp_logo_in.png
  hero.png
  categories/*.png
  brands/*.{png,jpeg,svg}

supabase-storage-setup.sql
supabase-notices-setup.sql
```

Existing older docs remain in `PROJECT_CONTEXT.md` and `project_context_report.md`. This file is the newer handoff based on the current code.

## 5. Architecture Overview

The root layout in `app/layout.jsx` imports global CSS, renders `IntroWrapper`, and wraps the route tree in `PublicShell`.

`PublicShell` is a client component that checks `usePathname()`. For non-admin routes it renders `Navbar`, `Footer`, and `WhatsAppFAB`. For `/admin` routes it renders only the admin page content, so the admin layout can own its own chrome.

The app mixes server and client components:

- Homepage `app/page.jsx` is a server component that fetches featured products directly from Supabase and passes them to a client component.
- Most interactive pages are client components because they use Supabase client-side queries, URL query state, animations, and local UI state.
- API routes under `app/api/*/route.js` handle server-side operations that need service role access, external API keys, or email.

Path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Use imports such as `@/app/lib/supabase`.

## 6. Routing

Public routes:

| URL | File | Behavior |
| --- | --- | --- |
| `/` | `app/page.jsx` | Homepage with hero, marquee, stats, category grid, value props, brand marquee, featured products, CTA, notice popup |
| `/about` | `app/about/page.jsx` | Company history, leadership, trust/value sections, brand partners, final CTA |
| `/contact` | `app/contact/page.jsx` | Inquiry form, WhatsApp CTA, contact details, Google Maps embed |
| `/products` | `app/products/page.jsx` | Product catalog shell with URL-driven filters |
| `/products/[category]` | `app/products/[category]/page.jsx` | Category hero plus same catalog locked to that category |
| `/products/[category]/[subcategory]` | `app/products/[category]/[subcategory]/page.jsx` | Legacy redirect to `/products/[category]?sub=[subcategory]` |
| `/products/item/[id]` | `app/products/item/[id]/page.jsx` | Product detail page; despite route name, `[id]` is the product slug |

Admin routes:

| URL | File | Behavior |
| --- | --- | --- |
| `/admin` | `app/admin/page.jsx` | Redirects to `/admin/dashboard` |
| `/admin/login` | `app/admin/login/page.jsx` | Supabase email/password login |
| `/admin/dashboard` | `app/admin/dashboard/page.jsx` | Counts, quick actions, recent activity |
| `/admin/dashboard/categories` | `app/admin/dashboard/categories/page.jsx` | Category CRUD |
| `/admin/dashboard/product` | `app/admin/dashboard/product/page.jsx` | Product and subcategory CRUD |
| `/admin/dashboard/inquiries` | `app/admin/dashboard/inquiries/page.jsx` | Inquiry management |
| `/admin/dashboard/notice` | `app/admin/dashboard/notice/page.jsx` | Homepage popup notice CRUD |

API routes:

| Method and URL | File | Purpose |
| --- | --- | --- |
| `GET /api/categories` | `app/api/categories/route.js` | Returns categories for contact form; falls back to hardcoded list |
| `POST /api/send-inquiry` | `app/api/send-inquiry/route.js` | Saves inquiry, sends Resend email if configured |
| `POST /api/extract-specs` | `app/api/extract-specs/route.js` | Extracts product specs from image with Anthropic Claude |
| `PATCH /api/inquiries/[id]` | `app/api/inquiries/[id]/route.js` | Authenticated inquiry status update |
| `DELETE /api/inquiries/[id]` | `app/api/inquiries/[id]/route.js` | Authenticated inquiry delete |

## 7. Data Model

The project expects Supabase tables with the following shapes. Some are inferred from queries and SQL setup files.

### `categories`

Used by public nav/footer/catalog, admin category CRUD, dashboard counts, and contact dropdown.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Display name |
| `slug` | URL slug, e.g. `hydraulics` |
| `description` | Category text |
| `icon` | Optional emoji/fallback icon used by admin category UI |
| `image_url` | Public image URL for category hero/cards |
| `sort_order` | Display ordering |
| `created_at` | Dashboard activity and ordering |

Important query patterns:

- `select("id,name,slug").order("sort_order")`
- `select("id,name,slug,image_url,description").order("sort_order")`
- `select("id,name,slug,description,image_url").eq("slug", categorySlug).single()`

### `subcategories`

Used by product admin and public product catalog subcategory chips.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Display label |
| `category_slug` | Parent category slug |
| `created_at` | Optional metadata |

Subcategory public URLs are not stored directly. The app slugifies `name` with `slugify()` and uses the query param `?sub=slugified-name`. When resolving a selected subcategory, `ProductsCatalog` finds the matching subcategory by comparing `slugify(sub.name)` with `searchParams.get("sub")`.

### `products`

Used throughout the catalog and admin product CRUD.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Display product name |
| `slug` | Product detail route slug used in `/products/item/[id]` |
| `category_slug` | Category slug |
| `subcategory_id` | Subcategory relation |
| `subcategory_name` | Denormalized label used on cards/detail |
| `subcategory` | Older/fallback field still read in product detail related cards |
| `description` | Product description |
| `brand` | Brand filter and display badge |
| `model_number` | Model/part number |
| `image_url` | Public URL to main product image |
| `gallery_urls` | JSON array of image URLs |
| `specs` | JSON object of key/value specs |
| `is_featured` | Featured badge and filter; admin toggle |
| `sort_order` | Catalog/admin ordering |
| `created_at` | Dashboard activity, homepage featured ordering |

Important public catalog query:

```js
supabase
  .from("products")
  .select("id,name,slug,brand,model_number,image_url,is_featured,description,category_slug,subcategory_id,subcategory_name", { count: "exact" })
  .order("is_featured", { ascending: false })
  .order("sort_order", { ascending: true })
  .range(offset, offset + PAGE_SIZE - 1)
```

Filters can add category, subcategory, brand list, featured-only, and `or()` search over name, brand, model number, and description.

### `inquiries`

Used by contact form, dashboard, and inquiry admin.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Required submitter name |
| `company` | Optional company |
| `phone` | Required phone |
| `email` | Optional email |
| `category` | Optional category slug |
| `message` | Required inquiry body |
| `status` | `new`, `read`, or `resolved` |
| `created_at` | Sorting and display |

`/api/send-inquiry` inserts with `name`, `company`, `phone`, `email`, `category`, and `message`. Status should default to `new` at the database level.

### `notices`

Created by `supabase-notices-setup.sql`.

| Column | Purpose |
| --- | --- |
| `id` | `bigserial` primary key |
| `title` | Required popup title |
| `message` | Required popup body |
| `type` | `info`, `sale`, `closure`, or `urgent` |
| `cta_label` | Optional button label |
| `cta_link` | Optional CTA URL/path |
| `is_active` | Public popup visibility flag |
| `created_at` | Created timestamp |
| `updated_at` | Auto-updated by trigger |

The public popup fetches the latest active notice:

```js
supabase
  .from("notices")
  .select("id,title,message,type,cta_label,cta_link,updated_at")
  .eq("is_active", true)
  .order("updated_at", { ascending: false })
  .limit(1)
  .maybeSingle()
```

Dismissal is stored in `localStorage` as `hrp_notice_dismissed_id` with value `${id}:${updated_at}`, so editing a notice causes it to appear again.

## 8. Supabase Storage

### `product-images`

Used by product admin main image/gallery uploads. Setup is documented in `supabase-storage-setup.sql`.

Bucket properties from SQL:

- Bucket id/name: `product-images`
- Public read enabled.
- File size limit: 5 MB.
- Allowed MIME types: JPEG, PNG, WebP, GIF, SVG.
- Public read policy for everyone.
- Authenticated insert/update/delete policies for admins.

Product admin upload path:

```js
products/${Date.now()}-${random}.${ext}
```

The admin gets public URLs with:

```js
supabase.storage.from("product-images").getPublicUrl(data.path)
```

Current product cards/detail pages generally expect `image_url` and gallery values to already be full public URLs.

### `category-images`

Used by category admin uploads. The bucket is referenced in code but there is no setup SQL in the repo for it. Category admin uploads to:

```js
categories/${Date.now()}.${ext}
```

Then stores the public URL in `categories.image_url`.

## 9. Design System

Global styling lives in `app/globals.css`.

Fonts:

- Heading: `Syne`
- Body: `Inter`
- About timeline also imports `DM Sans` inside its component-scoped `<style>`.

Tailwind v4 theme tokens:

```css
--color-brand-primary: #2B7EA1;
--color-brand-secondary: #3A4555;
--color-brand-accent: #8DC63F;
--color-brand-dark: #1A2533;
--color-brand-light: #F4F6F8;
--font-heading: "Syne", sans-serif;
--font-body: "Inter", sans-serif;
```

Shared component classes:

- `.navbar-glass`: dark translucent fixed nav with blur and subtle border.
- `.container-hrp`: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- `.btn-accent`: accent green button.
- `.btn-outline`: white outline button.
- `.glass-card`: translucent card surface.
- `.section-label`, `.section-heading`, `.section-heading-light`.
- `.text-gradient`: brand primary-to-accent clipped text.

Visual language:

- Public site uses dark industrial hero sections, blue/green accents, grid textures, directional gradients, product imagery, and restrained frosted panels.
- Catalog/product pages use a dark, high-contrast technical feel.
- Homepage category cards use real category images with dark directional overlays.
- Admin UI uses mostly inline styles with a dark shell: `#0E1520`, translucent panels, colored accent borders.
- Notice popup themes:
  - `info`: blue `#2B7EA1`
  - `sale`: green `#8DC63F`
  - `closure`: amber `#E5A020`
  - `urgent`: red `#ef4444`

## 10. Public Layout Components

### `Navbar.jsx`

Client component.

Behavior:

- Fixed at top.
- Transparent initially, switches to `.navbar-glass` after scrolling more than 24 px, except `/about` starts dark/glass-like because the about page needs readable nav over its hero.
- Main links: Home, About, Products, Contact.
- Admin pill links to `/admin`.
- Products has a desktop hover dropdown and a mobile accordion.
- Categories are fetched from Supabase: `id, name, slug` ordered by `sort_order`.
- If category fetch fails, categories are empty and the dropdown says "No categories yet".
- Desktop dropdown closes on outside click or Escape and uses a small hover leave delay to avoid flicker.
- Mobile menu locks body scroll and closes on route change.

Important active logic:

- `/` is active only on exact `/`.
- Other nav items use `pathname.startsWith(href)`.
- Active category is parsed from `/products/[category]`.

### `Footer.jsx`

Client component.

Behavior:

- Four columns: brand, quick links, products, contact.
- Attempts to load first six categories from Supabase.
- Falls back to hardcoded categories: bellows, hydraulics, pneumatics, instrumentation, valves, rubber.
- Contact data is hardcoded:
  - Phone: `+91 90145 38495`
  - Email: `info@hrpvizag.com`
  - Address: Shop No G5 & G6, 28-13-20, Brindavan Rd, opp. Vishnu Residency, Suryabagh, Jagadamba Junction, Visakhapatnam - 530020
- WhatsApp CTA uses `getWhatsAppUrl()`.

### `WhatsAppFAB.jsx`

Client component.

Behavior:

- Hidden until user scrolls past 85% of viewport height.
- Appears bottom-right with spring animation.
- Shows tooltip on hover.
- Uses `getWhatsAppUrl("Hello HRP! I would like to make an enquiry.")`.

### `IntroWrapper.jsx` and `PageIntro.jsx`

`IntroWrapper` dynamically imports `PageIntro` with `ssr: false`.

`PageIntro`:

- Client-only first-paint animation.
- Shows centered logo on a dark overlay.
- After 1100 ms, a scan line travels top-to-bottom over 1.4 seconds.
- Overlay is clipped away as the scan line moves.
- Logo fades as scan passes roughly 40-62% of viewport.
- Respects `prefers-reduced-motion: reduce` by skipping animation.
- Uses `z-index` 200-202 and unmounts 160 ms after scan completes.

## 11. Homepage

File: `app/page.jsx`.

Metadata:

- Title: `HRP - Industrial Solutions | SS Bellows, Hoses, Gauges & More`
- Description targets SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves, Fittings.
- Canonical uses `NEXT_PUBLIC_SITE_URL` fallback `https://hrpindustrial.in`.
- Open Graph is configured.

Structured data:

- Organization JSON-LD with name, logo, contact, address.
- Website JSON-LD with `SearchAction` targeting `/products?q={search_term_string}`.

Data fetch:

```js
supabase
  .from("products")
  .select("id, slug, name, description, category_slug, image_url")
  .order("created_at", { ascending: false })
  .limit(4)
```

Note: despite the component name, this fetch currently does not filter `is_featured = true`; it simply takes four latest products.

Section order:

1. `HeroSection`
2. `MarqueeStrip`
3. `StatsStrip`
4. `CategoryGrid`
5. `WhyChooseHRP`
6. `BrandsMarquee`
7. `FeaturedProducts`
8. `CTABanner`
9. `NoticePopup`

### `HeroSection.jsx`

Client component with large full-viewport hero.

Core content:

- Headline: "Industrial Solutions" and "Built to Last"
- Category pills:
  - Hydraulic Hoses & Fittings
  - Pneumatic Hoses & Fittings
  - SS Bellows & Hoses
  - Instrumentation & Valves
  - Vacuum Components
  - Compressors & Accessories
- Tagline: "One Source. Every Solution."
- CTAs:
  - "Explore Products" -> `/products`
  - "Get a Quote on WhatsApp" -> `wa.me`

Visual details:

- Background uses `/images/hero.png`.
- Layered directional dark gradient keeps text readable.
- Bottom vignette supports trust strip readability.
- Fine SVG grain texture.
- Left vertical accent line on large screens.
- Framer Motion word stagger animation.
- Bottom trust strip with four items: Quality Assured, Wide Product Range, Expert Support, Reliable Delivery.

### `MarqueeStrip.jsx`

Server component with CSS-only marquee.

Repeated items:

- SS Bellows
- Hydraulic Hoses
- Pneumatic Hoses
- Pressure Gauges
- Valves
- Fittings

Animation: 28s linear infinite, pauses on hover.

### `StatsStrip.jsx`

Client component.

Stats:

- `44+` Years in Business
- `10k+` Products Listed
- `100k+` Satisfied Clients
- `Pan India` Delivery

Uses `useInView` to animate numeric counters with ease-out cubic. A source comment says to update numbers with real client figures before launch.

### `CategoryGrid.jsx`

Client component with hardcoded 11 category cards:

| Slug | Name | Image |
| --- | --- | --- |
| `instrumentation` | Instrumentation | `/images/categories/instrumentation.png` |
| `pneumatics` | Pneumatics | `/images/categories/pneumatics.png` |
| `hydraulics` | Hydraulics | `/images/categories/hydraulics.png` |
| `vacuum` | Vacuum Components | `/images/categories/vacuum.png` |
| `valves` | Valves | `/images/categories/valves.png` |
| `rubber` | Rubber Products | `/images/categories/rubber.png` |
| `power-tools` | Power Tools & Tools | `/images/categories/power-tools.png` |
| `compressors` | Compressors | `/images/categories/compressors.png` |
| `paint` | Paint Equipment | `/images/categories/paint.png` |
| `lifting` | Tackles & Lifting | `/images/categories/lifting.png` |
| `bellows` | SS Bellows | `/images/categories/bellows.png` |

Each card links to `/products?category={slug}`, not `/products/{slug}`. The catalog understands this query param, but category strip links use the cleaner route.

Design:

- White section.
- Three-column desktop grid.
- Cards are rounded image panels with dark overlays, icon pills, hover zoom, and top accent reveal.
- Last SS Bellows card spans two columns on small screens to avoid orphan layout.

### `WhyChooseHRP.jsx`

Client component.

Feature list:

- Quality Assured Products
- 44+ Years of Experience
- Same-Day Quotations
- Pan-India Delivery
- One Supplier, All Needs
- Dedicated After-Sales Support

Left side includes a 44+ Years Serving Indian Industries badge.

### `BrandsMarquee.jsx`

Client component.

Brand list:

- Pneumax
- Dunlop
- Painter
- Conact
- Piab
- Techno
- Baumer
- Bosch
- Dingli
- Alpha Polymers
- Khaitan
- Wadfow

It triples the brand list for a seamless CSS marquee. Logo cells have fixed 160 x 88 containers. Logos render at fixed height 72 px with max width 150 px. Broken images fall back to uppercase brand text. The marquee pauses on hover.

### `FeaturedProducts.jsx`

Client component.

Receives products from homepage server fetch.

Product cards:

- Link to `/products/item/{product.slug}`.
- Use `next/image`.
- Main image uses `getImageUrl(product.image_url)`; if no image, show Package icon.
- Category badge shows `category_slug`.
- Description is truncated to 90 chars.

If no products are returned:

- Renders four placeholder cards.
- Shows "Products will appear here once added through the admin panel."

### `CTABanner.jsx`

Client component.

Dark CTA section with grid texture and radial glow.

Content:

- Eyebrow: Ready to Order?
- Headline: Get a Fast Quote for Your Industrial Needs
- Copy prompts WhatsApp or inquiry form.
- Buttons:
  - WhatsApp Us Now
  - Send an Enquiry -> `/contact`

## 12. Notice Popup

File: `app/components/NoticePopup.jsx`.

Purpose: Shows a homepage modal for the latest active Supabase notice.

Behavior:

- Fetches `notices` on mount.
- If no active notice or fetch fails, renders nothing.
- Checks `localStorage` key `hrp_notice_dismissed_id`.
- Dismissal key is `${notice.id}:${notice.updated_at}`.
- If not dismissed, waits 600 ms then shows modal.
- Overlay click and close button both dismiss.
- If CTA exists (`cta_label` and `cta_link`), shows primary CTA plus secondary "Maybe later"; otherwise shows "Got it".

Themes:

- `sale`: green, eyebrow "Limited Time Offer".
- `closure`: amber, eyebrow "Important Notice".
- `urgent`: red, eyebrow "Urgent".
- `info`: blue, eyebrow "Announcement".

## 13. Products Catalog

The public catalog is centralized in `app/components/products/ProductsCatalog.jsx`.

`ProductsPage` (`/products`) renders a compact dark hero, `ProductsCatalog`, and a sourcing CTA.

`CategoryPage` (`/products/[category]`) fetches the category by slug, renders a category hero, then passes `lockedCategory={categorySlug}` to `ProductsCatalog`.

Legacy subcategory route:

```js
redirect(`/products/${category}?sub=${subcategory}`);
```

### URL Query State

`ProductsCatalog` reads and writes filters through the URL.

Supported query params:

| Param | Example | Meaning |
| --- | --- | --- |
| `category` | `?category=hydraulics` | Selected category on `/products` only |
| `sub` | `?sub=hoses` | Slugified subcategory name |
| `brand` | `?brand=Bosch&brand=Pneumax` | One or more brand filters |
| `featured` | `?featured=1` | Featured-only filter |
| `q` | `?q=valve` | Text search |

When `lockedCategory` is provided, category selection is disabled and the pathname itself carries category state.

### Data Loading

Initial side data:

- Categories: `id,name,slug,image_url,description` ordered by `sort_order`.
- Brands: all non-null product `brand` values, de-duped and sorted.

When a category is selected:

- Loads subcategories where `category_slug` matches.
- Loads all product `subcategory_id` values for that category to compute counts.

Product pagination:

- Page size: 24.
- Uses Supabase `.range(offset, offset + PAGE_SIZE - 1)`.
- Product count is exact.
- Load more appends to product state.

Sort order:

1. `is_featured` descending.
2. `sort_order` ascending.

### Catalog Components

`FilterSidebar.jsx`:

- Desktop sticky sidebar.
- Mobile slide-out drawer.
- Locks body scroll while mobile drawer is open.
- Shows categories only when not locked.
- Brand checkboxes.
- Featured-only button.
- Clear all button if filters are active.
- Small "Can't find a part?" CTA linking to `/contact`.

`CategoryStrip.jsx`:

- Horizontal scroll chips at the top of `/products`.
- Links to `/products` and `/products/{cat.slug}`.

`SubcategoryChips.jsx`:

- Renders "All Subcategories" plus one chip per subcategory.
- Uses `slugify(sub.name)` for the `sub` URL param.
- Shows product count when available.

`ProductCard.jsx`:

- Dark gradient card with product image, featured badge, brand badge, model number, name, description, and "View Details".
- Links to `/products/item/{slug}`.
- Skeleton has fixed 340 px height.

## 14. Product Detail Page

File: `app/products/item/[id]/page.jsx`.

Important: `[id]` is the product slug, not the numeric ID.

Load flow:

1. Read `params.id` via `useParams()`.
2. Query `products` with `.eq("slug", slug).single()`.
3. Set `activeImage` to product main image.
4. Query category name by `product.category_slug`.
5. Load related products:
   - First: same category and same `subcategory_id`, excluding current product, limit 4.
   - If fewer than 4, fill from same category while excluding already selected IDs.

Rendering:

- Dark breadcrumb bar: Home -> Products -> Category -> Subcategory -> Product.
- Product image gallery:
  - Main square image area.
  - `object-contain` for detail image.
  - Thumbnails if more than one image in main plus gallery.
- Details:
  - Subcategory/category pills.
  - Product name.
  - Brand and model badges.
  - Description.
  - Specs table from `Object.entries(product.specs)`.
- CTAs:
  - Desktop: Send Inquiry and WhatsApp.
  - Mobile: fixed bottom sticky CTA bar.
- Related products grid if any related products exist.

Inquiry URL:

```js
/contact?product=${encodeURIComponent(product.name)}&category=${product.category_slug}
```

WhatsApp message:

```text
Hi, I'm interested in {product.name} ({model_number}). Please share pricing and availability.
```

## 15. About Page

File: `app/about/page.jsx`.

Metadata:

- Title: `About Us | HRP Industrial Products`
- Description: 40+ year journey supplying industrial components across India.

Renders:

1. `CompanyJourney`
2. `AboutSections`

### `CompanyJourney.jsx`

Large client component with embedded CSS.

Sections:

1. About hero:
   - "A Legacy Built on Precision. A Future Built on Trust."
   - Visakhapatnam, Andhra Pradesh, Est. 1983.
2. Who We Are:
   - Explains HRP as a Visakhapatnam-based industrial supply company with four decades of expertise.
3. Timeline:
   - Scroll-driven center spine.
   - Alternating text/image milestone rows.
   - IntersectionObserver reveal animations.
   - Reduced-motion media query disables transitions.

Milestones:

| Year | Label | Summary |
| --- | --- | --- |
| 1980 | The Arrival | Founder Safdar Alimohammed Tambawala relocates from Sidhpur, Gujarat to Visakhapatnam after recognizing Coromandel Coast opportunity |
| 1983 | Foundation | Calcutta Hardware and Tools Co. established as hardware/tools stockist |
| 1996 | Second Generation | Mukarram Safdar Tambawala joins and expands into hydraulic hoses, rubber components, pneumatics, tier-1 brand representation |
| 2000 | Rebranding | Business renamed Hydraulics and Rubber Products |
| 2013 | National Scale | Huzaifa Sheik Shabbir Marhaba builds corporate/national accounts and Pan-India network |
| Today | Present Day | HRP serves demanding industrial verticals with reliability and national reach |

Images are currently remote Unsplash URLs, not local assets.

### `AboutSections.jsx`

Client component.

Sections:

1. Leadership:
   - Safdar Alimohammed Tambawala, Founder, Late.
   - Mukarram Safdar Tambawala, Managing Partner.
   - Huzaifa Sheik Shabbir Marhaba, Director - Corporate & National Accounts.
2. Why HRP:
   - 40+ Years of Excellence.
   - Pan-India Supply Network.
   - Rigorous Quality Standards.
   - 12+ Major Clients.
   - Multi-Generational Leadership.
   - Visakhapatnam's Most Trusted.
3. Brands We Carry:
   - Bosch, Pneumax, Piab, Baumer, Dunlop, Khaitan, Wadfow, Conact, Techno, Painter, Alpha, Dingli.
4. Closing CTA:
   - Contact Us.
   - View Our Products.
   - Stats: 40+ Years Experience, 12+ Major Clients, Pan-India Network, Est. 1983 Visakhapatnam.

## 16. Contact Page

File: `app/contact/page.jsx`.

Client component wrapped in `Suspense` because it uses `useSearchParams()`.

Structured data:

- LocalBusiness JSON-LD with phone, email, address, opening hours, and description.

Constants:

- WhatsApp number: `NEXT_PUBLIC_WHATSAPP_NUMBER` or `919014538495`.
- Site URL: `NEXT_PUBLIC_SITE_URL` or `https://hrpindustrial.in`.
- Google Maps embed points at Hydraulics And Rubber Products, 28-13-20, Brindavan Rd, Jagadamba Junction, Visakhapatnam.

Fallback categories:

- Instrumentation
- Pneumatics
- Hydraulics
- Vacuum Components
- Valves
- Rubber Products
- Power Tools & Tools
- Compressors
- Paint Equipment
- Tackles & Lifting
- SS Bellows
- Other / Not Listed

On mount:

- Reads `?product=` and `?category=`.
- If product exists, pre-fills message:
  `Hi, I'm interested in {product}. Please share pricing and availability.`
- Calls `/api/categories` to replace fallback categories if live data exists.

Form fields:

| Field | Required | State key |
| --- | --- | --- |
| Full Name | Yes | `name` |
| Company Name | No | `company` |
| Phone Number | Yes | `phone` |
| Email Address | No | `email` |
| Product Category | No | `category` |
| Your Inquiry | Yes | `message` |

Submit behavior:

1. Validate required name, phone, message.
2. POST JSON to `/api/send-inquiry`.
3. If successful, parse `{ emailSent }`.
4. Reset form.
5. Show success state:
   - `success` if email sent.
   - `success_no_email` if saved but email was not configured/sent.
6. Open WhatsApp in a new tab with a structured "New Inquiry - HRP Industrial Products" message.

Contact cards:

- WhatsApp Us Now
- Phone: `+91 90145 38495`, Mon-Sat 10am-7pm
- Email: `info@hrpvizag.com`
- Location: Jagadamba Junction, Vizag
- Working Hours: Monday - Saturday, 10:00 AM - 7:00 PM IST

Map section:

- Shows address.
- Embeds Google Maps iframe.
- Provides "Open in Google Maps" link.

## 17. API Routes

### `GET /api/categories`

File: `app/api/categories/route.js`.

Server-side Supabase client:

```js
createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

Returns `id, name, slug` ordered by `sort_order`. If Supabase errors or returns no data, returns a hardcoded fallback list.

### `POST /api/send-inquiry`

File: `app/api/send-inquiry/route.js`.

Request body:

```json
{
  "name": "Customer Name",
  "company": "Optional Company",
  "phone": "+91...",
  "email": "optional@example.com",
  "category": "hydraulics",
  "message": "Requirement..."
}
```

Validation:

- `name`, `phone`, and `message` are required.
- Missing required fields return 400.

Flow:

1. Insert into `inquiries` with trimmed fields.
2. If insert fails, logs the Supabase error but still attempts email.
3. If `RESEND_API_KEY` is missing, returns `{ ok: true, emailSent: false }`.
4. Sends email with Resend:
   - From: `HRP Website <onboarding@resend.dev>`
   - To: `INQUIRY_RECIPIENT` or `info@hrpvizag.com`
   - Reply-To: customer email if provided
   - Subject: `New Inquiry from {name} - {company}`
5. Returns `{ ok: true, emailSent: true }` or `{ ok: true, emailSent: false }`.

The HTML email includes customer details, category, full message, and reply CTAs.

### `POST /api/extract-specs`

File: `app/api/extract-specs/route.js`.

Request body:

```json
{
  "imageBase64": "base64-data-without-data-url-prefix",
  "mediaType": "image/jpeg"
}
```

Validation:

- Missing `imageBase64` returns 400.
- Missing `ANTHROPIC_API_KEY` returns 500.

Anthropic call:

- Model: `claude-haiku-4-5-20251001`.
- Max tokens: 1024.
- Sends image plus prompt requesting a pure JSON array of `{ key, value }`.

Response:

```json
{
  "specs": [
    { "key": "Bore Size", "value": "32 mm" }
  ]
}
```

Parsing:

- Extracts the first JSON array with regex, so markdown code fences still work.
- Invalid JSON or no array returns `{ specs: [] }`.
- Sanitizes rows to string `key` and `value`.

### `PATCH /api/inquiries/[id]`

File: `app/api/inquiries/[id]/route.js`.

Security:

- Requires `Authorization: Bearer <access_token>`.
- Validates the token with `supabase.auth.getUser(token)`.
- Uses service role if available to bypass RLS.

Body:

```json
{ "status": "read" }
```

Allowed status values:

- `new`
- `read`
- `resolved`

Invalid/missing auth returns 401. Invalid body/status returns 400. Supabase errors return 500.

### `DELETE /api/inquiries/[id]`

Same auth model as PATCH. Deletes one inquiry by ID.

## 18. Admin Layout and Auth

File: `app/admin/layout.jsx`.

Behavior:

- Client component.
- Skips admin shell if pathname is `/admin/login`.
- On mount calls `supabase.auth.getSession()`.
- If no session, redirects to `/admin/login`.
- If session exists, stores user email and renders admin shell.
- Subscribes to `supabase.auth.onAuthStateChange`; `SIGNED_OUT` redirects to login.
- Fetches count of new inquiries when auth is confirmed and whenever pathname changes.

Shell:

- Dark full-height layout.
- Collapsible sidebar: 224 px open, 64 px collapsed.
- Sidebar routes:
  - Dashboard
  - Categories
  - Products
  - Inquiries, with new inquiry badge
  - Site Notice
- Bottom links:
  - View Site opens `/`.
  - User row with initials and sign-out button.
- Top bar:
  - Sidebar toggle.
  - Breadcrumb based on pathname.
  - New inquiry badge linking to `/admin/dashboard/inquiries`.

Admin login:

- File: `app/admin/login/page.jsx`.
- Supabase `signInWithPassword({ email, password })`.
- On success, pushes `/admin/dashboard`.
- Has password visibility toggle.
- Uses dark glass card, radial glow, inline styles.

## 19. Admin Dashboard

File: `app/admin/dashboard/page.jsx`.

Data loaded with `Promise.all`:

- Category count.
- Product count.
- Inquiry count.
- New inquiry count.
- Latest 4 categories.
- Latest 4 products.
- Latest 4 inquiries.

Dashboard cards:

- Categories -> `/admin/dashboard/categories`, color `#2B7EA1`.
- Products -> `/admin/dashboard/product`, color `#8DC63F`.
- Inquiries -> `/admin/dashboard/inquiries`, color `#E5A020`.

Quick actions:

- Manage Categories.
- Manage Products.
- View Inquiries.
- Site Notice.

Recent activity:

- Merges recent categories, products, and inquiries.
- Sorts descending by `created_at`.
- Shows top 8.

Status bar:

- Green dot and "All systems operational - Supabase connected".

## 20. Admin Categories

File: `app/admin/dashboard/categories/page.jsx`.

Purpose: CRUD for `categories`.

State:

- `categories`
- `loading`
- `drawerOpen`
- `editing`
- `deleteConfirm`
- `saving`
- `toast`
- `imageUploading`
- `search`
- `form`: `name`, `slug`, `description`, `icon`, `image_url`, `sort_order`

Data loading:

```js
supabase.from("categories").select("*").order("sort_order", { ascending: true })
```

Slug behavior:

- Local `slugify` lowercases and replaces non-alphanumeric runs with `-`.
- Add mode auto-generates slug from name.
- Edit mode preserves current slug unless edited.

Image upload:

- Bucket: `category-images`.
- Path: `categories/${Date.now()}.${ext}`.
- Stores public URL in `form.image_url`.
- Shows toast on success/failure.

Save:

- Requires name and slug.
- Payload trims text and casts `sort_order` to number.
- Updates by `editing.id` or inserts new row.

Delete:

- Two-click confirm.
- First click marks `deleteConfirm = id`.
- Resets after 3 seconds.
- Second click deletes row.

UI:

- Search filters by category name or slug.
- Drawer slides from right.
- Toast appears fixed bottom-right for 3 seconds.

## 21. Admin Products and Subcategories

File: `app/admin/dashboard/product/page.jsx`.

Purpose: Full product CRUD plus subcategory CRUD.

Route is singular: `/admin/dashboard/product`.

Initial product form:

```js
{
  name: "",
  slug: "",
  category_slug: "",
  subcategory_id: "",
  subcategory_name: "",
  description: "",
  brand: "",
  model_number: "",
  image_url: "",
  gallery_urls: [],
  specs: [],
  is_featured: false,
  sort_order: 0
}
```

Data loading:

- Categories: `id,name,slug` ordered by `sort_order`.
- Subcategories: `id,name,category_slug` ordered by `name`.
- Products: list fields ordered by `sort_order`, then `created_at` descending.

Filtering in admin:

- `activeCat`, default `all`.
- `activeSubcat`, default `all`.
- `search` over product name, brand, and slug.
- Category tabs show counts.
- Subcategory chips appear when a category is selected.

Product drawer:

- Name and slug.
- Category and subcategory.
- Brand and model number.
- Description.
- Specs builder.
- Main image.
- Gallery images.
- Sort order.
- Featured toggle.

Slug logic:

- `slugManual` starts false in add mode.
- Name changes auto-generate slug until user edits slug.
- Editing an existing product sets `slugManual` true.
- Duplicate slug error code `23505` becomes "A product with this slug already exists."

Save logic:

- Requires name, slug, and category.
- Converts `form.specs` array into a JSON object.
- Stores empty gallery as `null`.
- Stores empty specs as `null`.
- Inserts or updates `products`.

Product delete:

- Two-click delete with 3 second timeout.
- Deletes directly from Supabase client.

Image upload:

- Bucket: `product-images`.
- Path: `products/${Date.now()}-${random}.${ext}`.
- Gets public URL via `getPublicUrl`.
- Main image sets `form.image_url`.
- Gallery upload can accept multiple files and appends URLs.
- Error copy explicitly warns about missing bucket and RLS policies.

Specs builder:

- Manual rows: key/value pairs.
- Add, update, remove, move up, move down.
- Import CSV/TSV/TXT.
- Import Excel `.xlsx`/`.xls` with column A = key, column B = value.
- Import image using `/api/extract-specs`.
- Imports show preview rows.
- Existing specs can append imported rows or replace all rows.

Subcategory drawer:

- Opens from main header "+ Subcategory" or product form "+ New".
- Form fields: category and subcategory name.
- Creates/updates `subcategories`.
- Lists existing subcategories for selected category with edit/delete buttons.
- Deleting a subcategory does not appear to clean up product references; be careful when removing subcategories already assigned to products.

## 22. Admin Inquiries

File: `app/admin/dashboard/inquiries/page.jsx`.

Purpose: Manage customer inquiries from contact form.

Status config:

- `new`: amber
- `read`: blue/teal
- `resolved`: green

State:

- `inquiries`
- `loading`
- `tab`
- `search`
- `toast`
- `deleteConfirm`
- `selected` inquiry for modal

Data loading:

```js
supabase.from("inquiries").select("*").order("created_at", { ascending: false })
```

Stats:

- New count.
- Total count.
- Resolved count currently includes `resolved` and `read`.

Filter tabs:

- All
- New
- Read
- Resolved

Search matches:

- Name
- Company
- Email
- Phone
- Category
- Message

Status updates:

- Calls `/api/inquiries/[id]` with `PATCH`.
- Sends current Supabase session token in Authorization header.
- Optimistically updates local state if server response is OK.

Delete:

- Two-click confirm.
- Calls `/api/inquiries/[id]` with `DELETE` and auth header.
- Removes deleted inquiry from local state.

Detail modal:

- Shows full inquiry.
- Offers buttons to mark read/resolved.
- Shows contact info, company/category/message/date/status.
- Modal status changes update both list and selected modal state.

## 23. Admin Site Notice

File: `app/admin/dashboard/notice/page.jsx`.

Purpose: Manage homepage popup notices.

Notice type options:

- Info (blue)
- Sale (green)
- Closure (amber)
- Urgent (red)

Form fields:

- Notice type.
- Title, max 80 chars.
- Message, max 300 chars.
- CTA label, max 30 chars.
- CTA link.
- Active toggle.

Validation:

- Title required.
- Message required.
- CTA link required if CTA label exists.

Important behavior:

- Only one notice should be active.
- When saving an active notice, page deactivates all others first.
- Toggling a notice active also deactivates other notices.
- Delete is two-click confirm with 3 second timeout.

If `notices` table is missing, the UI tells the user to run `supabase-notices-setup.sql`.

## 24. Utilities

File: `app/lib/utils.js`.

`getImageUrl(path)`:

- If missing, returns `/images/placeholder.jpg`.
- If path starts with `http`, returns path as-is.
- Otherwise builds `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`.

Current admin code usually stores full URLs, so this function is mainly useful for older rows that store storage paths.

`getWhatsAppUrl(message)`:

- Defaults message to `Hello! I found your website and would like to make an enquiry.`
- Uses `NEXT_PUBLIC_WHATSAPP_NUMBER` or `919014538495`.
- Returns encoded `https://wa.me/{number}?text=...`.

`truncate(str, length = 120)`:

- Returns empty string for falsy input.
- Adds ellipsis character if longer than length.

`slugify(str)`:

- Lowercases.
- Replaces non-alphanumeric runs with `-`.
- Trims leading/trailing `-`.

## 25. Static Assets

Key local assets:

- `/images/hrp_logo.png`: main HRP logo used in navbar, footer, intro, admin shell.
- `/images/hrp_logo_in.png`: secondary logo asset.
- `/images/hero.png`: homepage hero product image.
- `/images/categories/*.png`: 11 category images.
- `/images/brands/*`: brand logos, mixed png/jpeg/svg.
- Default Next assets still exist: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.

About timeline images are remote Unsplash URLs. If offline reliability or brand specificity is needed, replace them with local images under `public/images/about/` and update `CompanyJourney.jsx`.

## 26. SEO and Metadata

Root metadata in `app/layout.jsx`:

- Default title: `HRP - Industrial Products`.
- Template: `%s | HRP`.
- General description and keywords.

Homepage metadata in `app/page.jsx` overrides title/description, canonical, Open Graph, and injects Organization + WebSite JSON-LD.

Contact page injects LocalBusiness JSON-LD.

There are route files:

- `app/sitemap.js`
- `app/robots.js`

These should be inspected before changing canonical or public route structure.

## 27. Important Implementation Notes

- Product detail route param `[id]` is a slug. Do not query product by numeric `id` on that page unless intentionally changing the route contract.
- `/admin/dashboard/product` is singular. Some older docs may mention `/products` plural for admin; that is stale.
- Homepage "FeaturedProducts" currently displays latest 4 products, not `is_featured = true`.
- Category cards on homepage link to `/products?category=slug`; category strip links to `/products/slug`; both are supported.
- Subcategory route folders exist, but direct `/products/category/subcategory` is legacy and redirects to query param `?sub=subcategory`.
- `category-images` bucket setup SQL is not present, but code uploads to it.
- Product image storage setup SQL exists only for `product-images`.
- Some strings in source files show encoding artifacts in comments and UI copy. Do not spread those artifacts when editing text.
- Many admin pages use inline styles rather than Tailwind classes. Follow local style when changing admin UI.
- Public components use a mix of Tailwind, inline dynamic styles, and Framer Motion.
- `next/image` is used for product images. Supabase remote image host must be allowed by the active Next image configuration if Next 16 requires it in production.
- Contact submission can "succeed" even if email is not configured, because inquiry insert and WhatsApp are considered enough for success.
- Inquiry update/delete should go through server API routes because service role bypasses RLS.

## 28. Development Workflow

Local development:

```bash
npm install
npm run dev
```

Expected local URL:

```text
http://localhost:3000
```

Build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

Before running admin workflows, ensure:

- Supabase env vars are present.
- Admin user exists in Supabase Auth.
- Required tables exist.
- Storage bucket policies are configured.
- `SUPABASE_SERVICE_ROLE_KEY` is set for server routes that update/delete protected data.

Before testing spec image extraction:

- Set `ANTHROPIC_API_KEY`.
- Use a clear image of a spec table/datasheet.

Before testing inquiry email:

- Set `RESEND_API_KEY`.
- Optionally set `INQUIRY_RECIPIENT`.
- Remember Resend's default onboarding sender may have limitations outside verified domains.

## 29. Suggested Future Cleanup

These are not required to understand the code, but they are useful for future maintainers:

- Add SQL setup for core tables: `categories`, `subcategories`, `products`, and `inquiries`.
- Add setup SQL for `category-images`.
- Normalize contact/company details into one config file or database table; they are currently repeated across homepage JSON-LD, footer, contact page, and email templates.
- Decide whether homepage featured products should be latest products or `is_featured = true`, then align code and label.
- Replace remote Unsplash about timeline images with brand-specific local assets.
- Fix visible encoding artifacts in comments and some UI strings.
- Add test coverage or smoke scripts for `/api/send-inquiry`, `/api/categories`, and inquiry status/delete routes.
- Verify Next 16 image remote patterns for Supabase public storage.

