"use client";

import { useState } from "react";
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
import { supabase } from "@/app/lib/supabase";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
});

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        company: "",
        phone: "",
        email: "",
        category: "",
        message: "",
    });
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name || !form.phone || !form.message) return;
        setStatus("loading");
        try {
            const { error } = await supabase.from("inquiries").insert([
                {
                    name: form.name,
                    company: form.company || null,
                    phone: form.phone,
                    email: form.email || null,
                    category: form.category || null,
                    message: form.message,
                },
            ]);
            if (error) throw error;
            setStatus("success");
            setForm({ name: "", company: "", phone: "", email: "", category: "", message: "" });
        } catch {
            setStatus("error");
        }
    }

    const waMessage = encodeURIComponent(
        "Hi HRP Industrial Products, I have an inquiry about your products."
    );

    return (
        <>
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
            <section className="bg-[#0a0f18] py-14 lg:py-20">
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
                                        {/* WhatsApp icon */}
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
                                    value: "+91 99999 99999",
                                    sub: "Mon–Sat, 9am–6pm",
                                    href: "tel:+919999999999",
                                },
                                {
                                    icon: <Mail className="w-4 h-4" />,
                                    label: "Email",
                                    value: "info@hrpindustrial.in",
                                    sub: "We reply within a few hours",
                                    href: "mailto:info@hrpindustrial.in",
                                },
                                {
                                    icon: <MapPin className="w-4 h-4" />,
                                    label: "Location",
                                    value: "Hyderabad, Telangana",
                                    sub: "Pan-India delivery available",
                                    href: null,
                                },
                                {
                                    icon: <Clock className="w-4 h-4" />,
                                    label: "Working Hours",
                                    value: "Monday – Saturday",
                                    sub: "9:00 AM – 6:00 PM IST",
                                    href: null,
                                },
                            ].map((item, i) => (
                                <motion.div key={item.label} {...fadeUp(0.15 + i * 0.08)}>
                                    {item.href ? (
                                        <a
                                            href={item.href}
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
                                    {status === "success" && (
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
                                                    Inquiry Received!
                                                </h3>
                                                <p className="font-body text-white/50 text-sm max-w-xs">
                                                    We&apos;ll get back to you shortly. For urgent needs, WhatsApp us directly.
                                                </p>
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
                                    {status !== "success" && (
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
                                                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm font-body focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.07] transition-all appearance-none"
                                                    style={{ colorScheme: "dark" }}
                                                >
                                                    <option value="">Select a category (optional)</option>
                                                    <option value="instrumentation">Instrumentation</option>
                                                    <option value="pneumatics">Pneumatics</option>
                                                    <option value="hydraulics">Hydraulics</option>
                                                    <option value="vacuum">Vacuum Components</option>
                                                    <option value="valves">Valves</option>
                                                    <option value="rubber">Rubber Products</option>
                                                    <option value="power-tools">Power Tools & Tools</option>
                                                    <option value="compressors">Compressors</option>
                                                    <option value="paint">Paint Equipment</option>
                                                    <option value="lifting">Tackles & Lifting</option>
                                                    <option value="bellows">SS Bellows</option>
                                                    <option value="other">Other / Not Listed</option>
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
                                                />
                                            </div>

                                            {/* Error */}
                                            {status === "error" && (
                                                <div className="flex items-center gap-2 text-red-400 text-xs font-body">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    Something went wrong. Please try WhatsApp instead.
                                                </div>
                                            )}

                                            {/* Submit */}
                                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                                <button
                                                    type="submit"
                                                    disabled={status === "loading"}
                                                    className="btn-accent flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {status === "loading" ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Sending…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            Send Inquiry
                                                        </>
                                                    )}
                                                </button>
                                                <a
                                                    href={`https://wa.me/${WHATSAPP}?text=${waMessage}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-brand-accent/25 text-brand-accent/80 hover:text-brand-accent hover:border-brand-accent/50 font-body text-sm tracking-wide transition-all duration-200 flex-shrink-0"
                                                >
                                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                    WhatsApp
                                                </a>
                                            </div>

                                            <p className="font-body text-white/25 text-xs">
                                                * Required fields. We respect your privacy and never share your details.
                                            </p>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
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
            />
        </div>
    );
}