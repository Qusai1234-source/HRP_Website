"use client";
// src/app/products/page.jsx
// Shows 11 category cards. Clicking goes to /products/[category] (subcategory page).

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const CAT_META = {
  instrumentation: { icon: "⬡", count: "80+ Products", image: "/images/categories/instrumentation.png" },
  pneumatics:      { icon: "◈", count: "65+ Products", image: "/images/categories/pneumatics.png" },
  hydraulics:      { icon: "◉", count: "70+ Products", image: "/images/categories/hydraulics.png" },
  vacuum:          { icon: "◎", count: "40+ Products", image: "/images/categories/vacuum.png", badge: "Schmalz" },
  valves:          { icon: "◆", count: "90+ Products", image: "/images/categories/valves.png" },
  rubber:          { icon: "▣", count: "55+ Products", image: "/images/categories/rubber.png" },
  "power-tools":   { icon: "⬟", count: "60+ Products", image: "/images/categories/power-tools.png" },
  compressors:     { icon: "◐", count: "30+ Products", image: "/images/categories/compressors.png" },
  paint:           { icon: "◑", count: "35+ Products", image: "/images/categories/paint.png" },
  lifting:         { icon: "◒", count: "45+ Products", image: "/images/categories/lifting.png" },
  bellows:         { icon: "◓", count: "25+ Products", image: "/images/categories/bellows.png" },
};

function CategoryCard({ cat, index }) {
  const meta = CAT_META[cat.slug] || {};
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ← now links to /products/[category] */}
      <Link
        href={`/products/${cat.slug}`}
        className="group relative block rounded-2xl overflow-hidden cursor-pointer"
        style={{ height: "268px" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${meta.image}')`, backgroundColor: "#0e1a2a" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(8,14,24,0.92) 0%, rgba(8,14,24,0.6) 55%, rgba(8,14,24,0.2) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,14,24,0.9) 0%, transparent 55%)" }} />
        {/* Hover top border */}
        <div className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: "linear-gradient(90deg, #2B7EA1, #8DC63F)" }} />
        {/* Brand badge */}
        {meta.badge && (
          <div className="absolute top-3 right-3 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[0.55rem] font-body tracking-widest uppercase px-2 py-1 rounded backdrop-blur-sm">
            {meta.badge}
          </div>
        )}
        {/* Icon pill */}
        <div className="absolute top-4 left-4 w-9 h-9 rounded-lg flex items-center justify-center text-brand-primary text-lg border border-brand-primary/25" style={{ background: "rgba(43,126,161,0.12)", backdropFilter: "blur(8px)" }}>
          {meta.icon || "◈"}
        </div>
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white/40 font-body text-[0.6rem] tracking-widest uppercase mb-1 group-hover:text-brand-primary/70 transition-colors">
            {meta.count || "Products"}
          </p>
          <h3 className="font-heading font-bold text-white mb-2 transition-colors group-hover:text-brand-accent" style={{ fontSize: "1.1rem", lineHeight: 1.2 }}>
            {cat.name}
          </h3>
          <p className="text-white/50 font-body leading-relaxed mb-3 line-clamp-2" style={{ fontSize: "0.75rem" }}>
            {cat.description}
          </p>
          <span className="inline-flex items-center gap-1.5 text-brand-primary text-xs font-body tracking-widest uppercase group-hover:text-brand-accent transition-colors">
            View Subcategories
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function CategoryCardSkeleton() {
  return <div className="rounded-2xl animate-pulse" style={{ height: "268px", backgroundColor: "#0e1820" }} />;
}

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("categories").select("id,name,slug,description").order("sort_order", { ascending: true });
      setCategories(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[58vh] flex items-end bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-brand-primary/[0.15] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-brand-accent/[0.07] blur-[100px] pointer-events-none" />
        <span aria-hidden="true" className="absolute right-[-2vw] top-1/2 -translate-y-1/2 font-heading font-black leading-none pointer-events-none select-none" style={{ fontSize: "clamp(7rem, 20vw, 16rem)", color: "rgba(43,126,161,0.05)", letterSpacing: "-0.04em" }}>
          PRODUCTS
        </span>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16 pt-36">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-body text-brand-primary text-xs tracking-[0.22em] uppercase mb-5 flex items-center gap-2">
            <span className="inline-block w-8 h-px bg-brand-primary/60" />
            Industrial Product Catalogue
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading font-black text-white leading-[1.05] mb-5" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)" }}>
            Precision Parts.<br /><span className="text-brand-primary">Global Brands.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="font-body text-white/45 max-w-lg leading-relaxed mb-10" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)" }}>
            Browse our 11 specialised categories — sourced from trusted global manufacturers and delivered pan-India.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26 }} className="flex flex-wrap gap-3">
            {[{ val: "11+", lbl: "Categories" }, { val: "500+", lbl: "Products" }, { val: "50+", lbl: "Brands" }, { val: "20+", lbl: "Years" }].map(s => (
              <div key={s.lbl} className="flex items-center gap-2.5 bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-full px-4 py-2">
                <span className="font-heading font-bold text-brand-primary text-base">{s.val}</span>
                <span className="font-body text-white/40 text-xs">{s.lbl}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="bg-[#0a0f18] border-b border-white/[0.06] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white/80 text-sm font-body placeholder-white/25 focus:outline-none focus:border-brand-primary/50 transition-all"
            />
          </div>
          <span className="hidden sm:block text-white/30 text-xs font-body tracking-widest uppercase">
            {loading ? "…" : `${filtered.length} Categories`}
          </span>
        </div>
      </div>

      {/* ── CATEGORY GRID ── */}
      <section className="bg-[#0a0f18] py-14 lg:py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/30 font-body text-lg">No categories match &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((cat, i) => <CategoryCard key={cat.slug} cat={cat} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-brand-dark overflow-hidden py-20">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-primary via-brand-accent to-brand-primary" />
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-3">Can&apos;t find what you need?</p>
          <h2 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>We Source It For You</h2>
          <p className="font-body text-white/40 mb-10 max-w-md mx-auto leading-relaxed">Tell us the part, brand, or spec — our team will track it down and deliver it to your door.</p>
          <Link href="/contact" className="inline-flex items-center gap-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold font-body px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/30 group">
            Send an Inquiry
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
