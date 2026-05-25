"use client";

import Link from "next/link";

export default function CategoryStrip({ categories, activeSlug }) {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                <Link
                    href="/products"
                    className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 ${
                        !activeSlug
                            ? "bg-brand-primary text-white border border-brand-primary"
                            : "text-white/60 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.03]"
                    }`}
                >
                    All
                </Link>
                {categories.map((cat) => {
                    const active = activeSlug === cat.slug;
                    return (
                        <Link
                            key={cat.id}
                            href={`/products/${cat.slug}`}
                            className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 ${
                                active
                                    ? "bg-brand-primary text-white border border-brand-primary"
                                    : "text-white/60 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.03]"
                            }`}
                        >
                            {cat.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
