"use client";
// src/app/products/[category]/page.jsx
// Shows subcategory cards for a given category.
// Route: /products/pneumatics → shows Cylinders, FRL Units, Solenoid Valves, etc.

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

// ── Subcategory icons map (extend as needed) ────────────────────────────────
const SUBCAT_ICONS = {
  // Pneumatics
  "Cylinders": "⟳", "FRL Units": "◈", "Solenoid Valves": "◉",
  "Fittings & Tubing": "⬡", "Air Preparation": "◐", "Grippers & Clamps": "◆",
  // Instrumentation
  "Pressure Gauges": "◎", "Temperature Instruments": "◑", "Flow Meters": "◒",
  "Level Instruments": "◓", "Transmitters": "⬟", "Sensors": "▣",
  // Hydraulics
  "Hydraulic Hoses": "⬡", "Hose Fittings": "◈", "Hydraulic Cylinders": "⟳",
  "Power Packs": "◉", "Pumps": "◐", "Valves": "◆", "Seals & Accessories": "◎",
  // Vacuum
  "Vacuum Suction Cups": "◎", "Vacuum Generators": "◑", "Vacuum Grippers": "◒",
  "Fittings & Accessories": "⬡", "Lifting Systems": "⬟",
  // Valves
  "Ball Valves": "◉", "Gate Valves": "◆", "Globe Valves": "▣",
  "Butterfly Valves": "◈", "Check Valves": "◐", "Needle Valves": "⬡",
  "Safety & Control": "◓", "Strainers": "⬟",
  // Rubber
  "Rubber Sheets": "▣", "Rubber Hoses": "⬡", "Gaskets": "◎",
  "O-Rings": "◉", "Expansion Joints": "◒", "Moulded Items": "◓",
  // Power Tools
  "Electric Power Tools": "⬟", "Pneumatic Tools": "◈", "Cordless Tools": "◉",
  "Hand Tools": "▣", "Cutting Tools": "◆", "Measuring Tools": "◎",
  "Safety Equipment": "◐",
  // Compressors
  "Reciprocating Compressors": "⟳", "Screw Compressors": "◉",
  "Portable Compressors": "◐", "Air Dryers": "◑", "Accessories": "⬡",
  // Paint
  "Spray Guns": "◒", "Pressure Pots": "◓", "Airless Sprayers": "⬟",
  "Surface Preparation": "▣",
  // Lifting
  "Chain Hoists": "⬟", "Wire Rope Hoists": "◉", "Slings": "◒",
  "Shackles & Hardware": "◆", "Trolleys & Beams": "◐", "Fall Arrestors": "◎",
  // Bellows
  "Expansion Joints (Bellows)": "◑", "Corrugated Hoses": "⬡",
  "Metal Bellows": "◎", "Flexible Connectors": "◒", "Custom Fabricated": "⬟",
};

