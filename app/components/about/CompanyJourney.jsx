"use client";
// app/components/about/CompanyJourney.jsx
// About page hero + "Who We Are" intro + scroll-driven timeline

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   MILESTONE DATA — Accurate Hydraulics & Rubber Products company history
───────────────────────────────────────────────────────────── */
const MILESTONES = [
  {
    year: "1980",
    label: "The Arrival",
    title: "Recognising the\nCoromandel Opportunity",
    body: "Founder Safdar Alimohammed Tambawala, originally from Sidhpur, Gujarat, recognised the untapped industrial potential of the Coromandel Coast and relocated to Visakhapatnam — laying the groundwork for what would become a multi-generational enterprise.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80",
    alt: "Industrial setting at founding",
    stat: "Sidhpur → Vizag",
    tag: "Origin · Coromandel Coast · Gujarat Roots",
    isFirst: true,
  },
  {
    year: "1983",
    label: "Foundation",
    title: "Calcutta Hardware\nand Tools Co.",
    body: "The business was formally established under the name Calcutta Hardware and Tools Co., beginning operations as a hardware and tools stockist serving the emerging industrial corridor of Visakhapatnam.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&q=80",
    alt: "Hardware and tools stockist operations",
    stat: "Est. 1983",
    tag: "Hardware · Tools · Industrial Stockist",
  },
  {
    year: "1996",
    label: "Second Generation",
    title: "Fluid Mechanics &\nRubber Engineering",
    body: "Mukarram Safdar Tambawala joined the business and drove an aggressive expansion into specialised product verticals — high-pressure hydraulic hose portfolios, custom rubber components, pneumatic control lines, and tier-1 brand representation. Hydraulics & Rubber Products's transformation from a general hardware dealer into a focused industrial solutions provider had begun.",
    image: "https://images.unsplash.com/photo-1581093196277-9f608bb3b511?w=900&q=80",
    alt: "Hydraulic and pneumatic industrial systems",
    stat: "3× Product Range",
    tag: "Hydraulics · Pneumatics · Rubber Engineering",
  },
  {
    year: "2000",
    label: "Rebranding",
    title: "Hydraulics &\nRubber Products",
    body: "To reflect the company's evolved identity and specialised focus, the business was officially renamed Hydraulics and Rubber Products (HRP) — a name that communicated engineering expertise and product depth to both local and national industrial clients.",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=900&q=80",
    alt: "Industrial engineering and brand identity",
    stat: "Hydraulics & Rubber Products Born",
    tag: "Rebranding · Engineering Identity",
  },
  {
    year: "2013",
    label: "National Scale",
    title: "Pan-India Industrial\nSupply Network",
    body: "Huzaifa Sheik Shabbir Marhaba joined and took charge of corporate and national accounts. Under his leadership, Hydraulics & Rubber Products successfully built a robust national client portfolio — scaling from a regional powerhouse into a recognised Pan-India industrial supply network.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
    alt: "Pan-India logistics and supply network",
    stat: "Pan-India Network",
    tag: "Corporate Accounts · National Expansion",
  },
  {
    year: "Today",
    label: "Present Day",
    title: "A Name Synonymous\nWith Reliability",
    body: "Hydraulics & Rubber Products now serves a diverse portfolio of clients across India's most demanding industrial verticals — maintaining the same commitment to precision and reliability that defined its founding. The name Hydraulics & Rubber Products has come to mean one thing: engineered reliability, every time.",
    image: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=900&q=80",
    alt: "Hydraulics & Rubber Products industrial supply operations",
    stat: "40+ Years Strong",
    tag: "Industrial Excellence · National Reach",
    isLast: true,
  },
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
    <div className="hrptl-row" ref={rowRef}>

      {/* SPINE NODE */}
      <div className={`hrptl-node ${rowVisible ? "hrptl-node--on" : ""} ${isFirst ? "hrptl-node--first" : ""}`}>
        <div className="hrptl-node-ring">
          <div className="hrptl-node-dot" />
        </div>
        <div className="hrptl-node-year">{m.year}</div>
      </div>

      {/* CONTENT COLUMNS */}
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
                Our Visakhapatnam operations centre — the hub from which we serve India&rsquo;s
                most demanding industrial clients with precision and reliability, since 1983.
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
            {isFirst && <div className="hrptl-img-founder-badge">Founding · 1980</div>}
            {isLast && <div className="hrptl-img-ops-badge">Visakhapatnam HQ</div>}
          </div>
        </div>

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

        .hrptl-section *, .hrptl-section *::before, .hrptl-section *::after,
        .hrptl-about-hero *, .hrptl-about-hero *::before, .hrptl-about-hero *::after,
        .hrptl-intro *, .hrptl-intro *::before, .hrptl-intro *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        /* ════════════════════════════════════════════════════════
           ABOUT PAGE HERO
        ════════════════════════════════════════════════════════ */
        .hrptl-about-hero {
          background: #0b1219;
          padding: 128px 0 96px;
          position: relative;
          overflow: hidden;
        }
        .hrptl-about-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(74,158,197,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,158,197,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }
        .hrptl-hero-glow {
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 520px;
          background: radial-gradient(ellipse at 50% 20%, rgba(74,158,197,0.13) 0%, transparent 60%);
          pointer-events: none;
        }
        .hrptl-hero-glow-green {
          position: absolute; bottom: -60px; right: 10%;
          width: 500px; height: 400px;
          background: radial-gradient(ellipse at 70% 80%, rgba(141,198,63,0.07) 0%, transparent 60%);
          pointer-events: none;
        }
        .hrptl-hero-inner {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 28px;
          text-align: center;
          position: relative; z-index: 2;
        }
        .hrptl-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.66rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #4a9ec5;
          margin-bottom: 24px;
        }
        .hrptl-hero-eyebrow-line {
          width: 32px; height: 1px;
          background: rgba(74,158,197,0.4);
          flex-shrink: 0;
          display: block;
        }
        .hrptl-hero-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.3rem, 5.5vw, 4rem);
          color: #f1f5f9;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }
        .hrptl-hero-h1 em { color: #8DC63F; font-style: italic; }
        .hrptl-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: clamp(0.88rem, 1.5vw, 1.02rem);
          color: rgba(241,245,249,0.5);
          max-width: 660px;
          margin: 0 auto 28px;
          line-height: 1.8;
        }
        .hrptl-hero-location {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.76rem;
          letter-spacing: 0.08em;
          color: rgba(241,245,249,0.4);
          background: rgba(74,158,197,0.06);
          border: 1px solid rgba(74,158,197,0.15);
          border-radius: 100px;
          padding: 7px 18px;
        }
        .hrptl-hero-dot { color: rgba(74,158,197,0.4); }
        .hrptl-hero-accent-bar {
          width: 56px; height: 2px;
          background: linear-gradient(90deg, #4a9ec5, #8DC63F);
          border-radius: 2px;
          margin: 28px auto 0;
        }

        /* ════════════════════════════════════════════════════════
           WHO WE ARE INTRO
        ════════════════════════════════════════════════════════ */
        .hrptl-intro {
          background: #07111a;
          padding: 80px 0 88px;
          position: relative;
          border-top: 1px solid rgba(74,158,197,0.07);
          border-bottom: 1px solid rgba(74,158,197,0.07);
        }
        .hrptl-intro-inner {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 28px;
          text-align: center;
        }
        .hrptl-intro-badge {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.63rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8DC63F;
          background: rgba(141,198,63,0.07);
          border: 1px solid rgba(141,198,63,0.2);
          border-radius: 100px;
          padding: 5px 16px;
          margin-bottom: 28px;
        }
        .hrptl-intro-para {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          line-height: 1.9;
          color: rgba(241,245,249,0.6);
          margin-bottom: 28px;
        }
        .hrptl-intro-divider {
          width: 48px; height: 1px;
          background: rgba(74,158,197,0.25);
          margin: 0 auto 28px;
        }
        .hrptl-intro-tagline {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }

        /* ════════════════════════════════════════════════════════
           TIMELINE SECTION
        ════════════════════════════════════════════════════════ */
        .hrptl-section {
          background: #0b1219;
          padding: 96px 0 0;
          position: relative;
          overflow: hidden;
        }
        .hrptl-section::before {
          content: '';
          position: absolute; inset: 0;
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

        /* ── SECTION HEADER ── */
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
          max-width: 520px;
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
        .hrptl-timeline {
          position: relative;
          margin-bottom: 80px;
        }

        /* ── SPINE ── */
        .hrptl-spine {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0; bottom: 0;
          width: 1px;
          z-index: 10;
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

        /* ── SPINE NODES ── */
        .hrptl-node {
          position: absolute;
          left: 50%; top: 42px;
          transform: translateX(-50%);
          z-index: 20;
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
          background: #0b1219;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(74,158,197,0.35);
          padding: 4px 12px; border-radius: 100px;
          white-space: nowrap;
          opacity: 0; transform: scale(0.85) translateY(4px);
          transition: opacity 0.5s ease 0.14s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.14s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .hrptl-node--on .hrptl-node-year { opacity: 1; transform: scale(1) translateY(0); }

        /* ── COLUMNS ── */
        .hrptl-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          position: relative; z-index: 2;
          align-items: center;
        }
        .hrptl-cols--even > *:first-child { order: 1; }
        .hrptl-cols--even > *:last-child  { order: 2; }
        .hrptl-cols--odd  > *:first-child { order: 2; }
        .hrptl-cols--odd  > *:last-child  { order: 1; }

        /* ── TEXT ── */
        .hrptl-text {
          opacity: 0;
          transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1);
          z-index: 5;
        }
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

        /* ── IMAGES ── */
        .hrptl-img-wrap {
          opacity: 0;
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1);
          z-index: 1;
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

        /* ════════════════════════════════════════════════════════
           RESPONSIVE
        ════════════════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .hrptl-cols       { gap: 32px; }
          .hrptl-text--even { padding-right: 20px; }
          .hrptl-text--odd  { padding-left: 20px; }
        }

        @media (max-width: 768px) {
          .hrptl-about-hero { padding: 104px 0 64px; }
          .hrptl-hero-inner, .hrptl-intro-inner { padding: 0 20px; }
          .hrptl-hero-h1 { font-size: clamp(1.85rem, 7vw, 2.6rem); }
          .hrptl-intro   { padding: 60px 0 68px; }

          .hrptl-section { padding: 68px 0 0; }
          .hrptl-inner   { padding: 0 20px; }
          .hrptl-header  { margin-bottom: 56px; }
          .hrptl-header-h2 { font-size: clamp(1.7rem, 6vw, 2.2rem); }

          .hrptl-spine { left: 18px; transform: none; }
          .hrptl-node  { left: 18px; top: 0; transform: none; flex-direction: row; gap: 10px; z-index: 20; }
          .hrptl-node-year { display: none; }

          .hrptl-row      { padding-left: 44px; margin-bottom: 60px; }
          .hrptl-timeline { margin-bottom: 56px; }
          .hrptl-cols     { grid-template-columns: 1fr; gap: 18px; }

          .hrptl-cols--even > *, .hrptl-cols--odd > * { order: unset !important; }
          .hrptl-cols--even .hrptl-text,    .hrptl-cols--odd .hrptl-text    { order: 1 !important; }
          .hrptl-cols--even .hrptl-img-wrap, .hrptl-cols--odd .hrptl-img-wrap { order: 2 !important; }

          .hrptl-text--even, .hrptl-text--odd { text-align: left; padding: 0; transform: translateY(18px); }
          .hrptl-text--on   { transform: none !important; }
          .hrptl-text--even .hrptl-rule { margin-left: 0; }
          .hrptl-meta--even { justify-content: flex-start; }

          .hrptl-img--even, .hrptl-img--odd { transform: translateY(20px); }
          .hrptl-img--on    { transform: none !important; }
          .hrptl-img-box    { aspect-ratio: 16 / 10; }
          .hrptl-year-mob   { display: block; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hrptl-header, .hrptl-text, .hrptl-img-wrap,
          .hrptl-node-ring, .hrptl-node-year, .hrptl-rule, .hrptl-img {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .hrptl-rule { width: 44px; }
          .hrptl-spine-fill { transition: none; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════
          ABOUT PAGE HERO
      ════════════════════════════════════════════════════════ */}
      <section className="hrptl-about-hero" aria-label="About Hydraulics & Rubber Products Industrial Products">
        <div aria-hidden className="hrptl-hero-glow" />
        <div aria-hidden className="hrptl-hero-glow-green" />
        <div className="hrptl-hero-inner">
          <p className="hrptl-hero-eyebrow">
            <span className="hrptl-hero-eyebrow-line" />
            About Hydraulics & Rubber Products Industrial Products
            <span className="hrptl-hero-eyebrow-line" />
          </p>
          <h1 className="hrptl-hero-h1">
            A Legacy Built on Precision.<br />
            <em>A Future Built on Trust.</em>
          </h1>
          <p className="hrptl-hero-sub">
            Stockists &amp; Distributors of High-Pressure Hydraulic Hoses, Valves, SS Bellows,
            Advanced Pneumatic Control Components &amp; Specialised Industrial Instruments.
          </p>
          <div className="hrptl-hero-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Visakhapatnam, Andhra Pradesh</span>
            <span className="hrptl-hero-dot">·</span>
            <span>Est. 1983</span>
          </div>
          <div className="hrptl-hero-accent-bar" aria-hidden="true" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          WHO WE ARE
      ════════════════════════════════════════════════════════ */}
      <section className="hrptl-intro" aria-label="Who We Are">
        <div className="hrptl-intro-inner">
          <p className="hrptl-intro-badge">Who We Are</p>
          <p className="hrptl-intro-para">
            Hydraulics and Rubber Products (Hydraulics & Rubber Products) is a Visakhapatnam-based industrial supply company
            with over four decades of hands-on expertise in fluid mechanics, rubber engineering, and
            precision instrumentation. What began as a small hardware trading firm has grown into a
            Pan-India recognised supply network — trusted by defense establishments, public sector
            units, and large private corporations alike.
          </p>
          <div className="hrptl-intro-divider" aria-hidden="true" />
          <p className="hrptl-intro-tagline">
            We don&rsquo;t just supply components. We deliver engineered reliability.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          COMPANY TIMELINE
      ════════════════════════════════════════════════════════ */}
      <section className="hrptl-section" aria-label="Company Journey Timeline">
        <div className="hrptl-inner">

          <div ref={headerRef} className={`hrptl-header ${headerOn ? "hrptl-header--on" : ""}`}>
            <p className="hrptl-header-eyebrow">Our Story · Est. 1983</p>
            <h2 className="hrptl-header-h2">
              Four Decades of<br /><em>Engineered Reliability</em>
            </h2>
            <p className="hrptl-header-sub">
              From a hardware stockist on the Coromandel Coast to a Pan-India defence-approved
              industrial supply network — this is the Hydraulics & Rubber Products story.
            </p>
            <div className="hrptl-header-accent" />
          </div>

          <div className="hrptl-timeline" ref={timelineRef}>
            <Spine containerRef={timelineRef} />
            {MILESTONES.map((m, i) => (
              <MilestoneRow key={m.year} m={m} index={i} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
