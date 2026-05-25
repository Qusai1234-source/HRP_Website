"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import ProductsCatalog from "@/app/components/products/ProductsCatalog";

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.category;

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!categorySlug) return;
        (async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("id,name,slug,description,image_url")
                .eq("slug", categorySlug)
                .single();
            if (error || !data) { setNotFound(true); setLoading(false); return; }
            setCategory(data);
            setLoading(false);
        })();
    }, [categorySlug]);

    if (notFound) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-white/20 font-body text-5xl mb-2">404</p>
                <h1 className="font-heading font-bold text-white text-2xl">Category not found</h1>
                <Link href="/products" className="mt-4 text-brand-primary font-body text-sm hover:underline">← Back to Products</Link>
            </div>
        );
    }

    return (
        <>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-brand-dark" style={{ paddingTop: "9rem", paddingBottom: "3rem" }}>
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
                {category?.image_url && (
                    <>
                        <div className="absolute inset-0 bg-center bg-cover opacity-[0.12] pointer-events-none" style={{ backgroundImage: `url('${category.image_url}')` }} />
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(26,37,51,0.98) 40%, rgba(26,37,51,0.7) 100%)" }} />
                    </>
                )}
                <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-brand-primary/[0.1] blur-[120px] pointer-events-none" />
                <span aria-hidden="true" className="absolute right-[-1vw] top-1/2 -translate-y-1/2 font-heading font-black leading-none pointer-events-none select-none hidden lg:block" style={{ fontSize: "clamp(6rem, 14vw, 11rem)", color: "rgba(43,126,161,0.05)", letterSpacing: "-0.04em" }}>
                    {category?.name?.toUpperCase() || ""}
                </span>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                    <nav className="flex items-center gap-2 text-xs font-body text-white/35 mb-6">
                        <Link href="/products" className="hover:text-white/70 transition-colors">Products</Link>
                        <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5l7 7-7 7" strokeLinecap="round" /></svg>
                        <span className="text-white/60">{loading ? "…" : category?.name}</span>
                    </nav>

                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-body text-brand-primary text-xs tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
                        <span className="inline-block w-8 h-px bg-brand-primary/60" />
                        Product Category
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading font-black text-white leading-tight mb-4" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}>
                        {loading ? <span className="inline-block w-64 h-10 bg-white/[0.06] rounded-xl animate-pulse" /> : category?.name}
                    </motion.h1>
                    {category?.description && (
                        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="font-body text-white/45 max-w-xl leading-relaxed" style={{ fontSize: "1rem" }}>
                            {category.description}
                        </motion.p>
                    )}
                </div>
            </section>

            {/* ── CATALOG (locked to this category) ── */}
            <ProductsCatalog lockedCategory={categorySlug} />

            {/* ── CTA ── */}
            <section className="relative bg-brand-dark overflow-hidden py-16 border-t border-white/[0.06]">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary via-brand-accent to-brand-primary" />
                <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                    <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-3">Need something specific?</p>
                    <h2 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}>We Source What You Require</h2>
                    <p className="font-body text-white/35 mb-8 max-w-sm mx-auto leading-relaxed text-sm">Tell us the part, brand, or spec and we&apos;ll get it to you.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold font-body px-7 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-primary/25 text-sm group">
                            Send an Inquiry
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                        <Link href="/products" className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-body text-sm px-7 py-3 rounded-xl transition-all">
                            ← All Categories
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
