import { supabase } from '@/app/lib/supabase'
import HeroSection from '@/app/components/home/HeroSection'
import MarqueeStrip from '@/app/components/home/MarqueeStrip'
import StatsStrip from '@/app/components/home/StatsStrip'
import CategoryGrid from '@/app/components/home/CategoryGrid'
import WhyChooseHRP from '@/app/components/home/WhyChooseHRP'
import BrandsMarquee from '@/app/components/home/BrandsMarquee'
import FeaturedProducts from '@/app/components/home/FeaturedProducts'
import CTABanner from '@/app/components/home/CTABanner'

// ─── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata = {
  title: 'HRP — Industrial Solutions | SS Bellows, Hoses, Gauges & More',
  description:
    'HRP supplies precision industrial components including SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves and Fittings across India.',
}

// ─── Supabase Data Fetch ─────────────────────────────────────────────────────
async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, category, image_url')
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
    <main className="overflow-x-hidden">
      <HeroSection />
      <MarqueeStrip />
      <StatsStrip />
      <CategoryGrid />
      <WhyChooseHRP />
      <BrandsMarquee />
      <FeaturedProducts products={featuredProducts} />
      <CTABanner />
    </main>
  )
}