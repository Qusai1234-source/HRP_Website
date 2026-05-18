"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

/* ─── Static category metadata (icons, counts, images, badges) ─── */
const CAT_META = {
    instrumentation: { icon: "⬡", count: "80+ Products", image: "/images/categories/instrumentation.png" },
    pneumatics: { icon: "◈", count: "65+ Products", image: "/images/categories/pneumatics.png" },
    hydraulics: { icon: "◉", count: "70+ Products", image: "/images/categories/hydraulics.png" },
    vacuum: { icon: "◎", count: "40+ Products", image: "/images/categories/vacuum.png" },
    valves: { icon: "◆", count: "90+ Products", image: "/images/categories/valves.png" },
    rubber: { icon: "▣", count: "55+ Products", image: "/images/categories/rubber.png" },
    "power-tools": { icon: "⬟", count: "60+ Products", image: "/images/categories/power-tools.png" },
    compressors: { icon: "◐", count: "30+ Products", image: "/images/categories/compressors.png" },
    paint: { icon: "◑", count: "35+ Products", image: "/images/categories/paint.png" },
    lifting: { icon: "◒", count: "45+ Products", image: "/images/categories/lifting.png" },
    bellows: { icon: "◓", count: "25+ Products", image: "/images/categories/bellows.png" },
};

/* ─── Skeleton Card ─── */
function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
            <div className="w-full h-52 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
            <div className="p-5 space-y-3">
                <div className="h-3.5 bg-gray-100 rounded-full w-1/3 animate-pulse" />
                <div className="h-5 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-3.5 bg-gray-100 rounded-full w-full animate-pulse" />
                <div className="h-3.5 bg-gray-100 rounded-full w-2/3 animate-pulse" />
                <div className="h-9 bg-gray-100 rounded-xl w-2/5 mt-4 animate-pulse" />
            </div>
        </div>
    );
}

/* ─── Product Card (light bg, for product grid) ─── */
function ProductCard({ product, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
        >
            <Link href={`/products/${product.slug}`} className="group flex flex-col h-full">
                <article className="relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-dark/8 hover:border-brand-primary/25">
                    <span className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10 rounded-t-2xl" />
                    <div className="relative w-full h-52 overflow-hidden bg-brand-dark/[0.03]">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-gray-300 font-body">No image</span>
                            </div>
                        )}
                        {product.is_featured && (
                            <span className="absolute top-3 right-3 z-10 bg-brand-accent text-white text-[10px] font-bold font-body tracking-wider uppercase px-2.5 py-1 rounded-full shadow">
                                ✦ Featured
                            </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {product.subcategory && (
                                <span className="text-[11px] font-bold font-body uppercase tracking-wide px-2.5 py-1 rounded-full bg-brand-primary/[0.08] text-brand-primary">
                                    {product.subcategory}
                                </span>
                            )}
                            {product.brand && (
                                <span className="text-[11px] text-gray-400 font-body font-semibold">{product.brand}</span>
                            )}
                        </div>
                        <h3 className="font-heading font-bold text-brand-dark text-[1.05rem] leading-snug mb-2 group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-sm font-body text-gray-400 leading-relaxed line-clamp-2 flex-1">{product.description}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-4 text-brand-primary text-sm font-semibold font-body transition-all duration-200 group-hover:gap-2.5">
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

/* ─── Category Card (dark bg, from old page) ─── */
function CategoryCard({ cat, index }) {
    const meta = CAT_META[cat.slug] || {};
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                href={`/products?category=${cat.slug}`}
                className="group relative block rounded-2xl overflow-hidden cursor-pointer"
                style={{ height: "268px" }}
            >
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${meta.image}')`, backgroundColor: "#0e1a2a" }}
                />

                {/* Overlays */}
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(105deg, rgba(8,14,24,0.92) 0%, rgba(8,14,24,0.6) 55%, rgba(8,14,24,0.2) 100%)" }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(8,14,24,0.9) 0%, transparent 55%)" }}
                />

                {/* Hover top border */}
                <div
                    className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ background: "linear-gradient(90deg, #2B7EA1, #8DC63F)" }}
                />

                {/* Brand badge */}
                {meta.badge && (
                    <div className="absolute top-3 right-3 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[0.55rem] font-body tracking-widest uppercase px-2 py-1 rounded backdrop-blur-sm">
                        {meta.badge}
                    </div>
                )}

                {/* Icon pill */}
                <div
                    className="absolute top-4 left-4 w-9 h-9 rounded-lg flex items-center justify-center text-brand-primary text-lg border border-brand-primary/25"
                    style={{ background: "rgba(43,126,161,0.12)", backdropFilter: "blur(8px)" }}
                >
                    {meta.icon || "◈"}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white/40 font-body text-[0.6rem] tracking-widest uppercase mb-1 group-hover:text-brand-primary/70 transition-colors">
                        {meta.count || "Products"}
                    </p>
                    <h3
                        className="font-heading font-bold text-white mb-2 transition-colors group-hover:text-brand-accent"
                        style={{ fontSize: "1.1rem", lineHeight: 1.2 }}
                    >
                        {cat.name}
                    </h3>
                    <p className="text-white/50 font-body leading-relaxed mb-3 line-clamp-2" style={{ fontSize: "0.75rem" }}>
                        {cat.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-brand-primary text-xs font-body tracking-widest uppercase group-hover:text-brand-accent transition-colors">
                        Browse Products
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

/* ─── Category Card Skeleton ─── */
function CategoryCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden animate-pulse" style={{ height: "268px", backgroundColor: "#0e1a2a" }}>
            <div className="w-full h-full bg-gradient-to-br from-white/[0.04] to-transparent" />
        </div>
    );
}