function SubcategoryCard({ name, slug, categorySlug, productCount, index }) {
  const icon = SUBCAT_ICONS[name] || "◈";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${categorySlug}/${slug}`}
        className="group relative flex flex-col justify-between rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06] transition-all duration-300 hover:border-brand-primary/40"
        style={{
          height: "220px",
          background: "linear-gradient(135deg, rgba(43,126,161,0.08) 0%, rgba(26,37,51,0.9) 60%, #0e1820 100%)",
        }}
      >
        {/* Hover top border */}
        <div className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: "linear-gradient(90deg, #2B7EA1, #8DC63F)" }} />
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(43,126,161,0.12) 0%, transparent 70%)" }} />

        <div className="relative z-10 p-6">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-primary text-xl border border-brand-primary/20 mb-4 transition-all duration-300 group-hover:border-brand-primary/50 group-hover:bg-brand-primary/10" style={{ background: "rgba(43,126,161,0.08)", backdropFilter: "blur(8px)" }}>
            {icon}
          </div>
          <h3 className="font-heading font-bold text-white text-[1.05rem] leading-snug mb-1.5 group-hover:text-brand-accent transition-colors duration-200">
            {name}
          </h3>
          {productCount !== null && (
            <p className="text-white/35 font-body text-xs tracking-widest uppercase">
              {productCount} Product{productCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="relative z-10 px-6 pb-5 flex items-center justify-between">
          <span className="text-brand-primary text-xs font-body tracking-widest uppercase group-hover:text-brand-accent transition-colors">
            View Products
          </span>
          <svg className="w-4 h-4 text-brand-primary/50 transition-all duration-200 group-hover:text-brand-accent group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

function SubcategoryCardSkeleton() {
  return <div className="rounded-2xl animate-pulse border border-white/[0.04]" style={{ height: "220px", backgroundColor: "#0e1820" }} />;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category;

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!categorySlug) return;
    (async () => {
      // Fetch category info
      const { data: cat } = await supabase
        .from("categories")
        .select("id,name,slug,description,image_url")
        .eq("slug", categorySlug)
        .single();

      if (!cat) { setNotFound(true); setLoading(false); return; }
      setCategory(cat);

      // Fetch distinct subcategories in this category
      const { data: products } = await supabase
        .from("products")
        .select("subcategory")
        .eq("category_slug", categorySlug)
        .not("subcategory", "is", null);

      // Count per subcategory
      const counts = {};
      const uniqueSubs = [];
      (products || []).forEach(p => {
        if (!p.subcategory) return;
        if (!counts[p.subcategory]) {
          counts[p.subcategory] = 0;
          uniqueSubs.push(p.subcategory);
        }
        counts[p.subcategory]++;
      });

      setSubcategories(uniqueSubs);
      setProductCounts(counts);
      setLoading(false);
    })();
  }, [categorySlug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0f18] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-white/20 font-body text-5xl mb-2">404</p>
        <h1 className="font-heading font-bold text-white text-2xl">Category not found</h1>
        <Link href="/products" className="mt-4 text-brand-primary font-body text-sm hover:underline">← Back to Products</Link>
      </div>
    );
  }

  // Slugify subcategory name for URL
  const subSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-brand-dark" style={{ paddingTop: "9rem", paddingBottom: "4rem" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        {/* Background image bleed from category */}
        {category?.image_url && (
          <>
            <div className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none" style={{ backgroundImage: `url('${category.image_url}')` }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(26,37,51,0.98) 40%, rgba(26,37,51,0.7) 100%)" }} />
          </>
        )}
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-brand-primary/[0.1] blur-[120px] pointer-events-none" />
        {/* Ghost watermark */}
        <span aria-hidden="true" className="absolute right-[-1vw] top-1/2 -translate-y-1/2 font-heading font-black leading-none pointer-events-none select-none hidden lg:block" style={{ fontSize: "clamp(6rem, 16vw, 13rem)", color: "rgba(43,126,161,0.045)", letterSpacing: "-0.04em" }}>
          {category?.name?.toUpperCase() || ""}
        </span>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/35 mb-8">
            <Link href="/products" className="hover:text-white/70 transition-colors">Products</Link>
            <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5l7 7-7 7" strokeLinecap="round" /></svg>
            <span className="text-white/60">{loading ? "…" : category?.name}</span>
          </nav>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-body text-brand-primary text-xs tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
            <span className="inline-block w-8 h-px bg-brand-primary/60" />
            Product Category
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading font-black text-white leading-tight mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
            {loading ? <span className="inline-block w-64 h-10 bg-white/[0.06] rounded-xl animate-pulse" /> : category?.name}
          </motion.h1>
          {category?.description && (
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="font-body text-white/45 max-w-xl leading-relaxed" style={{ fontSize: "1rem" }}>
              {category.description}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── SUBCATEGORY GRID ── */}
      <section className="bg-[#0a0f18] py-14 lg:py-20 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-brand-primary/50" />
            <p className="font-body text-white/35 text-xs tracking-[0.18em] uppercase">
              {loading ? "Loading…" : `${subcategories.length} Subcategories`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SubcategoryCardSkeleton key={i} />)}
            </div>
          ) : subcategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mb-6" style={{ background: "rgba(43,126,161,0.08)" }}>
                <svg className="w-8 h-8 text-brand-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-2">Products coming soon</h3>
              <p className="text-white/30 font-body text-sm max-w-xs leading-relaxed">Products in this category are being added. Check back soon or send us an inquiry.</p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-brand-primary text-sm font-body font-semibold hover:gap-3 transition-all">
                Send an Inquiry
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {subcategories.map((sub, i) => (
                <SubcategoryCard
                  key={sub}
                  name={sub}
                  slug={subSlug(sub)}
                  categorySlug={categorySlug}
                  productCount={productCounts[sub] ?? null}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-brand-dark overflow-hidden py-16">
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
