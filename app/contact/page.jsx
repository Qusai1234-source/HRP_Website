"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Send,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
});

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919014538495";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrpindustrial.in";

const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "HRP Industrial Products",
    url: BASE_URL,
    telephone: "+91-9014538495",
    email: "info@hrpvizag.com",
    address: {
        "@type": "PostalAddress",
        streetAddress: "Shop No G5 and G6, 28-13-20, Brindavan Rd, opp. Vishnu Residency, Suryabagh, Jagadamba Junction",
        addressLocality: "Visakhapatnam",
        addressRegion: "Andhra Pradesh",
        postalCode: "530020",
        addressCountry: "IN",
    },
    openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
    },
    description: "HRP Industrial Products — authorized distributor of SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves and Fittings in Visakhapatnam, India.",
};

// Fallback categories if fetch fails
const FALLBACK_CATEGORIES = [
    { slug: "instrumentation", name: "Instrumentation" },
    { slug: "pneumatics", name: "Pneumatics" },
    { slug: "hydraulics", name: "Hydraulics" },
    { slug: "vacuum", name: "Vacuum Components" },
    { slug: "valves", name: "Valves" },
    { slug: "rubber", name: "Rubber Products" },
    { slug: "power-tools", name: "Power Tools & Tools" },
    { slug: "compressors", name: "Compressors" },
    { slug: "paint", name: "Paint Equipment" },
    { slug: "lifting", name: "Tackles & Lifting" },
    { slug: "bellows", name: "SS Bellows" },
    { slug: "other", name: "Other / Not Listed" },
];

// Google Maps embed for Jagadamba Junction, Visakhapatnam
const MAPS_EMBED_URL =
    "https://maps.google.com/maps?q=Hydraulics+And+Rubber+Products,+28-13-20,+Brindavan+Rd,+Jagadamba+Junction,+Visakhapatnam,+Andhra+Pradesh+530020&output=embed&z=16";

const MAPS_LINK =
    "https://maps.google.com/maps?q=Hydraulics+And+Rubber+Products,+Jagadamba+Junction,+Visakhapatnam";

