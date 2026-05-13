'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, Phone } from 'lucide-react'

export default function CTABanner() {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999'
    const waUrl = `https://wa.me/${phone}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20your%20products.`

    return (
        <section className="relative py-28 bg-brand-dark overflow-hidden">

            {/* ── Grid texture ── */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.028) 1px,transparent 1px),' +
                        'linear-gradient(90deg,rgba(255,255,255,0.028) 1px,transparent 1px)',
                    backgroundSize: '44px 44px',
                }}
            />

            {/* ── Radial glow ── */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 80% at 50% 55%, rgba(43,126,161,0.16) 0%, transparent 70%)',
                }}
            />

            {/* ── Content ── */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                >
                    {/* Eyebrow */}
                    <p className="font-body text-brand-accent font-semibold text-sm tracking-widest uppercase mb-5">
                        Ready to Order?
                    </p>

                    {/* Headline */}
                    <h2
                        className="font-heading font-bold text-white leading-tight mb-6"
                        style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)' }}
                    >
                        Get a Fast Quote for Your{' '}
                        <span className="text-brand-primary">Industrial Needs</span>
                    </h2>

                    {/* Sub */}
                    <p className="font-body text-white/55 text-lg leading-relaxed mb-12">
                        Reach us on WhatsApp for instant responses, or submit an enquiry form
                        and we'll get back to you promptly.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 px-9 py-4 bg-brand-accent text-brand-dark font-body font-bold rounded-xl hover:opacity-90 transition-all duration-200 text-base"
                        >
                            <MessageCircle size={20} />
                            WhatsApp Us Now
                        </a>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-3 px-9 py-4 border-2 border-white/20 text-white font-body font-semibold rounded-xl hover:border-white/40 hover:bg-white/5 transition-all duration-200 text-base"
                        >
                            <Phone size={18} />
                            Send an Enquiry
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}