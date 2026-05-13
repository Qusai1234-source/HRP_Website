// Server Component — no 'use client' needed, pure CSS animation via <style> tag

const ITEMS = [
    'SS Bellows',
    'Hydraulic Hoses',
    'Pneumatic Hoses',
    'Pressure Gauges',
    'Valves',
    'Fittings',
]

// Repeat enough times so the seamless loop never shows a gap
const TRACK = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

export default function MarqueeStrip() {
    return (
        <div className="bg-brand-primary overflow-hidden py-3.5" aria-hidden>
            {/* Keyframe defined inline — no globals.css modification needed */}
            <style>{`
        @keyframes hrp-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hrp-marquee-track {
          display: flex;
          width: max-content;
          animation: hrp-marquee 28s linear infinite;
          will-change: transform;
        }
        .hrp-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

            <div className="hrp-marquee-track">
                {TRACK.map((item, i) => (
                    <div key={i} className="flex items-center gap-5 flex-shrink-0 px-7">
                        <span className="font-body font-semibold text-white text-sm tracking-widest uppercase whitespace-nowrap">
                            {item}
                        </span>
                        <span className="text-white/35 text-xs select-none">◆</span>
                    </div>
                ))}
            </div>
        </div>
    )
}