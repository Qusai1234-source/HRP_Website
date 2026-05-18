'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Clock, Package, Users, MapPin } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────
// ⚠️  Update these numbers with the real figures from the client before launch
const STATS = [
    { Icon: Clock, label: 'Years in Business', value: 44, suffix: '+' },
    { Icon: Package, label: 'Products Listed', value: 10, suffix: 'k+' },
    { Icon: Users, label: 'Satisfied Clients', value: 100, suffix: 'k+' },
    { Icon: MapPin, label: 'Delivery', value: 'Pan India', suffix: '' },
]

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ end, suffix, active, duration = 1800 }) {
    const isString = typeof end === 'string' && isNaN(Number(end))
    const [count, setCount] = useState(isString ? end : 0)

    useEffect(() => {
        if (!active || isString) return
        let rafId
        let startTs = null

        rafId = requestAnimationFrame(function tick(ts) {
            if (!startTs) startTs = ts
            const progress = Math.min((ts - startTs) / duration, 1)
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) rafId = requestAnimationFrame(tick)
        })

        return () => cancelAnimationFrame(rafId)
    }, [active, end, duration, isString])

    return (
        <span>
            {count}
            {suffix}
        </span>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StatsStrip() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

    return (
        <section ref={sectionRef} className="py-20 bg-brand-light">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
                    {STATS.map(({ Icon, label, value, suffix }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 24 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Icon bubble */}
                            <div className="w-13 h-13 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-5"
                                style={{ width: '3.25rem', height: '3.25rem' }}>
                                <Icon size={22} className="text-brand-primary" />
                            </div>

                            {/* Animated number */}
                            <div className="font-heading font-bold text-brand-dark mb-1.5"
                                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                                <AnimatedNumber end={value} suffix={suffix} active={isInView} />
                            </div>

                            {/* Label */}
                            <p className="font-body text-brand-secondary/65 text-xs uppercase tracking-widest leading-snug">
                                {label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}