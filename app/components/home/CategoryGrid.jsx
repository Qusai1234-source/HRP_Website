'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Droplets, Wind, Settings2, Gauge, Layers, Circle } from 'lucide-react'

// ─── Icon map (keyed by slug) ────────────────────────────────────────────────
const ICON_MAP = {
    hydraulics:        Droplets,
    pneumatics:        Wind,
    valves:            Settings2,
    instrumentation:   Gauge,
    'rubber-products': Layers,
    'vacuum-components': Circle,
}

// ─── Fallback (shown if Supabase is unavailable) ─────────────────────────────
const FALLBACK_CATEGORIES = [
    {
        slug: 'hydraulics',
        name: 'Hydraulics',
        description: 'Hydraulic cylinders, motors, actuators, valves, hoses, fittings and filtration for heavy-duty fluid power applications.',
        image_url: '/images/categories/hydraulics.png',
    },
    {
        slug: 'pneumatics',
        name: 'Pneumatics',
        description: 'Cylinders, FRL units, solenoid valves, air preparation equipment and pneumatic fittings for automation systems.',
        image_url: '/images/categories/pneumatics.png',
    },
    {
        slug: 'valves',
        name: 'Valves',
        description: 'Ball, gate, globe, butterfly and solenoid valves for precise flow control across fluid and gas handling systems.',
        image_url: '/images/categories/valves.png',
    },
    {
        slug: 'instrumentation',
        name: 'Instrumentation',
        description: 'Pressure, temperature, flow and level measurement instruments plus calibration and test equipment.',
        image_url: '/images/categories/instrumentation.png',
    },
    {
        slug: 'rubber-products',
        name: 'Rubber Products',
        description: 'Rubber sheets, matting, extrusions, gaskets, O-rings, vibration mounts and moulded rubber components.',
        image_url: '/images/categories/rubber.png',
    },
    {
        slug: 'vacuum-components',
        name: 'Vacuum Components',
        description: 'Vacuum suction cups, pumps, generators, valves and gripping systems for material handling.',
        image_url: '/images/categories/vacuum.png',
    },
]

// ─── Animation ────────────────────────────────────────────────────────────────
const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ─── Single card ──────────────────────────────────────────────────────────────
function CategoryCard({ cat }) {
    const Icon = ICON_MAP[cat.slug] || Settings2
    const image = cat.image_url || `/images/categories/${cat.slug}.png`

    return (
        <motion.div variants={cardVariants} className="col-span-1">
            <Link
                href={`/products/${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer"
                style={{ minHeight: '260px' }}
            >
                {/* ── Background image layer ──
                       Uses next/image rather than a CSS background so these
                       ~2 MB source PNGs are served as resized WebP/AVIF. As raw
                       CSS backgrounds the six tiles alone cost ~11 MB. */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={image}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </div>

                {/* ── Directional overlay — light left-side tint, opens up fast so the
                       product photo stays visible across most of the card ── */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(105deg, rgba(13,21,32,0.80) 0%, rgba(13,21,32,0.58) 30%, rgba(13,21,32,0.26) 58%, rgba(13,21,32,0.04) 100%)',
                    }}
                />

                {/* ── Bottom vignette — tighter and stronger than the diagonal, so the
                       title/description band keeps contrast without hazing the whole card ── */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(13,21,32,0.93) 0%, rgba(13,21,32,0.62) 22%, transparent 52%)',
                    }}
                />

                {/* ── Hover accent line — top edge reveals on hover ── */}
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ background: 'linear-gradient(90deg, #2B7EA1, #8DC63F)' }}
                />

                {/* ── Content ── */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6 min-h-[260px]">

                    {/* Top row — icon */}
                    <div className="flex items-start justify-between">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: 'rgba(43,126,161,0.18)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(43,126,161,0.25)',
                            }}
                        >
                            <Icon size={19} className="text-brand-primary" />
                        </div>
                    </div>

                    {/* Bottom — name + description + CTA */}
                    <div>
                        <h3
                            className="font-heading font-bold text-white mb-2 leading-tight"
                            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.4rem)' }}
                        >
                            {cat.name}
                        </h3>

                        <p className="font-body text-white/55 text-sm leading-relaxed mb-4 max-w-[280px]">
                            {cat.description}
                        </p>

                        <div className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors duration-200">
                            Browse Products
                            <ArrowRight
                                size={14}
                                className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────
// `categories` is fetched server-side in app/page.jsx and passed as a prop.
// Falls back to the static list if the prop is empty (e.g. env vars not set).
export default function CategoryGrid({ categories }) {
    const items = categories?.length ? categories : FALLBACK_CATEGORIES

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section header */}
                <div className="text-center mb-5">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="font-body text-brand-primary font-semibold text-sm tracking-widest uppercase mb-3"
                    >
                        What We Supply
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-heading font-bold text-brand-dark mb-4"
                        style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                    >
                        Product Categories
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="mx-auto h-0.5 w-12 origin-left"
                        style={{ background: '#2B7EA1' }}
                    />
                </div>

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14"
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {items.map((cat) => (
                        <CategoryCard key={cat.slug} cat={cat} />
                    ))}
                </motion.div>

            </div>
        </section>
    )
}
