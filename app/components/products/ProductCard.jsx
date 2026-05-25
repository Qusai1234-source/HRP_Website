"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38, delay: Math.min(index, 7) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link href={`/products/item/${product.slug}`} className="group flex flex-col h-full">
                <article
                    className="relative flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.07] transition-all duration-300 hover:border-brand-primary/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                    style={{ background: "linear-gradient(160deg, rgba(43,126,161,0.07) 0%, rgba(26,37,51,0.9) 50%, rgba(10,15,24,0.98) 100%)" }}
                >
                    <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />

                    <div className="relative w-full h-48 overflow-hidden bg-brand-dark/50 flex-shrink-0">
                        {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-white/15 font-body">No image</span>
                            </div>
                        )}
                        {product.is_featured && (
                            <span className="absolute top-3 right-3 z-10 bg-brand-accent text-white text-[10px] font-bold font-body tracking-wider uppercase px-2.5 py-1 rounded-full">
                                ✦ Featured
                            </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {product.brand && (
                                <span className="text-[11px] text-brand-primary/70 font-body font-semibold bg-brand-primary/[0.08] px-2 py-0.5 rounded">
                                    {product.brand}
                                </span>
                            )}
                            {product.model_number && (
                                <span className="text-[10px] text-white/25 font-mono border border-white/10 px-2 py-0.5 rounded">
                                    {product.model_number}
                                </span>
                            )}
                        </div>
                        <h3 className="font-heading font-bold text-white text-[1rem] leading-snug mb-2 group-hover:text-brand-accent transition-colors duration-200 line-clamp-2">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-sm font-body text-white/35 leading-relaxed line-clamp-2 flex-1">
                                {product.description}
                            </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-4 text-brand-primary text-sm font-semibold font-body transition-all duration-200 group-hover:gap-2.5 group-hover:text-brand-accent">
                            View Details
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-white/[0.05] animate-pulse" style={{ height: "340px", backgroundColor: "rgba(43,126,161,0.06)" }}>
            <div className="w-full h-48" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="p-5 space-y-3">
                <div className="h-3 bg-white/[0.06] rounded-full w-1/4" />
                <div className="h-5 bg-white/[0.06] rounded-full w-3/4" />
                <div className="h-3 bg-white/[0.06] rounded-full w-full" />
            </div>
        </div>
    );
}
