"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   MILESTONE DATA
───────────────────────────────────────────────────────────── */
const MILESTONES = [
  {
    year: "1982",
    label: "The Origin",
    title: "A Single Vision,\nA Trusted Start",
    body: "What began in a modest Hyderabad office with a catalogue of essential industrial components quietly grew into something much larger. HRP Industrial Products was founded on the belief that manufacturers deserve a reliable, knowledgeable supply partner — not just a vendor. From day one, precision and commitment defined every transaction.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80",
    alt: "Industrial workshop at founding",
    stat: "Est. 1983",
    tag: "Origin · Hyderabad",
    isFirst: true,
  },
  {
    year: "2012",
    label: "Chapter II",
    title: "Expanding Into Hydraulics\n& Pneumatics",
    body: "As demand grew beyond local workshops, HRP extended its reach into hydraulics, pneumatic systems, and industrial hose assemblies. The catalogue tripled. The client base doubled. What had started as a local trading operation was quickly becoming a full-spectrum industrial supply house.",
    image: "https://images.unsplash.com/photo-1581093196277-9f608bb3b511?w=900&q=80",
    alt: "Hydraulic industrial systems",
    stat: "3× Product Range",
    tag: "Hydraulics · Pneumatics",
  },
  {
    year: "2015",
    label: "Chapter III",
    title: "Global Partnerships,\nLocal Trust",
    body: "Recognition came not through advertising, but through reliability. By 2015, leading global manufacturers had extended their trust to HRP, bringing certified product lines and a new tier of industrial credibility. The partnerships forged in this era remain the backbone of our premium supply chain.",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=900&q=80",
    alt: "Industrial partnership and engineering",
    stat: "10+ Brand Partners",
    tag: "Partnerships · Certification",
    showBrands: false,   // ← Brand logos row injects right after this milestone
  },
  {
    year: "2018",
    label: "Chapter IV",
    title: "A Network That\nSpans the Nation",
    body: "What once served a single city now reached across India. Logistics infrastructure expanded. Delivery timelines tightened. HRP's reputation for same-week dispatch and consistent quality made it the preferred industrial supplier across 10+ cities — with operations growing year on year.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
    alt: "Pan-India logistics and supply chain",
    stat: "10+ Cities Served",
    tag: "Pan-India · Logistics",
  },
  {
    year: "2021",
    label: "Chapter V",
    title: "Engineering Depth\nat Scale",
    body: "The company entered its most technically demanding era — instrumentation systems, vacuum components, SS bellows, compressors, and precision automation products now defined HRP's portfolio. Engineering depth had become the brand's true competitive advantage, separating us from generalist distributors.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
    alt: "Precision engineering and instrumentation",
    stat: "200+ Product SKUs",
    tag: "Instrumentation · Vacuum · Bellows",
  },
  {
    year: "2024",
    label: "Chapter VI",
    title: "Trusted Across\nEvery Sector",
    body: "Manufacturing floors, automation labs, construction sites, and heavy industry operations — HRP had become the common thread. Over 200 clients across India now rely on a single industrial partner for every need. The name HRP has come to mean one thing: it will be there, on time, every time.",
    image: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=900&q=80",
    alt: "Multi-sector industrial operations",
    stat: "200+ Active Clients",
    tag: "Manufacturing · Automation · Construction",
  },
  {
    year: "2026",
    label: "Present Day",
    title: "Built to Last.\nBuilt to Grow.",
    body: "Fifteen years of building trust, one delivery at a time. HRP today is more than a supplier — it is an industrial partner deeply woven into the operations of the clients it serves. The portfolio is wider, the network deeper, and the commitment to quality unchanged. The journey continues.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&q=80",
    alt: "HRP warehouse and operations team",
    stat: "15+ Years Strong",
    tag: "Legacy · Growth · Reliability",
    isLast: true,
  },
];

/* ─────────────────────────────────────────────────────────────
   BRAND LOGOS DATA
───────────────────────────────────────────────────────────── */
const BRANDS = [
  { name: "Festo", desc: "Pneumatics & Automation" },
  { name: "Schmalz", desc: "Vacuum Technology" },
  { name: "Indef", desc: "Lifting & Hoisting" },
  { name: "Graco", desc: "Fluid Handling" },
  { name: "Binks", desc: "Paint Equipment" },
  { name: "Kito", desc: "Chain Hoists" },
  { name: "Yale", desc: "Material Handling" },
  { name: "Parker", desc: "Motion & Control" },
];

