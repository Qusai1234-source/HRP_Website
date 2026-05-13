"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
    {
        slug: "instrumentation",
        name: "Instrumentation",
        desc: "Sensors, transmitters, flow meters, pressure gauges & process instruments.",
        icon: "⬡",
        count: "80+ Products",
        image: "/images/categories/instrumentation.png",
    },
    {
        slug: "pneumatics",
        name: "Pneumatics",
        desc: "Cylinders, FRL units, solenoid valves, fittings & pneumatic accessories.",
        icon: "◈",
        count: "65+ Products",
        image: "/images/categories/pneumatics.png",
    },
    {
        slug: "hydraulics",
        name: "Hydraulics",
        desc: "Hydraulic hoses, pumps, cylinders, power packs & couplings.",
        icon: "◉",
        count: "70+ Products",
        image: "/images/categories/hydraulics.png",
    },
    {
        slug: "vacuum",
        name: "Vacuum Components",
        desc: "Schmalz vacuum cups, generators, grippers & handling systems.",
        icon: "◎",
        count: "40+ Products",
        image: "/images/categories/vacuum.png",
        badge: "Schmalz",
    },
    {
        slug: "valves",
        name: "Valves",
        desc: "Ball, gate, globe, butterfly, check & solenoid valves in all sizes.",
        icon: "◆",
        count: "90+ Products",
        image: "/images/categories/valves.png",
    },
    {
        slug: "rubber",
        name: "Rubber Products",
        desc: "Rubber sheets, industrial hoses, gaskets, O-rings & moulded parts.",
        icon: "▣",
        count: "55+ Products",
        image: "/images/categories/rubber.png",
    },
    {
        slug: "power-tools",
        name: "Power Tools & Tools",
        desc: "Electric, pneumatic, cordless & hand tools for industrial applications.",
        icon: "⬟",
        count: "60+ Products",
        image: "/images/categories/power-tools.png",
    },
    {
        slug: "compressors",
        name: "Compressors",
        desc: "Reciprocating, screw & portable compressors for industrial use.",
        icon: "◐",
        count: "30+ Products",
        image: "/images/categories/compressors.png",
    },
    {
        slug: "paint",
        name: "Paint Equipment",
        desc: "Spray guns, pressure pots, HVLP systems & airless spray equipment.",
        icon: "◑",
        count: "35+ Products",
        image: "/images/categories/paint.png",
    },
    {
        slug: "lifting",
        name: "Tackles & Lifting",
        desc: "Chain hoists, wire rope slings, shackles, hooks & lifting accessories.",
        icon: "◒",
        count: "45+ Products",
        image: "/images/categories/lifting.png",
    },
    {
        slug: "bellows",
        name: "SS Bellows",
        desc: "Stainless steel expansion joints, corrugated & annular bellows.",
        icon: "◓",
        count: "25+ Products",
        image: "/images/categories/bellows.png",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function ProductsPage() {
    const [search, setSearch] = useState("");

    const filtered = CATEGORIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* ── HERO ── */}
            <section
                className="relative bg-brand-dark overflow-hidden"
                style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
            >
                {/* Grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(#8DC63F 1px, transparent 1px), linear-gradient(90deg, #8DC63F 1px, transparent 1px)",
                        backgroundSize: "52px 52px",
                    }}
                />
                {/* Glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 55% at 15% 60%, rgba(43,126,161,0.14) 0%, transparent 70%)",
                    }}
                />
                {/* Right ghost text */}
                <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none"
                    style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(6rem, 14vw, 11rem)",
                        lineHeight: 1,
                        color: "rgba(43,126,161,0.055)",
                        letterSpacing: "-0.04em",
                        paddingRight: "2rem",
                    }}
                >
                    SUPPLY
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-brand-accent text-sm font-body tracking-widest uppercase mb-4 flex items-center gap-3"
                    >
                        <span className="inline-block w-8 h-px bg-brand-accent" />
                        Our Product Range
                    </motion.p>

                    <div className="overflow-hidden mb-5">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="font-heading font-bold text-white leading-none"
                            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
                        >
                            Industrial Solutions,
                            <br />
                            <em className="text-brand-accent not-italic">One Source</em>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        className="text-white/50 font-body max-w-lg leading-relaxed mb-8"
                        style={{ fontSize: "1rem" }}
                    >
                        Browse our 11 product categories — covering everything your plant or
                        facility needs, sourced from quality manufacturers.
                    </motion.p>

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="flex flex-wrap gap-6"
                    >
                        {[
                            ["11", "Categories"],
                            ["500+", "Products"],
                            ["15+", "Years Supply"],
                            ["Pan-India", "Delivery"],
                        ].map(([val, label]) => (
                            <div key={label} className="flex items-baseline gap-2">
                                <span
                                    className="font-heading font-bold text-brand-primary"
                                    style={{ fontSize: "1.4rem" }}
                                >
                                    {val}
                                </span>
                                <span className="font-body text-white/40 text-xs tracking-widest uppercase">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── SEARCH BAR ── */}
            <div className="bg-brand-dark border-b border-white/[0.06] sticky top-0 z-30 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white/80 text-sm font-body placeholder-white/25 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.07] transition-all"
                        />
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-white/30">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-xs font-body tracking-widest uppercase">
                            {filtered.length} Categories
                        </span>
                    </div>
                </div>
            </div>

            {/* ── CATEGORY GRID ── */}
            <section className="bg-[#0a0f18] py-14 lg:py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-white/30 font-body text-lg">
                                No categories match &ldquo;{search}&rdquo;
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((cat, i) => (
                                <motion.div
                                    key={cat.slug}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: "-60px" }}
                                >
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className="group relative block rounded-2xl overflow-hidden cursor-pointer"
                                        style={{ height: "260px" }}
                                    >
                                        {/* Background image */}
                                        <div
                                            className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            style={{
                                                backgroundImage: `url('${cat.image}')`,
                                                backgroundColor: "#0e1a2a",
                                            }}
                                        />

                                        {/* Overlay stack */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(105deg, rgba(8,14,24,0.92) 0%, rgba(8,14,24,0.6) 55%, rgba(8,14,24,0.2) 100%)",
                                            }}
                                        />
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(to top, rgba(8,14,24,0.9) 0%, transparent 55%)",
                                            }}
                                        />

                                        {/* Hover top border */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, #2B7EA1, #8DC63F)",
                                            }}
                                        />

                                        {/* Badge */}
                                        {cat.badge && (
                                            <div className="absolute top-3 right-3 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[0.55rem] font-body tracking-widest uppercase px-2 py-1 rounded backdrop-blur-sm">
                                                {cat.badge}
                                            </div>
                                        )}

                                        {/* Icon pill */}
                                        <div
                                            className="absolute top-4 left-4 w-9 h-9 rounded-lg flex items-center justify-center text-brand-primary text-lg border border-brand-primary/25"
                                            style={{
                                                background: "rgba(43,126,161,0.12)",
                                                backdropFilter: "blur(8px)",
                                            }}
                                        >
                                            {cat.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <p className="text-white/40 font-body text-[0.6rem] tracking-widest uppercase mb-1 group-hover:text-brand-primary/70 transition-colors">
                                                {cat.count}
                                            </p>
                                            <h3
                                                className="font-heading font-bold text-white mb-2 transition-colors group-hover:text-brand-accent"
                                                style={{ fontSize: "1.1rem", lineHeight: 1.2 }}
                                            >
                                                {cat.name}
                                            </h3>
                                            <p className="text-white/50 font-body leading-relaxed mb-3 line-clamp-2"
                                                style={{ fontSize: "0.75rem" }}>
                                                {cat.desc}
                                            </p>
                                            <span className="inline-flex items-center gap-1.5 text-brand-primary text-xs font-body tracking-widest uppercase group-hover:text-brand-accent transition-colors">
                                                Browse Products
                                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA STRIP ── */}
            <section
                className="bg-brand-dark relative overflow-hidden"
                style={{ padding: "4rem 0" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(141,198,63,0.05) 0%, transparent 70%)",
                    }}
                />
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                    <div>
                        <p className="text-brand-accent text-xs font-body tracking-widest uppercase mb-2">
                            Can't find what you need?
                        </p>
                        <h2
                            className="font-heading font-bold text-white"
                            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                        >
                            We source what you require.
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-accent"
                        >
                            WhatsApp Us
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-body text-sm tracking-wide transition-all duration-200"
                        >
                            Send Enquiry
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}