function ContactPageInner() {
    const searchParams = useSearchParams();
    const [form, setForm] = useState({
        name: "",
        company: "",
        phone: "",
        email: "",
        category: "",
        message: "",
    });
    const [status, setStatus] = useState("idle"); // idle | loading | success | success_no_email | error
    const [errorMsg, setErrorMsg] = useState("");
    // Start with fallback so the dropdown is never empty on first paint
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

    // Pre-fill message if ?product= is in the URL
    useEffect(() => {
        const product = searchParams.get("product");
        const category = searchParams.get("category");
        if (product) {
            setForm(prev => ({
                ...prev,
                message: `Hi, I'm interested in ${product}. Please share pricing and availability.`,
                category: category || prev.category,
            }));
        }
    }, [searchParams]);

    // Try to upgrade with live categories from Supabase; fall back silently
    useEffect(() => {
        let cancelled = false;
        fetch("/api/categories")
            .then((r) => r.ok ? r.json() : Promise.reject())
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setCategories(data);
                }
            })
            .catch(() => { /* keep fallback already in state */ });
        return () => { cancelled = true; };
    }, []);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name || !form.phone || !form.message) return;
        setStatus("loading");
        setErrorMsg("");

        try {
            // ── Send to API (saves Supabase + emails business) ──────────────
            const res = await fetch("/api/send-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to send inquiry.");
            }

            // ── Success: capture values, clear form, open WhatsApp ─────────
            const sent = await res.json().catch(() => ({}));

            // Capture before clearing state
            const { name, company, phone, email: userEmail, category, message } = form;
            const categoryLabel = categories.find((c) => c.slug === category)?.name
                || (category ? category.replace(/-/g, " ") : "");

            setStatus(sent.emailSent ? "success" : "success_no_email");
            setForm({ name: "", company: "", phone: "", email: "", category: "", message: "" });

            // Build structured WhatsApp message
            const waLines = [
                `*New Inquiry — HRP Industrial Products*`,
                ``,
                `*Name:* ${name}`,
                company  ? `*Company:* ${company}`       : null,
                `*Phone:* ${phone}`,
                userEmail ? `*Email:* ${userEmail}`       : null,
                categoryLabel ? `*Category:* ${categoryLabel}` : null,
                ``,
                `*Message:*`,
                message,
                ``,
                `─────────────────────`,
                `Submitted via hrpindustrial.in`,
            ].filter((l) => l !== null).join("\n");

            window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waLines)}`, "_blank", "noopener,noreferrer");

        } catch (err) {
            setStatus("error");
            setErrorMsg(err?.message || "Something went wrong. Please try WhatsApp instead.");
        }
    }

    const waMessage = encodeURIComponent(
        "Hi HRP Industrial Products, I have an inquiry about your products."
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
            />

            {/* ── HERO ── */}
            <section
                className="relative bg-brand-dark overflow-hidden"
                style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
            >
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(#8DC63F 1px, transparent 1px), linear-gradient(90deg, #8DC63F 1px, transparent 1px)",
                        backgroundSize: "52px 52px",
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 55% 60% at 18% 55%, rgba(43,126,161,0.14) 0%, transparent 70%)",
                    }}
                />
                {/* Ghost text */}
                <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none"
                    style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(5rem, 12vw, 10rem)",
                        lineHeight: 1,
                        color: "rgba(43,126,161,0.05)",
                        letterSpacing: "-0.04em",
                        paddingRight: "2rem",
                    }}
                >
                    CONTACT
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-brand-accent text-sm font-body tracking-widest uppercase mb-4 flex items-center gap-3"
                    >
                        <span className="inline-block w-8 h-px bg-brand-accent" />
                        Get In Touch
                    </motion.p>

                    <div className="overflow-hidden mb-5">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="font-heading font-bold text-white leading-none"
                            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
                        >
                            Let&apos;s Talk
                            <br />
                            <em className="text-brand-accent not-italic">Industrial Solutions</em>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        className="text-white/50 font-body max-w-lg leading-relaxed"
                        style={{ fontSize: "1rem" }}
                    >
                        Send us an inquiry, request a quote, or just ask about availability.
                        We respond fast — typically within a few hours.
                    </motion.p>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <section className="bg-brand-dark py-14 lg:py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

                        {/* ── LEFT: Contact details ── */}
                        <div className="lg:col-span-2 flex flex-col gap-6">

                            {/* WhatsApp card — hero CTA */}
                            <motion.a
                                {...fadeUp(0.1)}
                                href={`https://wa.me/${WHATSAPP}?text=${waMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block rounded-2xl overflow-hidden p-6"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(141,198,63,0.12) 0%, rgba(43,126,161,0.08) 100%)",
                                    border: "1px solid rgba(141,198,63,0.22)",
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background:
                                            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(141,198,63,0.07) 0%, transparent 70%)",
                                    }}
                                />
                                <div className="flex items-start gap-4 relative z-10">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(141,198,63,0.15)" }}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-brand-accent">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-body text-white/40 text-xs tracking-widest uppercase mb-1">
                                            Fastest Response
                                        </p>
                                        <p className="font-heading font-bold text-white text-lg mb-1 group-hover:text-brand-accent transition-colors">
                                            WhatsApp Us Now
                                        </p>
                                        <p className="font-body text-white/50 text-sm">
                                            Chat directly for quick quotes & availability checks.
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 mt-3 text-brand-accent text-xs font-body tracking-widest uppercase">
                                            Open WhatsApp
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </motion.a>

                            {/* Contact detail cards */}
                            {[
                                {
                                    icon: <Phone className="w-4 h-4" />,
                                    label: "Phone",
                                    value: "+91 90145 38495",
                                    sub: "Mon–Sat, 10am–7pm",
                                    href: "tel:+919014538495",
                                },
                                {
                                    icon: <Mail className="w-4 h-4" />,
                                    label: "Email",
                                    value: "info@hrpvizag.com",
                                    sub: "We reply within a few hours",
                                    href: "mailto:info@hrpvizag.com",
                                },
                                {
                                    icon: <MapPin className="w-4 h-4" />,
                                    label: "Location",
                                    value: "Jagadamba Junction, Vizag",
                                    sub: "Shop G5 & G6, Brindavan Rd, Visakhapatnam 530020",
                                    href: MAPS_LINK,
                                },
                                {
                                    icon: <Clock className="w-4 h-4" />,
                                    label: "Working Hours",
                                    value: "Monday – Saturday",
                                    sub: "10:00 AM – 7:00 PM IST",
                                    href: null,
                                },
                            ].map((item, i) => (
                                <motion.div key={item.label} {...fadeUp(0.15 + i * 0.08)}>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target={item.href.startsWith("http") ? "_blank" : undefined}
                                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                            className="group flex items-start gap-4 p-4 rounded-xl border border-white/[0.07] hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all duration-200"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary flex-shrink-0 mt-0.5">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-body text-white/30 text-[0.6rem] tracking-widest uppercase mb-0.5">
                                                    {item.label}
                                                </p>
                                                <p className="font-heading font-semibold text-white/85 text-sm group-hover:text-white transition-colors">
                                                    {item.value}
                                                </p>
                                                <p className="font-body text-white/35 text-xs mt-0.5">{item.sub}</p>
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.07]">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary flex-shrink-0 mt-0.5">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-body text-white/30 text-[0.6rem] tracking-widest uppercase mb-0.5">
                                                    {item.label}
                                                </p>
                                                <p className="font-heading font-semibold text-white/85 text-sm">
                                                    {item.value}
                                                </p>
                                                <p className="font-body text-white/35 text-xs mt-0.5">{item.sub}</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* ── RIGHT: Inquiry form ── */}
                        <motion.div
                            {...fadeUp(0.2)}
                            className="lg:col-span-3"
                        >
                            <div
                                className="relative rounded-2xl overflow-hidden p-7 lg:p-9"
                                style={{
                                    background: "rgba(10,16,26,0.7)",
                                    border: "1px solid rgba(43,126,161,0.16)",
                                    backdropFilter: "blur(16px)",
                                }}
                            >
                                {/* Blueprint grid */}
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-2xl"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(rgba(43,126,161,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(43,126,161,0.025) 1px, transparent 1px)",
                                        backgroundSize: "24px 24px",
                                    }}
                                />
                                {/* Top edge accent */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-px"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, transparent, rgba(43,126,161,0.5) 40%, rgba(141,198,63,0.35) 70%, transparent)",
                                    }}
                                />

                                <div className="relative z-10">
                                    <p className="font-body text-brand-primary text-xs tracking-widest uppercase mb-1">
                                        Send an Inquiry
                                    </p>
                                    <h2
                                        className="font-heading font-bold text-white mb-6"
                                        style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)" }}
                                    >
                                        Request a Quote
                                    </h2>

                                    {/* Success state */}
                                    {(status === "success" || status === "success_no_email") && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center text-center py-12 gap-4"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center">
                                                <CheckCircle className="w-7 h-7 text-brand-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-heading font-bold text-white text-lg mb-2">
                                                    Inquiry Sent!
                                                </h3>
                                                <div className="flex flex-col gap-1.5 items-center">
                                                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-brand-accent/80">
                                                        <CheckCircle className="w-3 h-3" /> WhatsApp opened with your details
                                                    </span>
                                                    {status === "success" ? (
                                                        <span className="inline-flex items-center gap-1.5 font-body text-xs text-brand-accent/80">
                                                            <CheckCircle className="w-3 h-3" /> Notification email sent to HRP
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 font-body text-xs text-white/30">
                                                            <AlertCircle className="w-3 h-3" /> Email not configured — WhatsApp only
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-brand-accent/80">
                                                        <CheckCircle className="w-3 h-3" /> Inquiry saved to admin panel
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setStatus("idle")}
                                                className="mt-2 text-brand-primary text-xs font-body tracking-widest uppercase hover:text-brand-accent transition-colors"
                                            >
                                                Send another →
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Form */}
                                    {status !== "success" && status !== "success_no_email" && (
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Field
                                                    label="Full Name *"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Your name"
                                                    required
                                                />
                                                <Field
                                                    label="Company Name"
                                                    name="company"
                                                    value={form.company}
                                                    onChange={handleChange}
                                                    placeholder="Company (optional)"
                                                />
                                                <Field
                                                    label="Phone Number *"
                                                    name="phone"
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    required
                                                />
                                                <Field
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="your@email.com"
                                                />
                                            </div>

                                            {/* Category select */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="font-body text-white/40 text-[0.65rem] tracking-widest uppercase">
                                                    Product Category
                                                </label>
                                                <select
                                                    name="category"
                                                    value={form.category}
                                                    onChange={handleChange}
                                                    className="w-full border border-white/10 rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-primary/50 transition-all"
                                                    style={{
                                                        backgroundColor: "#0f1a24",
                                                        color: "rgba(241,245,249,0.75)",
                                                        colorScheme: "dark",
                                                    }}
                                                    suppressHydrationWarning
                                                >
                                                    <option value="" style={{ backgroundColor: "#0f1a24", color: "rgba(241,245,249,0.45)" }}>
                                                        Select a category (optional)
                                                    </option>
                                                    {categories.map((cat) => (
                                                        <option
                                                            key={cat.slug}
                                                            value={cat.slug}
                                                            style={{ backgroundColor: "#0f1a24", color: "#f1f5f9" }}
                                                        >
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Message */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="font-body text-white/40 text-[0.65rem] tracking-widest uppercase">
                                                    Your Inquiry *
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={form.message}
                                                    onChange={handleChange}
                                                    placeholder="Describe what you need — product name, quantity, specifications..."
                                                    required
                                                    rows={4}
                                                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm font-body placeholder-white/25 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.07] transition-all resize-none"
                                                    suppressHydrationWarning
                                                />
                                            </div>

                                            {/* Error */}
                                            {status === "error" && (
                                                <div className="flex items-start gap-2 text-red-400 text-xs font-body">
                                                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                    <span>{errorMsg || "Something went wrong. Please try WhatsApp instead."}</span>
                                                </div>
                                            )}

                                            {/* Submit */}
                                            <div className="flex flex-col gap-3 pt-1">
                                                <button
                                                    type="submit"
                                                    disabled={status === "loading"}
                                                    className="w-full inline-flex items-center justify-center gap-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold font-body px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-primary/25 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                                    suppressHydrationWarning
                                                >
                                                    {status === "loading" ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Sending…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            Send Inquiry — Email &amp; WhatsApp
                                                        </>
                                                    )}
                                                </button>

                                                <p className="font-body text-white/25 text-xs text-center">
                                                    * Required. Submitting saves your inquiry, sends us an email, and opens WhatsApp with your message pre-filled.
                                                </p>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── MAP ── */}
            <section className="bg-brand-dark border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
                    <motion.div
                        {...fadeUp(0.1)}
                        className="mb-8"
                    >
                        <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                            <span className="inline-block w-8 h-px bg-brand-primary/60" />
                            Find Us
                        </p>
                        <h2 className="font-heading font-bold text-white mb-1" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                            Visit Our Store
                        </h2>
                        <p className="font-body text-white/40 text-sm">
                            Shop No G5 &amp; G6, 28-13-20, Brindavan Rd, opp. Vishnu Residency,<br />
                            Suryabagh, Jagadamba Junction, Visakhapatnam — 530020
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeUp(0.15)}
                        className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
                        style={{ height: "420px" }}
                    >
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(43,126,161,0.5) 40%, rgba(141,198,63,0.3) 70%, transparent)" }} />

                        <iframe
                            title="HRP Industrial Products — Visakhapatnam"
                            src={MAPS_EMBED_URL}
                            width="100%"
                            height="100%"
                            style={{ border: 0, display: "block" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>

                    {/* Open in Maps link */}
                    <motion.div {...fadeUp(0.2)} className="mt-4 flex justify-end">
                        <a
                            href={MAPS_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent text-sm font-body font-semibold transition-colors"
                        >
                            <MapPin className="w-4 h-4" />
                            Open in Google Maps
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={null}>
            <ContactPageInner />
        </Suspense>
    );
}

/* ── Reusable field component ── */
function Field({ label, name, type = "text", value, onChange, placeholder, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="font-body text-white/40 text-[0.65rem] tracking-widest uppercase">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm font-body placeholder-white/25 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.07] transition-all"
                suppressHydrationWarning
            />
        </div>
    );
}