/* ─────────────────────────────────────────────────────────────
   INTERSECTION OBSERVER HOOK
───────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─────────────────────────────────────────────────────────────
   BRANDS ROW COMPONENT
───────────────────────────────────────────────────────────── */
function BrandsRow() {
  const [ref, visible] = useReveal(0.15);
  return (
    <div ref={ref} className={`hrptl-brands-wrap ${visible ? "hrptl-brands--on" : ""}`}>
      <div className="hrptl-brands-header">
        <span className="hrptl-brands-eyebrow">Strategic Capabilities</span>
        <p className="hrptl-brands-sub">
          Authorized distribution channels and direct partnerships that reinforce our global engineering standards.
        </p>
      </div>
      <div className="hrptl-brands-grid">
        {BRANDS.map((b) => (
          <div key={b.name} className="hrptl-brand-card">
            <div className="hrptl-brand-name">{b.name}</div>
            <div className="hrptl-brand-desc">{b.desc}</div>
          </div>
        ))}
      </div>
      <p className="hrptl-brands-note">*All trademarks belong to their respective certified manufacturers.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SPINE — scroll-driven fill
───────────────────────────────────────────────────────────── */
function Spine({ containerRef }) {
  const fillRef = useRef(null);
  useEffect(() => {
    function update() {
      const container = containerRef.current;
      const fill = fillRef.current;
      if (!container || !fill) return;
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight;
      const passed = Math.min(Math.max(-rect.top + window.innerHeight * 0.55, 0), total);
      fill.style.height = `${(passed / total) * 100}%`;
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [containerRef]);

  return (
    <div className="hrptl-spine">
      <div className="hrptl-spine-track" />
      <div className="hrptl-spine-fill" ref={fillRef} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MILESTONE ROW
───────────────────────────────────────────────────────────── */
function MilestoneRow({ m, index }) {
  const isEven = index % 2 === 0;
  const isFirst = !!m.isFirst;
  const isLast = !!m.isLast;

  const [rowRef, rowVisible] = useReveal(0.1);
  const [textRef, textVisible] = useReveal(0.12);
  const [imgRef, imgVisible] = useReveal(0.08);

  return (
    <>
      <div className="hrptl-row" ref={rowRef}>

        {/* SPINE NODE */}
        <div className={`hrptl-node ${rowVisible ? "hrptl-node--on" : ""} ${isFirst ? "hrptl-node--first" : ""}`}>
          <div className="hrptl-node-ring">
            <div className="hrptl-node-dot" />
          </div>
          <div className="hrptl-node-year">{m.year}</div>
        </div>

        {/* CONTENT */}
        <div className={`hrptl-cols ${isEven ? "hrptl-cols--even" : "hrptl-cols--odd"}`}>

          {/* TEXT */}
          <div
            ref={textRef}
            className={`hrptl-text ${isEven ? "hrptl-text--even" : "hrptl-text--odd"} ${textVisible ? "hrptl-text--on" : ""}`}
            style={{ transitionDelay: "80ms" }}
          >
            <span className="hrptl-label">{m.label}</span>
            <span className="hrptl-year-mob">{m.year}</span>

            <h3 className="hrptl-title">
              {m.title.split("\n").map((line, li, arr) => (
                <span key={li}>{line}{li < arr.length - 1 && <br />}</span>
              ))}
            </h3>

            <div
              className={`hrptl-rule ${textVisible ? "hrptl-rule--on" : ""}`}
              style={{ transitionDelay: "230ms" }}
            />

            <p className="hrptl-body">{m.body}</p>

            {isLast && (
              <div className="hrptl-human-note">
                <span className="hrptl-human-icon">🏭</span>
                <span>
                  Our Hyderabad operations centre — the hub of procurement, quality checking, and same-week dispatch that our 200+ clients rely on.
                </span>
              </div>
            )}

            <div className={`hrptl-meta ${isEven ? "hrptl-meta--even" : "hrptl-meta--odd"}`}>
              <span className="hrptl-stat">{m.stat}</span>
              <span className="hrptl-tag">{m.tag}</span>
            </div>
          </div>

          {/* IMAGE */}
          <div
            ref={imgRef}
            className={`hrptl-img-wrap ${isEven ? "hrptl-img--even" : "hrptl-img--odd"} ${imgVisible ? "hrptl-img--on" : ""}`}
            style={{ transitionDelay: isEven ? "180ms" : "120ms" }}
          >
            <div className="hrptl-img-box">
              <img
                src={m.image}
                alt={m.alt}
                className={`hrptl-img ${imgVisible ? "hrptl-img-scale--on" : ""}`}
                loading="lazy"
                draggable={false}
              />
              <div className="hrptl-img-grad" />
              <div className="hrptl-img-vignette" />
              <div className="hrptl-img-chapter">{m.label}</div>
              {isFirst && <div className="hrptl-img-founder-badge">Founding Year</div>}
              {isLast && <div className="hrptl-img-ops-badge">Hyderabad HQ</div>}
            </div>
          </div>

        </div>
      </div>

      {/* Inject Brand logo block seamlessly inside the chronological story split */}
      {m.showBrands && <BrandsRow />}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   CLOSING CTA SECTION
───────────────────────────────────────────────────────────── */
function ClosingCTA() {
  const [ref, visible] = useReveal(0.2);

  return (
    <div ref={ref} className={`hrptl-cta-wrap ${visible ? "hrptl-cta--on" : ""}`}>
      <div className="hrptl-cta-bg" />
      <div className="hrptl-cta-glow" />

      <div className="hrptl-cta-inner">
        <p className="hrptl-cta-eyebrow">Ready to Work Together?</p>

        <h2 className="hrptl-cta-h2">
          Your Reliable Industrial<br />
          <em>Supply Partner Awaits</em>
        </h2>

        <p className="hrptl-cta-sub">
          Whether you need a single precision component or a complete supply chain solution —
          HRP has the product, the expertise, and the commitment to deliver.
        </p>

        <div className="hrptl-cta-stats">
          {[
            { n: "44+", l: "Years Experience" },
            { n: "100K+", l: "Active Clients" },
            { n: "10K+", l: "Products" },
            { n: "Pan India", l: "Served" },
          ].map((s) => (
            <div key={s.l} className="hrptl-cta-stat">
              <span className="hrptl-cta-stat-n">{s.n}</span>
              <span className="hrptl-cta-stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        <div className="hrptl-cta-btns">
          <Link href="/products" className="hrptl-cta-btn-primary">
            Explore Our Products
          </Link>
          <Link href="/contact" className="hrptl-cta-btn-secondary">
            Get a Custom Quote
          </Link>
        </div>

        <p className="hrptl-cta-trust">
          ✓ Same-week quotations &nbsp;&nbsp; ✓ Pan-India delivery &nbsp;&nbsp; ✓ Authorised brand distributor
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function CompanyJourney() {
  const [headerRef, headerOn] = useReveal(0.25);
  const timelineRef = useRef(null);

  return (
    <>
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,200;0,300;0,400;1,300&display=swap');

        .hrptl-section *, .hrptl-section *::before, .hrptl-section *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        /* ── DARK SECTION TRANSFORM ── */
        .hrptl-section {
          background: #0b1219; 
          padding: 96px 0 0;
          position: relative;
          overflow: hidden;
        }
        .hrptl-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(74,158,197,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,158,197,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .hrptl-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 28px;
          position: relative;
        }

        /* ── DARK HEADER ── */
        .hrptl-header {
          text-align: center;
          margin-bottom: 88px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .hrptl-header--on { opacity: 1; transform: none; }

        .hrptl-header-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.68rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #4a9ec5; 
          margin-bottom: 14px;
        }
        .hrptl-header-h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 3.8vw, 3.1rem);
          color: #f1f5f9; 
          line-height: 1.07;
          letter-spacing: -0.03em;
          margin-bottom: 18px;
        }
        .hrptl-header-h2 em { color: #8DC63F; font-style: normal; }
        .hrptl-header-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.97rem;
          color: #94a3b8; 
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .hrptl-header-accent {
          width: 44px; height: 2px;
          background: linear-gradient(90deg, #4a9ec5, #8DC63F);
          margin: 20px auto 0;
          border-radius: 2px;
        }

        /* ── TIMELINE CONTAINER ── */
        .hrptl-timeline { position: relative; }

        /* ── SPINE ── */
        .hrptl-spine {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0; bottom: 0;
          width: 1px;
          z-index: 10; /* FIX: Raised above images to ensure alignment tracks stay crisp */
          pointer-events: none;
        }
        .hrptl-spine-track { position: absolute; inset: 0; background: rgba(74,158,197,0.08); }
        .hrptl-spine-fill {
          position: absolute;
          top: 0; left: 0; right: 0; height: 0%;
          background: linear-gradient(to bottom, #4a9ec5 0%, #3b82f6 50%, #8DC63F 100%);
          transition: height 0.08s linear;
        }

        /* ── ROW ── */
        .hrptl-row {
          position: relative;
          margin-bottom: 100px;
        }
        .hrptl-row:last-child { margin-bottom: 0; }

        /* ── TIMELINE NODES & YEAR FIXES ── */
        .hrptl-node {
          position: absolute;
          left: 50%; top: 42px;
          transform: translateX(-50%);
          z-index: 20; /* FIX: Bumped layer index higher than image layout wrappers */
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
        }
        .hrptl-node-ring {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2px solid #4a9ec5;
          background: #0b1219;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: scale(0.4);
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 0 12px rgba(74,158,197,0.25);
        }
        .hrptl-node--on .hrptl-node-ring { opacity: 1; transform: scale(1); }
        .hrptl-node--first .hrptl-node-ring {
          width: 24px; height: 24px;
          border-color: #8DC63F;
          box-shadow: 0 0 16px rgba(141,198,63,0.3);
        }
        .hrptl-node-dot { width: 6px; height: 6px; border-radius: 50%; background: #4a9ec5; }
        .hrptl-node--first .hrptl-node-dot { background: #8DC63F; width: 8px; height: 8px; }
        
        .hrptl-node-year {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: #4a9ec5;
          /* FIX: Solid background shield + high backdrop blur prevents image overlaps from making text messy */
          background: #0b1219; 
          backdrop-filter: blur(8px);
          border: 1px solid rgba(74,158,197,0.35);
          padding: 4px 12px; border-radius: 100px;
          white-space: nowrap;
          opacity: 0; transform: scale(0.85) translateY(4px);
          transition: opacity 0.5s ease 0.14s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.14s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        .hrptl-node--on .hrptl-node-year { opacity: 1; transform: scale(1) translateY(0); }

        /* ── COLUMNS ── */
        .hrptl-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px; /* FIX: Expanded gap spacing across screens to give nodes breathing room */
          position: relative; z-index: 2;
          align-items: center;
        }
        .hrptl-cols--even > *:first-child { order: 1; }
        .hrptl-cols--even > *:last-child  { order: 2; }
        .hrptl-cols--odd  > *:first-child { order: 2; }
        .hrptl-cols--odd  > *:last-child  { order: 1; }

        /* ── TEXT CONTENT ── */
        .hrptl-text {
          opacity: 0;
          transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1);
          z-index: 5;
        }
        /* FIX: Adjusted padding bounds safely away from center track line */
        .hrptl-text--even { transform: translateX(-28px); text-align: right; padding-right: 40px; }
        .hrptl-text--odd  { transform: translateX(28px);  text-align: left;  padding-left: 40px;  }
        .hrptl-text--on   { opacity: 1; transform: none !important; }

        .hrptl-label {
          display: block;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.63rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: #8DC63F;
          margin-bottom: 9px;
        }
        .hrptl-year-mob {
          display: none;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 0.72rem; letter-spacing: 0.1em;
          color: #4a9ec5;
          margin-bottom: 6px;
        }
        .hrptl-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: clamp(1.18rem, 1.8vw, 1.55rem);
          line-height: 1.22; letter-spacing: -0.02em;
          color: #f8fafc; 
          margin-bottom: 18px;
        }
        .hrptl-rule {
          height: 2px; width: 0%;
          background: linear-gradient(90deg, #4a9ec5, #8DC63F);
          border-radius: 2px; margin-bottom: 18px;
          transition: width 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .hrptl-text--even .hrptl-rule { margin-left: auto; }
        .hrptl-rule--on { width: 44px; }
        .hrptl-body {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.9rem; line-height: 1.8;
          color: #cbd5e1; 
          margin-bottom: 20px; font-style: italic;
        }

        .hrptl-human-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(74,158,197,0.06);
          border: 1px solid rgba(74,158,197,0.15);
          border-left: 3px solid #4a9ec5;
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 18px;
          text-align: left;
        }
        .hrptl-human-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .hrptl-human-note span:last-child {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.8rem; line-height: 1.6;
          color: #94a3b8;
        }

        .hrptl-meta {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .hrptl-meta--even { justify-content: flex-end; }
        .hrptl-meta--odd  { justify-content: flex-start; }
        .hrptl-stat {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.7rem; letter-spacing: 0.06em;
          color: #4a9ec5;
          background: rgba(74,158,197,0.12);
          border: 1px solid rgba(74,158,197,0.25);
          padding: 4px 12px; border-radius: 100px;
        }
        .hrptl-tag {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.62rem; letter-spacing: 0.1em;
          color: #64748b;
        }

        /* ── IMAGES WITH COLLISION PREVENTIONS ── */
        .hrptl-img-wrap {
          opacity: 0;
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1);
          z-index: 1; /* Keep images below timeline typography layers */
        }
        .hrptl-img--even { transform: translateX(28px); }
        .hrptl-img--odd  { transform: translateX(-28px); }
        .hrptl-img--on   { opacity: 1; transform: none !important; }
        .hrptl-img-box {
          position: relative; border-radius: 12px; overflow: hidden;
          aspect-ratio: 4 / 3; background: #0f172a;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2), 0 20px 25px -5px rgba(0,0,0,0.3);
        }
        .hrptl-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transform: scale(1.07);
          transition: transform 1.2s cubic-bezier(0.22,1,0.36,1), filter 0.9s ease;
          filter: brightness(0.75) saturate(0.75);
        }
        .hrptl-img-scale--on { transform: scale(1.0); filter: brightness(0.9) saturate(0.9); }
        .hrptl-img-grad {
          position: absolute; inset: 0;
          background:
            linear-gradient(140deg, rgba(74,158,197,0.12) 0%, transparent 48%),
            linear-gradient(to top, rgba(11,18,25,0.6) 0%, transparent 44%);
          pointer-events: none;
        }
        .hrptl-img-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 130% 130% at 50% 50%, transparent 40%, rgba(11,18,25,0.4) 100%);
          pointer-events: none;
        }
        .hrptl-img-chapter {
          position: absolute; bottom: 13px; left: 14px;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.58rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          background: rgba(15,23,42,0.65); backdrop-filter: blur(6px);
          padding: 4px 10px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.08);
        }
        .hrptl-img-founder-badge, .hrptl-img-ops-badge {
          position: absolute; top: 14px; right: 14px;
          font-family: 'DM Sans', sans-serif; font-weight: 400;
          font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
          background: rgba(15,23,42,0.65); backdrop-filter: blur(6px);
          padding: 4px 10px; border-radius: 3px;
        }
        .hrptl-img-founder-badge { color: #8DC63F; border: 1px solid rgba(141,198,63,0.25); }
        .hrptl-img-ops-badge     { color: #4a9ec5; border: 1px solid rgba(74,158,197,0.25); }

        /* ══════════════════════════════════════════════════════
           BRANDS ROW
        ══════════════════════════════════════════════════════ */
        .hrptl-brands-wrap {
          margin: 40px 0 120px;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .hrptl-brands--on { opacity: 1; transform: none; }

        .hrptl-brands-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .hrptl-brands-eyebrow {
          display: block;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: #8DC63F;
          margin-bottom: 8px;
        }
        .hrptl-brands-sub {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.85rem; color: #94a3b8;
          max-width: 480px; margin: 0 auto; line-height: 1.6;
        }

        .hrptl-brands-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .hrptl-brand-card {
          background: #0f172a; 
          border: 1px solid rgba(74,158,197,0.12);
          border-radius: 10px;
          padding: 24px 16px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: default;
        }
        .hrptl-brand-card:hover {
          border-color: rgba(141,198,63,0.4);
          box-shadow: 0 10px 30px rgba(141,198,63,0.06);
          transform: translateY(-4px);
          background: #141e33;
        }
        .hrptl-brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.15rem;
          letter-spacing: -0.01em;
          color: #64748b; 
          margin-bottom: 6px;
          transition: color 0.3s ease;
        }
        .hrptl-brand-card:hover .hrptl-brand-name {
          color: #f8fafc; 
        }
        .hrptl-brand-desc {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #475569;
          transition: color 0.3s ease;
        }
        .hrptl-brand-card:hover .hrptl-brand-desc {
          color: #4a9ec5;
        }

        .hrptl-brands-note {
          text-align: center; margin-top: 22px;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.7rem; color: #475569;
          letter-spacing: 0.04em;
        }

        /* ══════════════════════════════════════════════════════
           CLOSING CTA 
        ══════════════════════════════════════════════════════ */
        .hrptl-cta-wrap {
          position: relative;
          margin-top: 100px;
          padding: 96px 28px;
          overflow: hidden;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.85s ease, transform 0.85s cubic-bezier(0.22,1,0.36,1);
        }
        .hrptl-cta--on { opacity: 1; transform: none; }

        .hrptl-cta-bg {
          position: absolute; inset: 0;
          background: #080d12;
        }
        .hrptl-cta-bg::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(74,158,197,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,158,197,0.04) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .hrptl-cta-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 65% 55% at 20% 50%, rgba(74,158,197,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 45% 40% at 80% 30%, rgba(141,198,63,0.05) 0%, transparent 60%);
        }

        .hrptl-cta-inner {
          position: relative; z-index: 2;
          max-width: 800px; margin: 0 auto;
          text-align: center;
        }

        .hrptl-cta-eyebrow {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(141,198,63,0.8);
          margin-bottom: 16px;
        }
        .hrptl-cta-h2 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(1.9rem, 3.5vw, 3rem);
          color: #f1f5f9;
          line-height: 1.1; letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .hrptl-cta-h2 em { color: #8DC63F; font-style: italic; }
        .hrptl-cta-sub {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.95rem; line-height: 1.75;
          color: #94a3b8;
          max-width: 560px; margin: 0 auto 40px;
        }

        .hrptl-cta-stats {
          display: flex; justify-content: center;
          gap: 0; margin-bottom: 44px;
          border: 1px solid rgba(74,158,197,0.15);
          border-radius: 10px; overflow: hidden;
          background: rgba(15,23,42,0.4);
        }
        .hrptl-cta-stat {
          flex: 1; padding: 20px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          border-right: 1px solid rgba(74,158,197,0.12);
        }
        .hrptl-cta-stat:last-child { border-right: none; }
        .hrptl-cta-stat-n {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.6rem; line-height: 1; letter-spacing: -0.03em;
          color: #4a9ec5;
        }
        .hrptl-cta-stat-l {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: #64748b;
        }

        .hrptl-cta-btns {
          display: flex; justify-content: center;
          gap: 16px; flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .hrptl-cta-btn-primary {
          display: inline-flex; align-items: center;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.9rem; letter-spacing: 0.02em;
          color: #0b1219;
          background: #8DC63F;
          padding: 14px 32px; border-radius: 6px;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 20px rgba(141,198,63,0.2);
        }
        .hrptl-cta-btn-primary:hover {
          background: #9ed946;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(141,198,63,0.3);
        }
        .hrptl-cta-btn-secondary {
          display: inline-flex; align-items: center;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.9rem; letter-spacing: 0.02em;
          color: #f1f5f9;
          background: transparent;
          border: 1.5px solid rgba(74,158,197,0.4);
          padding: 14px 32px; border-radius: 6px;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .hrptl-cta-btn-secondary:hover {
          background: rgba(74,158,197,0.1);
          border-color: rgba(74,158,197,0.7);
          transform: translateY(-2px);
        }

        .hrptl-cta-trust {
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          font-size: 0.72rem; letter-spacing: 0.08em;
          color: #475569;
        }

        /* ── RESPONSIVE RESPONSES & COLLISION BREAKPOINTS ── */
        @media (max-width: 1024px) {
          /* FIX: Tighten column gaps for tablet views to keep layout components compact */
          .hrptl-cols { gap: 32px; }
          .hrptl-text--even { padding-right: 20px; }
          .hrptl-text--odd { padding-left: 20px; }
        }

        @media (max-width: 768px) {
          .hrptl-section { padding: 68px 0 0; }
          .hrptl-inner   { padding: 0 20px; }
          .hrptl-header  { margin-bottom: 56px; }
          .hrptl-header-h2 { font-size: clamp(1.7rem, 6vw, 2.2rem); }

          .hrptl-spine { left: 18px; transform: none; }
          .hrptl-node { left: 18px; top: 0; transform: none; flex-direction: row; gap: 10px; z-index: 20; }
          .hrptl-node-year { display: none; }

          .hrptl-row { padding-left: 44px; margin-bottom: 60px; }
          .hrptl-cols { grid-template-columns: 1fr; gap: 18px; }

          .hrptl-cols--even > *, .hrptl-cols--odd > * { order: unset !important; }
          .hrptl-cols--even .hrptl-text, .hrptl-cols--odd .hrptl-text { order: 1 !important; }
          .hrptl-cols--even .hrptl-img-wrap, .hrptl-cols--odd .hrptl-img-wrap { order: 2 !important; }

          .hrptl-text--even, .hrptl-text--odd { text-align: left; padding: 0; transform: translateY(18px); }
          .hrptl-text--on { transform: none !important; }
          .hrptl-text--even .hrptl-rule { margin-left: 0; }
          .hrptl-meta--even { justify-content: flex-start; }

          .hrptl-img--even, .hrptl-img--odd { transform: translateY(20px); }
          .hrptl-img--on  { transform: none !important; }
          .hrptl-img-box  { aspect-ratio: 16 / 10; }
          .hrptl-year-mob { display: block; }

          .hrptl-brands-grid { grid-template-columns: repeat(2, 1fr); }
          .hrptl-brands-wrap { margin-bottom: 60px; }

          .hrptl-cta-wrap  { padding: 64px 20px; margin-top: 60px; }
          .hrptl-cta-stats { flex-wrap: wrap; border-radius: 8px; }
          .hrptl-cta-stat  { flex: 1 1 45%; border-bottom: 1px solid rgba(74,158,197,0.12); }
          .hrptl-cta-stat:nth-child(3), .hrptl-cta-stat:nth-child(4) { border-bottom: none; }
          .hrptl-cta-stat:nth-child(even) { border-right: none; }
          .hrptl-cta-stat-n { font-size: 1.3rem; }

          .hrptl-cta-btns { flex-direction: column; align-items: center; }
          .hrptl-cta-btn-primary, .hrptl-cta-btn-secondary { width: 100%; max-width: 320px; justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hrptl-header, .hrptl-text, .hrptl-img-wrap,
          .hrptl-node-ring, .hrptl-node-year, .hrptl-rule,
          .hrptl-img, .hrptl-brands-wrap, .hrptl-cta-wrap {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .hrptl-rule { width: 44px; }
          .hrptl-spine-fill { transition: none; }
        }
      `}</style>

      <section className="hrptl-section" aria-label="Company Journey Timeline">
        <div className="hrptl-inner">

          {/* HEADER */}
          <div ref={headerRef} className={`hrptl-header ${headerOn ? "hrptl-header--on" : ""}`}>
            <p className="hrptl-header-eyebrow">Est. 1983 · Industrial Heritage</p>
            <h2 className="hrptl-header-h2">
              Engineering Growth<br /><em>Since 1983</em>
            </h2>
            <p className="hrptl-header-sub">
              Fifteen years of building trust, expanding reach, and deepening our engineering expertise — one partnership at a time.
            </p>
            <div className="hrptl-header-accent" />
          </div>

          {/* TIMELINE + INTERLEAVED BRANDS */}
          <div className="hrptl-timeline" ref={timelineRef}>
            <Spine containerRef={timelineRef} />
            {MILESTONES.map((m, i) => (
              <MilestoneRow key={m.year} m={m} index={i} />
            ))}
          </div>

        </div>

        {/* CLOSING CTA */}
        <ClosingCTA />

      </section>
    </>
  );
}