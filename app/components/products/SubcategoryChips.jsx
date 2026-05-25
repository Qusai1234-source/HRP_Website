"use client";

import { slugify } from "@/app/lib/utils";

export default function SubcategoryChips({ subcategories, counts, activeSlug, onSelect }) {
    if (!subcategories || subcategories.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelect(null)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-body font-semibold transition-all duration-200 ${
                    !activeSlug
                        ? "bg-brand-primary text-white border border-brand-primary"
                        : "text-white/55 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.03]"
                }`}
            >
                All Subcategories
            </button>
            {subcategories.map((sub) => {
                const slug = slugify(sub.name);
                const active = activeSlug === slug;
                const count = counts?.[sub.id];
                return (
                    <button
                        key={sub.id}
                        onClick={() => onSelect(slug)}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-body font-semibold transition-all duration-200 ${
                            active
                                ? "bg-brand-primary text-white border border-brand-primary"
                                : "text-white/55 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.03]"
                        }`}
                    >
                        {sub.name}
                        {count != null && count > 0 && (
                            <span className={`text-[10px] ${active ? "text-white/70" : "text-white/35"}`}>{count}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
