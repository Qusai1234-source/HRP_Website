import { supabase } from '@/app/lib/supabase'
import HeroSection from '@/app/components/home/HeroSection'
import MarqueeStrip from '@/app/components/home/MarqueeStrip'
import StatsStrip from '@/app/components/home/StatsStrip'
import CategoryGrid from '@/app/components/home/CategoryGrid'
import WhyChooseHRP from '@/app/components/home/WhyChooseHRP'
import BrandsMarquee from '@/app/components/home/BrandsMarquee'
import FeaturedProducts from '@/app/components/home/FeaturedProducts'
import CTABanner from '@/app/components/home/CTABanner'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrpindustrial.in";

// ─── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata = {
  title: 'HRP — Industrial Solutions | SS Bellows, Hoses, Gauges & More',
  description:
    'HRP supplies precision industrial components including SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves and Fittings across India.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'HRP — Industrial Solutions | SS Bellows, Hoses, Gauges & More',
    description: 'HRP supplies precision industrial components including SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves and Fittings across India.',
    url: BASE_URL,
    siteName: 'HRP Industrial Products',
    type: 'website',
  },
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HRP Industrial Products",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-98493-04010",
    contactType: "sales",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Telugu"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HRP Industrial Products",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// ─── Supabase Data Fetch ─────────────────────────────────────────────────────
async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, description, category_slug, image_url')
      .order('created_at', { ascending: false })
      .limit(4)

    if (error) throw error
    return data ?? []
  } catch (err) {
    // Gracefully handle missing env keys or schema not yet set up
    console.warn('[HRP] Could not fetch featured products:', err?.message)
    return []
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroSection />
      <MarqueeStrip />
      <StatsStrip />
      <CategoryGrid />
      <WhyChooseHRP />
      <BrandsMarquee />
      <FeaturedProducts products={featuredProducts} />
      <CTABanner />
    </div>
  )
}
