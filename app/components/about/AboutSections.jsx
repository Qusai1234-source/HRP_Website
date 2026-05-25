"use client";
// app/components/about/AboutSections.jsx
// Client component: Why Choose HRP, Brands We Carry, CTA

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react";

// ─── Brand files ──────────────────────────────────────────────────────────────
const BRANDS = [
    { file: "bosch.svg",     name: "Bosch" },
    { file: "pneumax.svg",   name: "Pneumax" },
    { file: "piab.png",      name: "Piab" },
    { file: "baumer.svg",    name: "Baumer" },
    { file: "dunlop.svg",    name: "Dunlop" },
    { file: "khaitan.jpeg",  name: "Khaitan" },
    { file: "wadfow.png",    name: "Wadfow" },
    { file: "conact.svg",    name: "Conact" },
    { file: "techno.jpeg",   name: "Techno" },
    { file: "painter.jpeg",  name: "Painter" },
    { file: "alpha.jpeg",    name: "Alpha" },
    { file: "dingli.jpeg",   name: "Dingli" },
];

// ─── Why Choose HRP features ──────────────────────────────────────────────────
const WHY_FEATURES = [
    {
        Icon: ShieldCheck,
        title: "Quality Assured",
        desc: "Every product in our catalogue is sourced from verified manufacturers and meets stringent industrial quality standards — no compromises, no grey-market sourcing.",
        color: "#2B7EA1",
    },
    {
        Icon: Truck,
        title: "Pan India Delivery",
        desc: "From Visakhapatnam to every industrial hub across India, we deliver on time. Tight lead times, reliable logistics, and same-week dispatch on all stocked items.",
        color: "#8DC63F",
    },
    {
        Icon: Headphones,
        title: "Expert Technical Support",
        desc: "Our team understands the products deeply. We help you spec the right part, source alternatives, and solve application challenges — not just take your order.",
        color: "#F59E0B",
    },
    {
        Icon: Award,
        title: "23+ Premium Brands",
        desc: "Parker, Bosch, Schmalz, Piab, Janatics and more — authorised distribution for the world's most trusted industrial manufacturers.",
        color: "#A78BFA",
    },
];

