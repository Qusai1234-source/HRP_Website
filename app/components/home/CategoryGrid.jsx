'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Gauge, Wind, Circle, Droplets, Vacuum, Wrench, Zap, Layers, PaintBucket, Anchor, Settings2 } from 'lucide-react'

// ─── 11 Categories ────────────────────────────────────────────────────────────
// ⚠️  Add product photos to /public/images/categories/
// Each image should be landscape ~800×500px minimum
// Name files exactly as listed in the `image` field below
const CATEGORIES = [
    {
        slug: 'instrumentation',
        name: 'Instrumentation',
        description: 'Pressure transmitters, flow meters, temperature sensors, level instruments and control panels for precise process measurement.',
        image: '/images/categories/instrumentation.png',
        Icon: Gauge,
        span: 'col-span-1',
    },
    {
        slug: 'pneumatics',
        name: 'Pneumatics',
        description: 'Cylinders, FRL units, solenoid valves, air preparation equipment and pneumatic fittings for automation systems.',
        image: '/images/categories/pneumatics.png',
        Icon: Wind,
        span: 'col-span-1',
    },
    {
        slug: 'hydraulics',
        name: 'Hydraulics',
        description: 'Hydraulic hoses, pumps, cylinders, power packs and couplings for heavy-duty fluid power applications.',
        image: '/images/categories/hydraulics.png',
        Icon: Droplets,
        span: 'col-span-1',
    },
    {
        slug: 'vacuum-components',
        name: 'Vacuum Components',
        description: 'Schmalz vacuum grippers, suction cups, vacuum generators and lifting systems for material handling.',
        image: '/images/categories/vacuum.png',
        Icon: Circle,
        span: 'col-span-1',
    },
    {
        slug: 'valves',
        name: 'Valves',
        description: 'Ball, gate, globe, butterfly and solenoid valves for precise flow control across fluid and gas handling systems.',
        image: '/images/categories/valves.png',
        Icon: Settings2,
        span: 'col-span-1',
    },
    {
        slug: 'rubber-products',
        name: 'Rubber Products',
        description: 'Industrial rubber sheets, hoses, gaskets, O-rings, mounts and custom rubber moulded components.',
        image: '/images/categories/rubber.png',
        Icon: Layers,
        span: 'col-span-1',
    },
    {
        slug: 'power-tools',
        name: 'Power Tools & Tools',
        description: 'Industrial-grade electric, pneumatic and cordless power tools along with hand tools and accessories.',
        image: '/images/categories/power-tools.png',
        Icon: Zap,
        span: 'col-span-1',
    },
    {
        slug: 'compressors',
        name: 'Compressors',
        description: 'Reciprocating, screw and portable air compressors for industrial, workshop and on-site applications.',
        image: '/images/categories/compressors.png',
        Icon: Wind,
        span: 'col-span-1',
    },
    {
        slug: 'paint-products',
        name: 'Paint Equipment',
        description: 'Spray guns, paint pressure pots, air spray systems, HVLP equipment and surface preparation tools.',
        image: '/images/categories/paint.png',
        Icon: PaintBucket,
        span: 'col-span-1',
    },
    {
        slug: 'tackles-lifting',
        name: 'Tackles & Lifting',
        description: 'Chain hoists, wire rope hoists, slings, shackles and material handling equipment for safe industrial lifting.',
        image: '/images/categories/lifting.png',
        Icon: Anchor,
        span: 'col-span-1',
    },
    {
        slug: 'ss-bellows',
        name: 'SS Bellows',
        description: 'Stainless steel expansion joints and corrugated bellows for vibration isolation and thermal movement compensation.',
        image: '/images/categories/bellows.png',
        Icon: Wrench,
        // Last card spans 2 columns so the grid row doesn't look orphaned
        span: 'col-span-1 sm:col-span-2 lg:col-span-1',
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
    return (
        <motion.div variants={cardVariants} className={cat.span}>
            <Link
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer"
                style={{ minHeight: '260px' }}
            >
                {/* ── Background image layer ── */}
                <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                        backgroundImage: `url('${cat.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* ── Directional overlay — heavy left (text), opens right (image) ── */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(105deg, rgba(13,21,32,0.96) 0%, rgba(13,21,32,0.88) 30%, rgba(13,21,32,0.65) 58%, rgba(13,21,32,0.25) 100%)',
                    }}
                />

                {/* ── Bottom vignette so text never fights the image ── */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(13,21,32,0.85) 0%, transparent 45%)',
                    }}
                />

                {/* ── Hover accent line — top edge reveals on hover ── */}
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ background: 'linear-gradient(90deg, #2B7EA1, #8DC63F)' }}
                />

                {/* ── Content ── */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6 min-h-[260px]">

                    {/* Top row — icon + optional brand badge */}
                    <div className="flex items-start justify-between">
                        {/* Frosted icon pill */}
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: 'rgba(43,126,161,0.18)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(43,126,161,0.25)',
                            }}
                        >
                            <cat.Icon size={19} className="text-brand-primary" />
                        </div>

                        {/* Brand badge (Schmalz etc.) */}
                        {cat.badge && (
                            <span
                                className="font-body text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                                style={{
                                    background: 'rgba(141,198,63,0.15)',
                                    border: '1px solid rgba(141,198,63,0.3)',
                                    color: '#8DC63F',
                                }}
                            >
                                {cat.badge}
                            </span>
                        )}
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

                        <div
                            className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors duration-200"
                        >
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
export default function CategoryGrid() {
    // Split into two rows visually: first 6 and last 5
    // Last row: 5 items in a 5-col or just let CSS grid handle it
    // We use a 3-col grid — rows go 3/3/3/2 naturally
    // The 11th card gets col-span-2 on sm to fill the row gap

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

                    {/* Accent underline */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="mx-auto h-0.5 w-12 origin-left"
                        style={{ background: '#2B7EA1' }}
                    />
                </div>

                {/* Grid — 3 cols, 11 cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14"
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {CATEGORIES.map((cat) => (
                        <CategoryCard key={cat.slug} cat={cat} />
                    ))}
                </motion.div>

            </div>
        </section>
    )
}