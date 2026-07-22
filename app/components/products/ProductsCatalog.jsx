"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { slugify } from "@/app/lib/utils";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import FilterSidebar from "./FilterSidebar";
import CategoryStrip from "./CategoryStrip";
import SubcategoryChips from "./SubcategoryChips";

const PAGE_SIZE = 24;

function ProductsCatalogInner({ lockedCategory = null }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // ── State derived from URL params ───────────────────────────────────────
    const selectedCategory = lockedCategory || searchParams.get("category") || null;
    const selectedSubSlug = searchParams.get("sub") || null;
    const selectedBrands = useMemo(() => searchParams.getAll("brand"), [searchParams]);
    const featuredOnly = searchParams.get("featured") === "1";
    const search = searchParams.get("q") || "";

    // Local UI state
    const [searchInput, setSearchInput] = useState(search);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Data state
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subCounts, setSubCounts] = useState({});
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // ── Sync search input to URL after debounce ─────────────────────────────
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchInput(search);
    }, [search]);

    const updateParams = useCallback((mutator) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        mutator(params);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, [router, pathname, searchParams]);

    const handleCategoryChange = (slug) => {
        if (lockedCategory) return;
        updateParams(p => {
            if (slug) p.set("category", slug); else p.delete("category");
            p.delete("sub");
        });
    };

    const handleSubcategorySelect = (slug) => {
        updateParams(p => { if (slug) p.set("sub", slug); else p.delete("sub"); });
    };

    const handleBrandToggle = (brand) => {
        updateParams(p => {
            const current = p.getAll("brand");
            p.delete("brand");
            if (current.includes(brand)) {
                current.filter(b => b !== brand).forEach(b => p.append("brand", b));
            } else {
                [...current, brand].forEach(b => p.append("brand", b));
            }
        });
    };

    const handleFeaturedToggle = () => {
        updateParams(p => { if (featuredOnly) p.delete("featured"); else p.set("featured", "1"); });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateParams(p => { if (searchInput.trim()) p.set("q", searchInput.trim()); else p.delete("q"); });
    };

    const handleClearAll = () => {
        const params = new URLSearchParams();
        if (lockedCategory) {
            // keep nothing — pathname carries the category
        }
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const activeFilterCount =
        (!lockedCategory && selectedCategory ? 1 : 0) +
        (selectedSubSlug ? 1 : 0) +
        selectedBrands.length +
        (featuredOnly ? 1 : 0) +
        (search ? 1 : 0);

    // ── Load categories (always) + subcategories (if category selected) ─────
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const [{ data: cats }, brandsRes] = await Promise.all([
                supabase.from("categories").select("id,name,slug,image_url,description").order("sort_order", { ascending: true }),
                supabase.from("products").select("brand").not("brand", "is", null),
            ]);
            if (cancelled) return;
            setCategories(cats || []);
            const brandSet = new Set((brandsRes.data || []).map(r => r.brand).filter(Boolean));
            setBrands(Array.from(brandSet).sort());
        })();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!selectedCategory) {
                setSubcategories([]);
                setSubCounts({});
                return;
            }
            const [{ data: subs }, { data: prods }] = await Promise.all([
                supabase.from("subcategories").select("id,name").eq("category_slug", selectedCategory).order("name"),
                supabase.from("products").select("subcategory_id").eq("category_slug", selectedCategory).not("subcategory_id", "is", null),
            ]);
            if (cancelled) return;
            setSubcategories(subs || []);
            const counts = {};
            (prods || []).forEach(p => { if (p.subcategory_id) counts[p.subcategory_id] = (counts[p.subcategory_id] || 0) + 1; });
            setSubCounts(counts);
        })();
        return () => { cancelled = true; };
    }, [selectedCategory]);

    // Resolve subcategory_id from slug + subcategories list
    const selectedSubId = useMemo(() => {
        if (!selectedSubSlug || subcategories.length === 0) return null;
        const found = subcategories.find(s => slugify(s.name) === selectedSubSlug);
        return found?.id || null;
    }, [selectedSubSlug, subcategories]);

    // ── Build + run products query ──────────────────────────────────────────
    const filterKey = JSON.stringify({
        selectedCategory,
        selectedSubId,
        selectedSubSlug,
        selectedBrands,
        featuredOnly,
        search,
    });

    useEffect(() => {
        // Wait for subcategories to load before querying if a sub is requested
        if (selectedSubSlug && selectedCategory && subcategories.length === 0) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(0);
        loadPage(0, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKey, subcategories.length]);

    async function loadPage(pageIndex, replace) {
        if (pageIndex === 0) setLoading(true); else setLoadingMore(true);
        const offset = pageIndex * PAGE_SIZE;
        let q = supabase
            .from("products")
            .select("id,name,slug,brand,model_number,image_url,is_featured,description,category_slug,subcategory_id,subcategory_name", { count: "exact" })
            .order("is_featured", { ascending: false })
            .order("sort_order", { ascending: true })
            .range(offset, offset + PAGE_SIZE - 1);

        if (selectedCategory) q = q.eq("category_slug", selectedCategory);
        if (selectedSubId) q = q.eq("subcategory_id", selectedSubId);
        else if (selectedSubSlug && selectedCategory) {
            // Subcategory requested but not yet resolved — skip query
            setLoading(false);
            setLoadingMore(false);
            return;
        }
        if (selectedBrands.length > 0) q = q.in("brand", selectedBrands);
        if (featuredOnly) q = q.eq("is_featured", true);
        if (search) {
            const s = search.replace(/[%,]/g, "");
            q = q.or(`name.ilike.%${s}%,brand.ilike.%${s}%,model_number.ilike.%${s}%,description.ilike.%${s}%`);
        }

        const { data, count, error } = await q;
        if (error) {
            console.warn("[ProductsCatalog] Query error:", error.message);
            setProducts([]);
            setTotalCount(0);
        } else {
            setTotalCount(count || 0);
            setProducts(prev => replace ? (data || []) : [...prev, ...(data || [])]);
        }
        setLoading(false);
        setLoadingMore(false);
    }

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        loadPage(next, false);
    };

    const hasMore = products.length < totalCount;

    return (
        <div className="bg-brand-dark">
            {/* Category strip (only when category not locked) */}
            {!lockedCategory && (
                <div className="border-b border-white/[0.05]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
                        <CategoryStrip categories={categories} activeSlug={selectedCategory} />
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10">

                    {/* Filter sidebar (desktop) + drawer (mobile) */}
                    <FilterSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        lockedCategory={lockedCategory}
                        brands={brands}
                        selectedBrands={selectedBrands}
                        onBrandToggle={handleBrandToggle}
                        featuredOnly={featuredOnly}
                        onFeaturedToggle={handleFeaturedToggle}
                        activeFilterCount={activeFilterCount}
                        onClearAll={handleClearAll}
                        mobileOpen={mobileFiltersOpen}
                        onMobileClose={() => setMobileFiltersOpen(false)}
                    />

                    {/* Main column */}
                    <div className="min-w-0">
                        {/* Subcategory chips (only when category is selected) */}
                        {selectedCategory && subcategories.length > 0 && (
                            <div className="mb-6">
                                <SubcategoryChips
                                    subcategories={subcategories}
                                    counts={subCounts}
                                    activeSlug={selectedSubSlug}
                                    onSelect={handleSubcategorySelect}
                                />
                            </div>
                        )}

                        {/* Search + mobile filter button + count */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                            <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                    onBlur={handleSearchSubmit}
                                    placeholder="Search products, brands, model numbers…"
                                    className="w-full pl-10 pr-9 py-2.5 text-sm font-body rounded-xl focus:outline-none focus:border-brand-primary/50 transition-all bg-white/[0.05] border border-white/[0.09] text-white/85 placeholder-white/30"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearchInput(""); updateParams(p => p.delete("q")); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </form>

                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-semibold text-white/70 hover:text-white border border-white/10 bg-white/[0.03] transition-colors"
                            >
                                <SlidersHorizontal size={15} />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-brand-primary text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            <p className="text-white/40 text-xs font-body whitespace-nowrap sm:ml-auto">
                                {loading ? "Loading…" : `${totalCount} product${totalCount !== 1 ? "s" : ""}`}
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            <AnimatePresence mode="popLayout">
                                {loading
                                    ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={`s${i}`} />)
                                    : products.length === 0
                                        ? (
                                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full flex flex-col items-center justify-center py-28 text-center">
                                                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mb-6" style={{ background: "rgba(43,126,161,0.08)" }}>
                                                    <svg className="w-8 h-8 text-brand-primary/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
                                                    </svg>
                                                </div>
                                                <h3 className="font-heading font-bold text-white text-xl mb-2">
                                                    {activeFilterCount > 0 ? "No products match these filters" : "No products yet"}
                                                </h3>
                                                <p className="text-white/35 font-body text-sm max-w-xs leading-relaxed">
                                                    {activeFilterCount > 0
                                                        ? "Try removing a filter or searching for something else."
                                                        : "Products are being added. Check back soon."}
                                                </p>
                                                {activeFilterCount > 0 ? (
                                                    <button onClick={handleClearAll} className="mt-5 text-brand-accent text-sm font-body font-semibold hover:underline">
                                                        Clear all filters
                                                    </button>
                                                ) : (
                                                    <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-brand-primary text-sm font-body font-semibold hover:gap-3 transition-all">
                                                        Send us an inquiry
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </Link>
                                                )}
                                            </motion.div>
                                        )
                                        : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
                                }
                            </AnimatePresence>
                        </div>

                        {/* Load more */}
                        {!loading && hasMore && (
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="inline-flex items-center gap-2.5 border border-brand-primary/40 text-brand-primary hover:bg-brand-primary hover:text-white font-body font-semibold px-8 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                                >
                                    {loadingMore ? "Loading…" : "Load more"}
                                    <span className="text-xs opacity-60">({totalCount - products.length} remaining)</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsCatalog({ lockedCategory = null }) {
    return (
        <Suspense fallback={null}>
            <ProductsCatalogInner lockedCategory={lockedCategory} />
        </Suspense>
    );
}
