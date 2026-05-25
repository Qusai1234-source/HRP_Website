"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

function FilterContent({
    categories,
    selectedCategory,
    onCategoryChange,
    lockedCategory,
    brands,
    selectedBrands,
    onBrandToggle,
    featuredOnly,
    onFeaturedToggle,
    activeFilterCount,
    onClearAll,
}) {
    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="font-body text-brand-primary text-xs tracking-[0.18em] uppercase flex items-center gap-2">
                    <span className="inline-block w-6 h-px bg-brand-primary/60" />
                    Filters
                </p>
                {activeFilterCount > 0 && (
                    <button onClick={onClearAll} className="text-xs font-body text-brand-accent hover:underline">
                        Clear all
                    </button>
                )}
            </div>

            {/* Category (only when not locked to a route) */}
            {!lockedCategory && categories && categories.length > 0 && (
                <div>
                    <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-3">Category</h4>
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => onCategoryChange(null)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                                    !selectedCategory
                                        ? "bg-brand-primary/15 text-brand-accent font-semibold"
                                        : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                                }`}
                            >
                                All categories
                            </button>
                        </li>
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => onCategoryChange(cat.slug)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                                        selectedCategory === cat.slug
                                            ? "bg-brand-primary/15 text-brand-accent font-semibold"
                                            : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Brand */}
            {brands && brands.length > 0 && (
                <div>
                    <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-3">Brand</h4>
                    <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
                        {brands.map((brand) => {
                            const checked = selectedBrands.includes(brand);
                            return (
                                <li key={brand}>
                                    <label className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-white/65 hover:bg-white/[0.04] hover:text-white cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => onBrandToggle(brand)}
                                            className="w-4 h-4 rounded accent-brand-primary"
                                        />
                                        <span className="truncate">{brand}</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Featured */}
            <div>
                <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-3">Status</h4>
                <button
                    onClick={onFeaturedToggle}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-body font-semibold transition-all ${
                        featuredOnly
                            ? "bg-brand-accent text-white"
                            : "text-white/55 hover:text-white border border-white/10 bg-white/[0.03]"
                    }`}
                >
                    <span className="inline-flex items-center gap-2">
                        <Sparkles size={14} />
                        Featured only
                    </span>
                    {featuredOnly && <span className="text-[10px]">✓</span>}
                </button>
            </div>

            {/* CTA card */}
            <div className="border border-white/[0.08] rounded-xl p-5 bg-brand-primary/[0.04]">
                <p className="font-body text-brand-primary text-[10px] tracking-[0.2em] uppercase mb-2">Can't find a part?</p>
                <p className="font-body text-white/55 text-xs leading-relaxed mb-3">We source obscure parts and custom specs across all our categories.</p>
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-brand-accent font-body font-semibold text-xs hover:gap-2 transition-all">
                    Send an inquiry →
                </Link>
            </div>
        </div>
    );
}

export default function FilterSidebar(props) {
    const { mobileOpen, onMobileClose } = props;

    // Lock body scroll when drawer open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = ""; };
        }
    }, [mobileOpen]);

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
                <FilterContent {...props} />
            </aside>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={onMobileClose}
                            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 280, damping: 30 }}
                            className="lg:hidden fixed top-0 bottom-0 left-0 z-50 w-[88%] max-w-sm bg-brand-dark border-r border-white/10 overflow-y-auto p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading font-bold text-white text-lg">Filters</h3>
                                <button onClick={onMobileClose} className="p-2 text-white/60 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <FilterContent {...props} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
