'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'

// ─── Timing constants (ms / seconds) ─────────────────────────────────────────
const LOGO_SETTLE_MS = 1100   // how long logo is visible before scan starts
const SCAN_DURATION_S = 1.4    // how long the scan sweep takes
const UNMOUNT_DELAY = 160    // ms after sweep before component unmounts

export default function PageIntro() {
    const [visible, setVisible] = useState(true)

    // 0 → 100: percentage the scan line has travelled top → bottom
    const scanY = useMotionValue(0)

    // Dark overlay clips away from the top as scanY increases
    // inset(top right bottom left) — increasing "top" reveals hero beneath
    const overlayClip = useTransform(scanY, (v) => `inset(${v}% 0 0 0)`)

    // Scan line physical position
    const scanTop = useTransform(scanY, (v) => `${v}%`)

    // Logo fades out as the scan line passes it (~45–65% of screen height)
    const logoOpacity = useTransform(scanY, [0, 40, 62], [1, 1, 0])

    // Scan line glow intensity — ramps up from 0, holds, then dims near bottom
    const glowOpacity = useTransform(scanY, [0, 4, 92, 100], [0, 1, 1, 0])

    useEffect(() => {
        // Skip animation for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(false)
            return
        }

        const run = async () => {
            await new Promise((r) => setTimeout(r, LOGO_SETTLE_MS))

            await animate(scanY, 100, {
                duration: SCAN_DURATION_S,
                ease: [0.5, 0, 0.4, 1], // slow start → fast mid → slow finish
            })

            await new Promise((r) => setTimeout(r, UNMOUNT_DELAY))
            setVisible(false)
        }

        run()
    }, [])

    if (!visible) return null

    return (
        <>
            {/* ── 1. Dark overlay — clips away from top following the scan ──────── */}
            <motion.div
                aria-hidden
                className="fixed inset-0 pointer-events-none"
                style={{ clipPath: overlayClip, zIndex: 200 }}
            >
                {/* Base dark fill */}
                <div className="absolute inset-0 bg-brand-dark" />

                {/* Fine horizontal scanline texture on the dark panel — CRT/industrial feel */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.016) 3px, rgba(255,255,255,0.016) 4px)',
                    }}
                />

                {/* Faint grid — echoes the hero section behind it */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),' +
                            'linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
                        backgroundSize: '52px 52px',
                    }}
                />

                {/* Vignette corners */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)',
                    }}
                />
            </motion.div>

            {/* ── 2. Scan line + glow layers ────────────────────────────────────── */}
            <motion.div
                aria-hidden
                className="fixed left-0 right-0 pointer-events-none"
                style={{ top: scanTop, zIndex: 202, opacity: glowOpacity }}
            >
                {/* Soft gradient trail ABOVE the line (motion blur illusion) */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '1px',
                        left: 0,
                        right: 0,
                        height: '70px',
                        background:
                            'linear-gradient(to top, rgba(43,126,161,0.14) 0%, transparent 100%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* The scan line itself — white hot center, blue edges */}
                <div
                    style={{
                        height: '2px',
                        background:
                            'linear-gradient(90deg, transparent 0%, #2B7EA1 8%, #9be8ff 42%, #ffffff 50%, #9be8ff 58%, #2B7EA1 92%, transparent 100%)',
                        boxShadow:
                            '0 0 18px 6px rgba(43,126,161,0.6),' +
                            '0 0 55px 20px rgba(43,126,161,0.22),' +
                            '0 0 100px 40px rgba(43,126,161,0.08)',
                    }}
                />

                {/* Thin fade trail BELOW the line */}
                <div
                    style={{
                        position: 'absolute',
                        top: '2px',
                        left: 0,
                        right: 0,
                        height: '30px',
                        background:
                            'linear-gradient(to bottom, rgba(43,126,161,0.08) 0%, transparent 100%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Small coordinate readout at the right end — industrial detail */}
                <div
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '5vw',
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        color: 'rgba(43,126,161,0.7)',
                        letterSpacing: '0.15em',
                        userSelect: 'none',
                    }}
                >
                    SCAN&nbsp;■&nbsp;HRP-SYS
                </div>
            </motion.div>

            {/* ── 3. Logo — centered, fades as scan passes it ───────────────────── */}
            <motion.div
                aria-hidden
                className="fixed inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: logoOpacity, zIndex: 201 }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center select-none"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center mb-5"
                        style={{
                            filter: 'drop-shadow(0 0 28px rgba(43,126,161,0.5))',
                        }}
                    >
                        <div className="flex items-center justify-center w-36 h-36 rounded-lg bg-white overflow-hidden">
                        <Image
                            src="/images/hrp_logo.png"
                            alt="HRP Logo"
                            width={500}
                            height={500}
                            priority
                        />
                        </div>
                    </motion.div>

                    {/* Wordmark below badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                        className="text-center"
                    >
                        <p
                            style={{
                                fontFamily: 'var(--font-syne), sans-serif',
                                fontWeight: 700,
                                fontSize: '1.3rem',
                                color: '#ffffff',
                                letterSpacing: '-0.01em',
                                lineHeight: 1,
                                marginBottom: '6px',
                            }}
                        >
                            HRP
                        </p>
                        <p
                            style={{
                                fontFamily: 'var(--font-inter), sans-serif',
                                fontWeight: 400,
                                fontSize: '0.65rem',
                                color: 'rgba(255,255,255,0.38)',
                                letterSpacing: '0.28em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Industrial Products
                        </p>
                    </motion.div>

                    {/* Subtle scan-ready indicator dots */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55, duration: 0.4 }}
                        className="flex items-center gap-2 mt-7"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="block w-1 h-1 rounded-full"
                                style={{ background: 'rgba(43,126,161,0.6)' }}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    )
}