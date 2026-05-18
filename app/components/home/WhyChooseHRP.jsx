'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Clock, Truck, Package, Headphones } from 'lucide-react'

// ─── Feature list ─────────────────────────────────────────────────────────────
const FEATURES = [
    {
        Icon: Shield,
        heading: 'Quality Assured Products',
        body: 'We source from trusted manufacturers with ISO-grade quality standards.',
    },
    {
        Icon: Award,
        heading: '44+ Years of Experience',
        body: 'Decades of industrial supply expertise across a wide range of sectors.',
    },
    {
        Icon: Clock,
        heading: 'Same-Day Quotations',
        body: 'Send us your requirement and receive a detailed quote within hours.',
    },
    {
        Icon: Truck,
        heading: 'Pan-India Delivery',
        body: 'Reliable logistics partners ensure timely delivery across all major cities.',
    },
    {
        Icon: Package,
        heading: 'One Supplier, All Needs',
        body: 'Broad product range means you deal with a single trusted source.',
    },
    {
        Icon: Headphones,
        heading: 'Dedicated After-Sales Support',
        body: 'Technical support and assistance available post-purchase.',
    },
]

// ─── Variants ─────────────────────────────────────────────────────────────────
const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const itemVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WhyChooseHRP() {
    return (
        <section className="py-24 bg-brand-light">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── Left column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <p className="font-body text-brand-primary font-semibold text-sm tracking-widest uppercase mb-4">
                            Why Choose Us
                        </p>

                        <h2
                            className="font-heading font-bold text-brand-dark leading-tight mb-6"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                        >
                            Your Trusted{' '}
                            <span className="text-brand-primary">Industrial</span>{' '}
                            Partner
                        </h2>

                        <p className="font-body text-brand-secondary/75 text-lg leading-relaxed mb-10">
                            HRP has been supplying precision industrial components to businesses across India
                            for over a decade. We combine deep product knowledge with reliable service to keep
                            your operations running without interruption.
                        </p>

                        {/* Trust badge */}
                        <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-brand-dark">
                            <span
                                className="font-heading font-bold text-brand-accent"
                                style={{ fontSize: '2rem' }}
                            >
                                44+
                            </span>
                            <div className="border-l border-white/20 pl-4">
                                <p className="font-body text-white text-sm leading-snug">
                                    Years Serving<br />
                                    <span className="text-white/60">Indian Industries</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Right column — staggered feature list ── */}
                    <motion.ul
                        className="space-y-3"
                        variants={listVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {FEATURES.map(({ Icon, heading, body }) => (
                            <motion.li
                                key={heading}
                                variants={itemVariants}
                                className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-brand-primary/20 hover:shadow-sm transition-all duration-200"
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mt-0.5">
                                    <Icon size={18} className="text-brand-primary" />
                                </div>

                                {/* Text */}
                                <div>
                                    <p className="font-body font-semibold text-brand-dark text-sm mb-0.5">{heading}</p>
                                    <p className="font-body text-brand-secondary/65 text-sm leading-relaxed">{body}</p>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>

                </div>
            </div>
        </section>
    )
}