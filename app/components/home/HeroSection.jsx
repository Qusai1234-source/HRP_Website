'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Layers, Headphones, Truck } from 'lucide-react'

// ─── Trust strip ──────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
    { Icon: ShieldCheck, label: 'Quality Assured' },
    { Icon: Layers, label: 'Wide Product Range' },
    { Icon: Headphones, label: 'Expert Support' },
    { Icon: Truck, label: 'Reliable Delivery' },
]

// ─── Animation helpers ────────────────────────────────────────────────────────
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const wordVariants = {
    hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
    visible: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: 'easeOut' },
})

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919849304010'
    const waUrl = `https://wa.me/${phone}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20your%20products.`

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-brand-dark">

            {/* ════════════════════════════════════════════════════════════
          BACKGROUND — product image + directional gradient overlay

          The image fills the whole section. A steep angled gradient
          burns it almost black on the left (text stays legible) and
          opens it up on the right so the products read clearly.
          This is the same technique used in high-end automotive /
          industrial brand sites.

          Save image → public/images/hero-product.png
          ════════════════════════════════════════════════════════════ */}
            <div
                aria-hidden
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        // Layer 1 — directional burn: opaque dark left → nearly transparent right
                        'linear-gradient(105deg, rgba(17,25,36,1) 0%, rgba(17,25,36,0.97) 28%, rgba(17,25,36,0.80) 48%, rgba(17,25,36,0.30) 72%, rgba(17,25,36,0.10) 100%),' +
                        // Layer 2 — bottom vignette for trust strip legibility
                        'linear-gradient(to top, rgba(17,25,36,0.95) 0%, transparent 22%),' +
                        // Layer 3 — product photo
                        "url('/images/hero.png')",
                    backgroundSize: 'cover, cover, cover',
                    backgroundPosition: 'center, center, center right',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Subtle brand-blue atmospheric glow — left mid */}
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 45% 60% at 12% 48%, rgba(43,126,161,0.18) 0%, transparent 70%)',
            }} />

            {/* Fine grain texture — breaks up flat dark areas */}
            <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage:
                    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                backgroundSize: '200px 200px',
            }} />

            {/* Left vertical accent — a single brand-blue hairline */}
            <div aria-hidden className="absolute top-0 bottom-0 left-[max(48px,5vw)] w-px hidden lg:block" style={{
                background: 'linear-gradient(to bottom, transparent, rgba(43,126,161,0.5) 20%, rgba(43,126,161,0.5) 80%, transparent)',
            }} />

            {/* ════════════════════════════════════════════════════════════
          CONTENT
          ════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 flex-1 flex items-center">
                <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 py-32 lg:py-0">
                    <div className="flex items-center min-h-[86vh]">

                        {/* Text block — left-anchored, max width constrains it away from products */}
                        <div className="w-full max-w-[600px] pt-10">

                            {/* Year / credential badge — replaces generic eyebrow pill */}
                            <motion.div
                                {...fadeUp(0.1)}
                                className="flex items-center gap-4 mb-10"
                            >
                                <div
                                    className="font-heading font-bold text-brand-accent"
                                    style={{ fontSize: '0.7rem', letterSpacing: '0.25em' }}
                                >
                                    EST. 1983
                                </div>
                                <div className="flex-1 h-px max-w-[48px]" style={{ background: 'rgba(141,198,63,0.5)' }} />
                                <div
                                    className="font-body text-white/40 uppercase"
                                    style={{ fontSize: '0.65rem', letterSpacing: '0.22em' }}
                                >
                                    Industrial Products
                                </div>
                            </motion.div>

                            {/* Headline — stacked lines, no word wrap mid-word */}
                            <motion.h1
                                className="font-heading font-bold text-white leading-[1.0] mb-8 tracking-tight"
                                style={{ fontSize: 'clamp(3rem, 6.5vw, 5.6rem)' }}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Line 1 — white */}
                                <span className="block overflow-hidden">
                                    {['Industrial', 'Solutions'].map((w) => (
                                        <motion.span key={w} variants={wordVariants} className="inline-block mr-[0.18em]">
                                            {w}
                                        </motion.span>
                                    ))}
                                </span>

                                {/* Line 2 — accent green, italic weight for differentiation */}
                                <span className="block overflow-hidden">
                                    {['Built', 'to', 'Last'].map((w) => (
                                        <motion.span key={w} variants={wordVariants} className="inline-block mr-[0.18em] text-brand-accent italic">
                                            {w}
                                        </motion.span>
                                    ))}
                                </span>
                            </motion.h1>

                            {/* Category pills */}
                            <motion.div {...fadeUp(0.8)} className="mb-5">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        'Hydraulic Hoses & Fittings',
                                        'Pneumatic Hoses & Fittings',
                                        'SS Bellows & Hoses',
                                        'Instrumentation & Valves',
                                        'Vacuum Components',
                                        'Compressors & Accessories',
                                    ].map((item) => (
                                        <span
                                            key={item}
                                            className="font-body text-white/75 text-xs tracking-wide px-3 py-1.5 rounded-full"
                                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Tagline — brand-accented prefix mark */}
                            <motion.div {...fadeUp(0.95)} className="flex items-center gap-3 mb-11">
                                <span className="text-brand-accent font-heading font-bold text-xl select-none">—</span>
                                <span className="font-body text-white/75 text-base tracking-widest uppercase" style={{ letterSpacing: '0.18em', fontSize: '0.8rem' }}>
                                    One Source.&ensp;Every Solution.
                                </span>
                            </motion.div>

                            {/* CTAs */}
                            <motion.div {...fadeUp(1.1)} className="flex flex-wrap gap-3">

                                {/* Solid primary */}
                                <Link
                                    href="/products"
                                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-primary text-white font-body font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 text-sm"
                                >
                                    Explore Products
                                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>

                                {/* WhatsApp — outlined accent */}
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 border border-brand-accent/80 text-brand-accent font-body font-semibold rounded-lg hover:bg-brand-accent hover:border-brand-accent hover:text-brand-dark transition-all duration-200 text-sm" style={{ background: 'rgba(141,198,63,0.06)' }}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Get a Quote on WhatsApp
                                </a>

                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
          TRUST STRIP — frosted glass bar at bottom
          ════════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="relative z-10"
                style={{
                    background: 'rgba(17,25,36,0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-2 md:grid-cols-4">
                        {TRUST_ITEMS.map(({ Icon, label }, i) => (
                            <div
                                key={label}
                                className="flex items-center justify-center gap-2.5 py-4"
                                style={{
                                    borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                }}
                            >
                                <Icon size={16} className="text-brand-primary flex-shrink-0" />
                                <span className="font-body text-white/45 text-xs font-medium tracking-wide">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

        </section>
    )
}