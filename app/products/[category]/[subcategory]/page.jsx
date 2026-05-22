"use client";
// src/app/products/[category]/[subcategory]/page.jsx
// Shows all products in a specific subcategory.
// Route: /products/pneumatics/cylinders

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

/* ─── Product Card — dark version ─────────────────────────────────────────── */
function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/item/${product.slug}`} className="group flex flex-col h-full">
        <article className="relative flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.07] transition-all duration-300 hover:border-brand-primary/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
          style={{ background: "linear-gradient(160deg, rgba(43,126,161,0.07) 0%, #0e1820 50%, #0a0f18 100%)" }}
        >
          {/* Hover top border */}
          <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />

          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden bg-brand-dark/50 flex-shrink-0">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
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

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.05] animate-pulse" style={{ height: "340px", backgroundColor: "#0e1820" }}>
      <div className="w-full h-48" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/[0.06] rounded-full w-1/4" />
        <div className="h-5 bg-white/[0.06] rounded-full w-3/4" />
        <div className="h-3 bg-white/[0.06] rounded-full w-full" />
      </div>
    </div>
  );
}

export default function SubcategoryPage() {
  const params = useParams();
  const categorySlug = params.category;
  const subcategorySlug = params.subcategory;

  const [category, setCategory] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug || !subcategorySlug) return;
    (async () => {
      // Fetch category
      const { data: cat } = await supabase
        .from("categories")
        .select("id,name,slug,description")
        .eq("slug", categorySlug)
        .single();
      setCategory(cat);

      // Fetch all products in this category to find subcategory name by slug match
      const { data: allProducts } = await supabase
        .from("products")
        .select("id,name,slug,subcategory,description,brand,model_number,image_url,is_featured,sort_order")
        .eq("category_slug", categorySlug)
        .not("subcategory", "is", null)
        .order("sort_order", { ascending: true });

      // Match subcategory by slugified name
      const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const matched = (allProducts || []).filter(p => slugify(p.subcategory) === subcategorySlug);
      const subName = matched[0]?.subcategory || subcategorySlug;

      setSubcategoryName(subName);
      setProducts(matched);
      setLoading(false);
    })();
  }, [categorySlug, subcategorySlug]);

  const filtered = products.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-brand-dark" style={{ paddingTop: "9rem", paddingBottom: "4rem" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-brand-primary/[0.1] blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-accent/[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center flex-wrap gap-2 text-xs font-body text-white/35 mb-8">
            <Link href="/products" className="hover:text-white/60 transition-colors">Products</Link>
            <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5l7 7-7 7" strokeLinecap="round" /></svg>
            <Link href={`/products/${categorySlug}`} className="hover:text-white/60 transition-colors">{category?.name || categorySlug}</Link>
            <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5l7 7-7 7" strokeLinecap="round" /></svg>
            <span className="text-white/60">{loading ? "…" : subcategoryName}</span>
          </nav>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-body text-brand-primary text-xs tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
            <span className="inline-block w-8 h-px bg-brand-primary/60" />
            {loading ? "…" : category?.name}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="font-heading font-black text-white leading-tight mb-4" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
            {loading ? <span className="inline-block w-56 h-10 bg-white/[0.06] rounded-xl animate-pulse" /> : subcategoryName}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-body text-white/35 text-sm">
            {loading ? "" : `${products.length} product${products.length !== 1 ? "s" : ""} available`}
          </motion.p>
        </div>
      </section>

      {/* ── SEARCH + GRID ── */}
      <section className="bg-[#0a0f18] min-h-screen py-10 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Search + count bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.p key={subcategoryName} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-xs font-body">
                  {loading ? "" : `Showing ${filtered.length} of ${products.length} products`}
                </motion.p>
              </AnimatePresence>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands…"
                className="w-full pl-10 pr-8 py-2.5 text-sm font-body rounded-xl focus:outline-none focus:border-brand-primary/50 transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.8)" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                : filtered.length === 0
                ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full flex flex-col items-center justify-center py-28 text-center">
                    <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mb-6" style={{ background: "rgba(43,126,161,0.08)" }}>
                      <svg className="w-8 h-8 text-brand-primary/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-white text-xl mb-2">{searchQuery ? "No results found" : "No products yet"}</h3>
                    <p className="text-white/30 font-body text-sm max-w-xs leading-relaxed">
                      {searchQuery ? `No products match "${searchQuery}".` : "Products are being added. Check back soon."}
                    </p>
                    <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-brand-primary text-sm font-body font-semibold hover:gap-3 transition-all">
                      Send us an inquiry
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </motion.div>
                )
                : filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
              }
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-brand-dark overflow-hidden py-16">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary via-brand-accent to-brand-primary" />
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-3">Need a custom spec?</p>
          <h2 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}>We Source What You Require</h2>
          <p className="font-body text-white/35 mb-8 max-w-sm mx-auto leading-relaxed text-sm">Can&apos;t find the exact part? Tell us and we&apos;ll source it.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold font-body px-7 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-primary/25 text-sm group">
              Send an Inquiry
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href={`/products/${categorySlug}`} className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-body text-sm px-7 py-3 rounded-xl transition-all">
              ← Back to {category?.name || "Category"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
