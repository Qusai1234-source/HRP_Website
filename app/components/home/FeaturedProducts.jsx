'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package } from 'lucide-react'
import { getImageUrl, truncate } from '@/app/lib/utils'

// ─── Animation variants ───────────────────────────────────────────────────────
const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ─── Single product card ──────────────────────────────────────────────────────
function ProductCard({ product }) {
    const imgSrc = product.image_url ? getImageUrl(product.image_url) : null

    return (
        <motion.div variants={cardVariants}>
            <Link
                href={product.slug ? `/products/item/${product.slug}` : "/products"}
                className="group flex flex-col h-full rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300"
            >
                {/* Image area */}
                <div className="aspect-[4/3] bg-brand-light relative overflow-hidden">
                    {imgSrc ? (
                        <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package size={44} className="text-brand-primary/20" />
                        </div>
                    )}

                    {/* Category badge */}
                    {product.category_slug && (
                        <span
                            className="absolute top-3 left-3 px-2.5 py-1 rounded-full font-body text-xs font-medium text-white capitalize"
                            style={{ background: 'rgba(26,37,51,0.82)', backdropFilter: 'blur(6px)' }}
                        >
                            {product.category_slug.replace(/-/g, ' ')}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-heading text-lg font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors duration-200">
                        {product.name}
                    </h3>

                    {product.description && (
                        <p className="font-body text-brand-secondary/65 text-sm leading-relaxed flex-1 mb-4">
                            {truncate(product.description, 90)}
                        </p>
                    )}

                    <div className="flex items-center gap-1 text-brand-primary font-body text-sm font-semibold group-hover:gap-2 transition-all duration-200 mt-auto">
                        View Details
                        <ArrowRight size={14} />
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

// ─── Skeleton placeholder card ────────────────────────────────────────────────
function PlaceholderCard() {
    return (
        <div className="rounded-2xl overflow-hidden border border-dashed border-gray-200 bg-gray-50/60">
            <div className="aspect-[4/3] bg-gradient-to-br from-brand-light to-gray-100 flex items-center justify-center">
                <Package size={40} className="text-brand-primary/15" />
            </div>
            <div className="p-5 space-y-2.5">
                <div className="h-5 bg-gray-200/80 rounded-md w-3/4" />
                <div className="h-3.5 bg-gray-100 rounded w-full" />
                <div className="h-3.5 bg-gray-100 rounded w-2/3" />
            </div>
        </div>
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FeaturedProducts({ products = [] }) {
    const hasProducts = products.length > 0

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="font-body text-brand-primary font-semibold text-sm tracking-widest uppercase mb-3"
                        >
                            Product Showcase
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="font-heading font-bold text-brand-dark"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                        >
                            Featured Products
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-2 font-body font-semibold text-brand-primary hover:gap-3 transition-all duration-200"
                        >
                            View All Products
                            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                    </motion.div>
                </div>

                {/* Card grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {hasProducts
                        ? products.map((p) => <ProductCard key={p.id} product={p} />)
                        : Array.from({ length: 4 }).map((_, i) => <PlaceholderCard key={i} />)}
                </motion.div>

                {/* Empty state hint */}
                {!hasProducts && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center font-body text-brand-secondary/40 text-sm mt-8"
                    >
                        Products will appear here once added through the admin panel.
                    </motion.p>
                )}
            </div>
        </section>
    )
}