function WhyCard({ Icon, title, desc, color, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-2xl p-7 overflow-hidden"
            style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.07)",
            }}
        >
            {/* Hover glow layer */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${color}12 0%, transparent 70%)` }}
            />
            {/* Top accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
            />
            {/* Decorative glow */}
            <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `${color}10`, filter: "blur(50px)" }}
            />

            {/* Icon */}
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative z-10"
                style={{ background: `${color}14`, border: `1px solid ${color}30`, color }}
            >
                <Icon size={22} strokeWidth={1.8} />
            </div>

            <h3 className="relative z-10 font-heading font-bold text-white text-xl mb-3 group-hover:text-white transition-colors">
                {title}
            </h3>
            <p className="relative z-10 font-body text-white/45 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                {desc}
            </p>

            {/* Bottom arrow */}
            {/* <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-body font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color }}>
                Learn more
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div> */}
        </motion.div>
    );
}

export default function AboutSections() {
    return (
        <>
            {/* ── Why Choose HRP ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-24" style={{ background: "var(--color-brand-dark)" }}>
                {/* Grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                        backgroundSize: "52px 52px",
                    }}
                />
                <div className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-brand-primary/[0.08] blur-[100px] pointer-events-none" />
                <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-brand-accent/[0.06] blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-14"
                    >
                        <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                            <span className="inline-block w-8 h-px bg-brand-primary/60" />
                            Why HRP
                        </p>
                        <h2
                            className="font-heading font-black text-white leading-tight"
                            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: "520px" }}
                        >
                            Built on Trust,<br />Backed by Expertise
                        </h2>
                        <p className="font-body text-white/40 mt-4 max-w-lg text-sm leading-relaxed">
                            Four decades in the field have taught us what industrial clients actually need — not brochures, but answers and reliability.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {WHY_FEATURES.map((f, i) => (
                            <WhyCard key={f.title} {...f} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Brands We Carry ────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden py-24"
                style={{
                    background: "linear-gradient(160deg, #0d1a10 0%, #080c14 40%, #06090f 100%)",
                }}
            >
                {/* Green bloom — top left */}
                <div className="absolute -top-40 -left-20 w-[600px] h-[500px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(141,198,63,0.18) 0%, transparent 60%)", filter: "blur(40px)" }} />
                {/* Teal shimmer — bottom right */}
                <div className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 80% 90%, rgba(43,126,161,0.15) 0%, transparent 60%)", filter: "blur(50px)" }} />
                {/* Subtle grid texture */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
                    backgroundSize: "52px 52px",
                }} />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2">
                            <span className="inline-block w-8 h-px bg-brand-primary/60" />
                            Our Partners
                            <span className="inline-block w-8 h-px bg-brand-primary/60" />
                        </p>
                        <h2
                            className="font-heading font-black text-white"
                            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                        >
                            Brands We Carry
                        </h2>
                        <p className="font-body text-white/35 mt-4 max-w-md mx-auto text-sm leading-relaxed">
                            Authorised distributor for 23+ globally recognised industrial brands — every product traceable, every spec guaranteed.
                        </p>
                    </motion.div>

                    {/* Brand grid */}
                    <motion.div
                        className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.04 } },
                        }}
                    >
                        {BRANDS.map((brand) => (
                            <motion.div
                                key={brand.file}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.88 },
                                    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
                                }}
                            >
                                <div
                                    className="rounded-xl overflow-hidden flex items-center justify-center p-2.5 cursor-default"
                                    style={{
                                        background: "rgba(255,255,255,0.92)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        height: "64px",
                                        transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "scale(1.07)";
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(43,126,161,0.22)";
                                        e.currentTarget.style.background = "#ffffff";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.92)";
                                    }}
                                >
                                    <img
                                        src={`/images/brands/${brand.file}`}
                                        alt={brand.name}
                                        title={brand.name}
                                        style={{ maxWidth: "100%", maxHeight: "40px", objectFit: "contain" }}
                                        loading="lazy"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center font-body text-white/20 text-xs mt-10 tracking-widest uppercase"
                    >
                        23 brand partners · authorised distribution · certified stock
                    </motion.p>
                </div>
            </section>

            {/* ── Get In Touch CTA ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28" style={{ background: "#080d12" }}>
                {/* Grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(74,158,197,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,158,197,0.04) 1px, transparent 1px)",
                        backgroundSize: "52px 52px",
                    }}
                />
                {/* Glows */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 65% 55% at 20% 50%, rgba(74,158,197,0.08) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 80% 30%, rgba(150, 220, 52, 0.05) 0%, transparent 60%)",
                }} />

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="font-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(141,198,63,0.8)" }}>
                            Ready to Work Together?
                        </p>
                        <h2
                            className="font-heading font-black text-white leading-tight mb-5"
                            style={{ fontSize: "clamp(1.9rem, 3.5vw, 3rem)", letterSpacing: "-0.03em" }}
                        >
                            Your Reliable Industrial<br />
                            <em style={{ color: "#8DC63F", fontStyle: "italic" }}>Supply Partner Awaits</em>
                        </h2>
                        <p className="font-body text-white/55 text-sm leading-relaxed max-w-lg mx-auto mb-10">
                            Whether you need a single precision component or a complete supply chain solution — HRP has the product, the expertise, and the commitment to deliver.
                        </p>

                        {/* Stats row */}
                        <div
                            className="grid grid-cols-2 sm:grid-cols-4 mb-12 rounded-xl overflow-hidden"
                            style={{ border: "1px solid rgba(74,158,197,0.15)", background: "rgba(15,23,42,0.4)" }}
                        >
                            {[
                                { n: "44+",      l: "Years Experience" },
                                { n: "200+",     l: "Active Clients" },
                                { n: "10K+",     l: "Products" },
                                { n: "Pan India", l: "Served" },
                            ].map((s, i) => (
                                <div
                                    key={s.l}
                                    className="flex flex-col items-center gap-1 py-5 px-4"
                                    style={{ borderRight: i < 3 ? "1px solid rgba(74,158,197,0.12)" : "none" }}
                                >
                                    <span className="font-heading font-black text-2xl leading-none" style={{ color: "#4a9ec5", letterSpacing: "-0.03em" }}>{s.n}</span>
                                    <span className="font-body text-white/40 text-xs tracking-widest uppercase">{s.l}</span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <Link
                                href="/products"
                                className="font-heading font-bold text-sm px-8 py-3.5 rounded-md transition-all duration-200 hover:-translate-y-0.5"
                                style={{ background: "#8DC63F", color: "#0b1219", boxShadow: "0 4px 20px rgba(141,198,63,0.2)" }}
                            >
                                Explore Our Products
                            </Link>
                            <Link
                                href="/contact"
                                className="font-heading font-bold text-sm px-8 py-3.5 rounded-md transition-all duration-200 hover:-translate-y-0.5"
                                style={{ border: "1.5px solid rgba(74,158,197,0.4)", color: "#f1f5f9" }}
                            >
                                Get a Custom Quote
                            </Link>
                        </div>

                        <p className="font-body text-white/25 text-xs tracking-wide">
                            ✓ Same-week quotations &nbsp;&nbsp; ✓ Pan-India delivery &nbsp;&nbsp; ✓ Authorised brand distributor
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
