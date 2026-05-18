'use client'

import { useState } from 'react'
// Note: hovered state removed — no hover animation on logos

const BRANDS = [
    { name: 'Pneumax', logo: 'pneumax.svg' },
    { name: 'Dunlop', logo: 'dunlop.svg' },
    { name: 'Painter', logo: 'painter.png' },
    { name: 'Conact', logo: 'conact.svg' },
    { name: 'Wika', logo: 'wika.png' },
    { name: 'PIX', logo: 'pix.png' },
    { name: 'Schmalz', logo: 'schmalz.png' },
    { name: 'Parker', logo: 'parker.png' },
    { name: 'Piab', logo: 'piab.png' },
    { name: 'Band-IT', logo: 'band-it.png' },
    { name: 'Jolly', logo: 'jolly.png' },
    { name: 'Unibor', logo: 'unibor.png' },
    { name: 'Techno', logo: 'techno.png' },
    { name: 'Molykote', logo: 'molykote.png' },
    { name: 'Janatics', logo: 'janatics.png' },
    { name: 'Makita', logo: 'makita.png' },
    { name: 'Fevicol', logo: 'fevicol.png' },
    { name: 'Dowsil', logo: 'dowsil.png' },
    { name: 'Loctite', logo: 'loctite.png' },
    { name: 'Baumer', logo: 'baumer.svg' },
    { name: 'Bosch', logo: 'bosch.svg' },
]

// Triple for seamless loop — translateX(-33.333%) = exactly one set
const TRACK = [...BRANDS, ...BRANDS, ...BRANDS]

// ─── Logo cell ────────────────────────────────────────────────────────────────
function BrandItem({ brand }) {
    const [broken, setBroken] = useState(false)

    return (
        <div className="flex-shrink-0 px-8">
            <div
                style={{
                    width: '160px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {!broken ? (
                    <img
                        src={`/images/brands/${brand.logo}`}
                        alt={brand.name}
                        onError={() => setBroken(true)}
                        style={{
                            maxHeight: '128px',
                            maxWidth: '300px',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                        loading="lazy"
                    />
                ) : (
                    <span
                        style={{
                            fontFamily: 'var(--font-syne), sans-serif',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'rgba(58,69,85,0.4)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {brand.name}
                    </span>
                )}
            </div>
        </div>
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function BrandsMarquee() {
    return (
        <section
            className="bg-brand-light"
            // Extra top padding absorbs any navbar bleed on first render
            style={{ paddingTop: '80px', paddingBottom: '80px' }}
        >
            <style>{`
        @keyframes hrp-brands-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .hrp-brands-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: hrp-brands-scroll 42s linear infinite;
          will-change: transform;
        }
        .hrp-brands-track:hover {
          animation-play-state: paused;
        }
      `}</style>

            {/* Header — constrained width, never touches edges */}
            <div
                style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center', marginBottom: '56px' }}
            >
                <p
                    style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--color-brand-primary, #2B7EA1)',
                        marginBottom: '12px',
                    }}
                >
                    Authorized Dealers &amp; Stockists
                </p>
                <h2
                    style={{
                        fontFamily: 'var(--font-syne), sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                        color: 'var(--color-brand-dark, #1A2533)',
                        lineHeight: 1.1,
                    }}
                >
                    Brands We Carry
                </h2>
            </div>

            {/* Marquee strip — overflow hidden on a separate wrapper so edge fades clip correctly */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>

                {/* Left fade — starts from the very left edge, not from max-width container */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: '120px', zIndex: 10, pointerEvents: 'none',
                        background: 'linear-gradient(to right, #f4f6f8 0%, transparent 100%)',
                    }}
                />
                {/* Right fade */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0,
                        width: '120px', zIndex: 10, pointerEvents: 'none',
                        background: 'linear-gradient(to left, #f4f6f8 0%, transparent 100%)',
                    }}
                />

                {/* Divider lines */}
                <div style={{ borderTop: '1px solid rgba(58,69,85,0.08)', borderBottom: '1px solid rgba(58,69,85,0.08)' }}>
                    <div
                        className="hrp-brands-track"
                        // Extra left padding so first logo is never flush with the fade mask
                        style={{ paddingLeft: '48px' }}
                    >
                        {TRACK.map((brand, i) => (
                            <BrandItem key={`${brand.name}-${i}`} brand={brand} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Brand count */}
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
                <p
                    style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '0.7rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(58,69,85,0.3)',
                    }}
                >
                    {BRANDS.length} Authorized Brands
                </p>
            </div>
        </section>
    )
}