/* ─── Empty State ─── */
function EmptyState({ searchQuery }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full flex flex-col items-center justify-center py-28 text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-brand-primary/[0.07] border border-brand-primary/10 flex items-center justify-center mb-6">
                <svg className="w-9 h-9 text-brand-primary/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
                </svg>
            </div>
            <h3 className="font-heading font-bold text-brand-dark text-xl mb-2">
                {searchQuery ? "No results found" : "No products listed yet"}
            </h3>
            <p className="text-gray-400 text-sm font-body max-w-xs leading-relaxed">
                {searchQuery
                    ? `No products match "${searchQuery}". Try a different keyword.`
                    : "Products in this category will appear here soon."}
            </p>
            {searchQuery && (
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-brand-primary text-sm font-semibold font-body hover:gap-3 transition-all">
                    Can't find it? Send us an inquiry
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            )}
        </motion.div>
    );
}

/* ─── Main Content ─── */
function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeCategory = searchParams.get("category") || "all";
    const isAll = activeCategory === "all";

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [catLoading, setCatLoading] = useState(true);
    const [catSearch, setCatSearch] = useState(""); // search on "All" view
    const tabsScrollRef = useRef(null);

    // Fetch categories once
    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from("categories")
                .select("id, name, slug, description")
                .order("sort_order", { ascending: true });
            setCategories(data || []);
            setCatLoading(false);
        })();
    }, []);

    // Fetch products when category changes (only when not "all")
    useEffect(() => {
        if (isAll) { setLoading(false); return; }
        setLoading(true);
        setSearchQuery("");
        (async () => {
            const { data } = await supabase
                .from("products")
                .select("id, name, slug, category_slug, subcategory, description, brand, image_url, is_featured, sort_order")
                .eq("category_slug", activeCategory)
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false });
            setProducts(data || []);
            setLoading(false);
        })();
    }, [activeCategory, isAll]);

    const filteredProducts = products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            (p.subcategory || "").toLowerCase().includes(q) ||
            (p.brand || "").toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q)
        );
    });

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(catSearch.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(catSearch.toLowerCase())
    );

    const activeCategoryLabel = isAll
        ? "All Products"
        : (categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory);

    const handleTabClick = (slug) => {
        setCatSearch("");
        setSearchQuery("");
        if (slug === "all") router.push("/products");
        else router.push(`/products?category=${slug}`);
    };

    return (
        <>
            {/* ═══ HERO ═══ */}
            <section className="relative min-h-[58vh] flex items-end bg-brand-dark overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
                <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-brand-primary/[0.18] blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-brand-accent/[0.08] blur-[100px] pointer-events-none" />
                <span
                    aria-hidden="true"
                    className="absolute right-[-2vw] top-1/2 -translate-y-1/2 font-heading font-black leading-none pointer-events-none select-none"
                    style={{ fontSize: "clamp(7rem, 20vw, 16rem)", color: "rgba(43,126,161,0.055)", letterSpacing: "-0.04em" }}
                >
                    PRODUCTS
                </span>

                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-28 pt-32">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="font-body text-brand-primary text-xs tracking-[0.22em] uppercase mb-5 flex items-center gap-2"
                    >
                        <span className="inline-block w-8 h-px bg-brand-primary/60" />
                        Industrial Product Catalogue
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-heading font-black text-white leading-[1.05] mb-5"
                        style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)" }}
                    >
                        Precision Parts.<br />
                        <span className="text-[#8DC63F] drop-shadow-md">Global Brands.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
                        className="font-body text-gray-400 max-w-lg leading-relaxed mb-10"
                        style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)" }}
                    >
                        Browse our comprehensive range across 11 specialised categories — sourced from trusted global manufacturers.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26 }}
                        className="flex flex-wrap gap-3"
                    >
                        {[{ val: "11+", lbl: "Categories" }, { val: "10k+", lbl: "Products" }, { val: "10+", lbl: "Brands" }, { val: "44+", lbl: "Years" }].map((s) => (
                            <div key={s.lbl} className="flex items-center gap-2.5 bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-full px-4 py-2">
                                <span className="font-heading font-bold text-brand-primary text-base">{s.val}</span>
                                <span className="font-body text-gray-400 text-xs">{s.lbl}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ STICKY CATEGORY TABS ═══ */}
            <div className="sticky top-16 z-40 bg-[#0a0f18]/95 backdrop-blur-md border-b border-white/[0.06] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* Fade-out edges and arrow indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0f18] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0f18] via-[#0a0f18]/80 to-transparent z-10 pointer-events-none flex items-center justify-end pr-2">
                        <button
                            suppressHydrationWarning
                            className="pointer-events-auto p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer group"
                            onClick={() => {
                                if (tabsScrollRef.current) {
                                    tabsScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
                                }
                            }}
                            aria-label="Scroll categories right"
                        >
                            <svg className="w-5 h-5 text-white/50 group-hover:text-[#00E5FF] transition-colors animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <div
                        ref={tabsScrollRef}
                        className="flex items-center overflow-x-auto py-0.5 relative z-0"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)",
                            maskImage: "linear-gradient(to right, black 85%, transparent 100%)"
                        }}
                    >
                        {["all", ...(!catLoading ? categories.map((c) => c.slug) : [])].map((slug) => {
                            const label = slug === "all" ? "All" : (categories.find((c) => c.slug === slug)?.name || slug);
                            const isActive = activeCategory === slug;
                            return (
                                <button
                                    key={slug}
                                    suppressHydrationWarning
                                    onClick={() => handleTabClick(slug)}
                                    className={`relative flex-shrink-0 px-4 py-4 text-[13px] font-semibold font-body whitespace-nowrap transition-colors duration-200 ${isActive ? "text-[#00E5FF]" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="hrp-tab-indicator"
                                            className="absolute bottom-0 inset-x-0 h-[3px] bg-brand-primary rounded-full"
                                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                        {catLoading && [80, 110, 75, 95, 60, 85].map((w, i) => (
                            <div key={i} className="flex-shrink-0 mx-2 my-4 rounded-full bg-gray-100 animate-pulse" style={{ width: w, height: 14 }} />
                        ))}
                        {/* Spacer to allow the last item to scroll past the right fade overlay */}
                        <div className="flex-shrink-0 w-20" aria-hidden="true" />
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
          "ALL" VIEW — dark bg, category cards from old page
      ═══════════════════════════════════════════════════════════ */}
            {isAll && (
                <>
                    {/* Search bar styled dark to match section */}
                    <div className="bg-brand-dark border-b border-white/[0.06] sticky top-[57px] z-30 backdrop-blur">
                        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center gap-3">
                            <div className="relative flex-1 max-w-md">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    suppressHydrationWarning
                                    value={catSearch}
                                    onChange={(e) => setCatSearch(e.target.value)}
                                    placeholder="Search categories…"
                                    className="w-full bg-white/[0.08] border border-white/30 rounded-lg pl-11 pr-4 py-2 text-white/90 text-sm font-body placeholder-white/40 focus:outline-none focus:border-[#00E5FF]/60 focus:bg-white/[0.12] transition-all shadow-inner"
                                />
                            </div>
                            <span className="hidden sm:block text-white/30 text-xs font-body tracking-widest uppercase">
                                {catLoading ? "…" : `${filteredCategories.length} Categories`}
                            </span>
                        </div>
                    </div>

                    {/* Category cards grid — dark */}
                    <section className="bg-[#18263A] py-14 lg:py-20">
                        <div className="max-w-7xl mx-auto px-6 lg:px-12">
                            {catLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
                                </div>
                            ) : filteredCategories.length === 0 ? (
                                <div className="text-center py-24">
                                    <p className="text-white/30 font-body text-lg">No categories match &ldquo;{catSearch}&rdquo;</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredCategories.map((cat, i) => (
                                        <CategoryCard key={cat.slug} cat={cat} index={i} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* ═══════════════════════════════════════════════════════════
          CATEGORY VIEW — light bg, product grid
      ═══════════════════════════════════════════════════════════ */}
            {!isAll && (
                <section className="bg-[#F7F8FA] min-h-screen py-10 pb-24">
                    <div className="max-w-7xl mx-auto px-5">
                        {/* Bar: heading + count + search */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-9">
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.h2
                                        key={activeCategory}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        transition={{ duration: 0.25 }}
                                        className="font-heading font-bold text-brand-dark text-xl"
                                    >
                                        {activeCategoryLabel}
                                    </motion.h2>
                                </AnimatePresence>
                                <p className="text-xs font-body text-gray-400 mt-0.5">
                                    {loading ? (
                                        <span className="inline-block w-24 h-3 bg-gray-200 rounded-full animate-pulse" />
                                    ) : (
                                        `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`
                                    )}
                                </p>
                            </div>
                            {/* Search */}
                            <div className="relative w-full sm:w-72 flex-shrink-0">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    suppressHydrationWarning
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products, brands…"
                                    className="w-full pl-11 pr-8 py-2.5 text-sm font-body bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/[0.12] transition-all placeholder:text-gray-300"
                                />
                                {searchQuery && (
                                    <button suppressHydrationWarning onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            <AnimatePresence mode="popLayout">
                                {loading
                                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)
                                    : filteredProducts.length === 0
                                        ? <EmptyState key="empty" searchQuery={searchQuery} />
                                        : filteredProducts.map((product, i) => (
                                            <ProductCard key={product.id} product={product} index={i} />
                                        ))
                                }
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ CTA STRIP ═══ */}
            <section className="relative bg-brand-dark overflow-hidden py-20">
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-primary via-brand-accent to-brand-primary" />
                <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                    <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-3">Can't find what you need?</p>
                    <h2 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
                        We Source It For You
                    </h2>
                    <p className="font-body text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                        Tell us the part, brand, or spec — our team will track it down and deliver it to your door.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold font-body px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/30 group"
                    >
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

/* ─── Page with Suspense wrapper ─── */
export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
                </div>
            }
        >
            <ProductsContent />
        </Suspense>
    );
}