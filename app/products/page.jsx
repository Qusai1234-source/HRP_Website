"use client";

import { motion } from "framer-motion";
import ProductsCatalog from "@/app/components/products/ProductsCatalog";

export default function ProductsPage() {
    return (
        <>
            {/* ── HERO (compact) ── */}
            <section className="relative flex items-end bg-brand-dark overflow-hidden" style={{ minHeight: "40vh", paddingTop: "9rem", paddingBottom: "3rem" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
                <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-brand-primary/[0.15] blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-brand-accent/[0.07] blur-[100px] pointer-events-none" />
                <span aria-hidden="true" className="absolute right-[-2vw] top-1/2 -translate-y-1/2 font-heading font-black leading-none pointer-events-none select-none hidden md:block" style={{ fontSize: "clamp(6rem, 16vw, 13rem)", color: "rgba(43,126,161,0.05)", letterSpacing: "-0.04em" }}>
                    PRODUCTS
                </span>
                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12">
                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-body text-brand-primary text-xs tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
                        <span className="inline-block w-8 h-px bg-brand-primary/60" />
                        Industrial Product Catalogue
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading font-black text-white leading-[1.05] mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
                        Precision Parts. <span className="text-brand-primary">Global Brands.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="font-body text-white/45 max-w-xl leading-relaxed" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
                        Browse our catalogue — sourced from trusted global manufacturers and delivered pan-India.
                    </motion.p>
                </div>
            </section>

            {/* ── CATALOG ── */}
            <ProductsCatalog />

            {/* ── CTA ── */}
            <section className="relative bg-brand-dark overflow-hidden py-16 border-t border-white/[0.06]">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-primary via-brand-accent to-brand-primary" />
                <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                    <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-3">Can&apos;t find what you need?</p>
                    <h2 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>We Source It For You</h2>
                    <p className="font-body text-white/40 mb-10 max-w-md mx-auto leading-relaxed">Tell us the part, brand, or spec — our team will track it down and deliver it to your door.</p>
                    <a href="/contact" className="inline-flex items-center gap-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold font-body px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/30 group">
                        Send an Inquiry
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </section>
        </>
    );
}
