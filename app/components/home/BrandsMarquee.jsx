// Server Component — pure CSS, no client JS needed

const BRANDS = [
    { name: 'Dunlop', logo: 'dunlop.svg' },
    { name: 'Pneumax', logo: 'pneumax.svg' },
    { name: 'Conact Pneumatics', logo: 'conact.svg' },
    { name: 'Baumer', logo: 'baumer.svg' },
    { name: 'Bosch', logo: 'bosch.svg' },
    { name: 'Techno', logo: 'techno.png' },
    { name: 'Alpha Hoses', logo: 'alpha-hoses.png' },
    { name: 'Wadfow', logo: 'wadfow.png' },
    { name: 'Painter', logo: 'painter.png' },
    { name: 'Khaitan', logo: 'khaitan.png' },
]

const TRACK = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS]

export default function BrandsMarquee() {
    return (
        <section className="py-20 bg-brand-light overflow-hidden">
            <style>{`
        @keyframes hrp-brands-ltr {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hrp-brands-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: hrp-brands-ltr 36s linear infinite;
          will-change: transform;
        }
        .hrp-brands-track:hover {
          animation-play-state: paused;
        }
        .hrp-brand-logo {
          opacity: 0.45;
          filter: grayscale(1);
          transition: opacity 0.35s ease, filter 0.35s ease, transform 0.35s ease;
        }
        .hrp-brand-logo:hover {
          opacity: 1;
          filter: grayscale(0);
          transform: scale(1.08);
        }
      `}</style>

            {/* Section header */}
            <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
                <p className="font-body text-brand-primary font-semibold text-sm tracking-widest uppercase mb-3">
                    Authorized Dealers &amp; Stockists
                </p>
                <h2
                    className="font-heading font-bold text-brand-dark"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                >
                    Brands We Carry
                </h2>
            </div>

            {/* Marquee */}
            <div className="relative">

                {/* Edge fades */}
                <div aria-hidden className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to right, #f4f6f8, transparent)' }} />
                <div aria-hidden className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, #f4f6f8, transparent)' }} />

                {/* Subtle divider lines above and below the logo strip */}
                <div className="border-t border-b border-gray-200/60 py-6">
                    <div className="hrp-brands-track">
                        {TRACK.map((brand, i) => (
                            <div key={i} className="flex-shrink-0 flex items-center justify-center w-48 h-16 px-6">
                                <img
                                    src={`/images/brands/${brand.logo}`}
                                    alt={brand.name}
                                    className="hrp-brand-logo w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}