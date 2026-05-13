"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   MILESTONE DATA — narrative storytelling tone
───────────────────────────────────────────── */
const MILESTONES = [
    {
        year: "2009",
        chapter: "Chapter I",
        title: "The Beginning",
        subtitle: "Founded in Hyderabad",
        story:
            "What started as a single room and a catalogue of essential components quietly became the first chapter of something much larger. Local manufacturers needed a reliable source — HRP answered that call with precision and commitment.",
        stat: "Est. 2009",
        tag: "Origin",
        /* Unsplash industrial images — no auth required */
        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
    },
    {
        year: "2012",
        chapter: "Chapter II",
        title: "Expanding the Range",
        subtitle: "Into Hydraulics & Pneumatics",
        story:
            "As demand grew beyond local workshops, HRP extended its reach into hydraulics, pneumatic systems and industrial hose assemblies — tripling the portfolio and establishing the infrastructure for larger industrial partnerships.",
        stat: "3× Catalogue",
        tag: "Growth",
        image: "https://images.unsplash.com/photo-1581093196277-9f608bb3b511?w=800&q=80",
    },
    {
        year: "2015",
        chapter: "Chapter III",
        title: "Strategic Alliances",
        subtitle: "Global Brand Partnerships",
        story:
            "Recognition came not through advertising, but through reliability. By 2015, global manufacturers like Schmalz and Festo had extended their trust — bringing certified product lines and a new tier of industrial credibility to HRP's growing network.",
        stat: "10+ Partners",
        tag: "Recognition",
        image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
    },
    {
        year: "2018",
        chapter: "Chapter IV",
        title: "Crossing Borders",
        subtitle: "Pan-India Supply Operations",
        story:
            "What once served a single city now reached across the country. Logistics expanded, delivery timelines tightened, and HRP's reputation for same-week dispatch made it the preferred industrial supplier across 10+ cities and growing.",
        stat: "10+ Cities",
        tag: "Expansion",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    },
    {
        year: "2021",
        chapter: "Chapter V",
        title: "Engineering Depth",
        subtitle: "Specialised Industrial Solutions",
        story:
            "The company entered its most technically demanding era — instrumentation systems, vacuum components, SS bellows, and precision automation products now defined HRP's portfolio. Engineering depth had become the brand's true identity.",
        stat: "200+ SKUs",
        tag: "Specialisation",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    },
    {
        year: "2024",
        chapter: "Chapter VI",
        title: "Multi-Sector Trust",
        subtitle: "Cross-Industry Presence",
        story:
            "Manufacturing floors, automation labs, construction sites, heavy industry operations — HRP had become the common thread across sectors. Over 200 clients across India trusted a single partner for every industrial need.",
        stat: "200+ Clients",
        tag: "Scale",
        image: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=800&q=80",
    },
    {
        year: "2026",
        chapter: "Present",
        title: "Built to Last",
        subtitle: "Continuously Evolving",
        story:
            "Fifteen years of building trust, one delivery at a time. HRP today is more than a supplier — it is an industrial partner deeply woven into the operations of the clients it serves. The journey continues.",
        stat: "15+ Years",
        tag: "Legacy",
        image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80",
    },
];

/* ─────────────────────────────────────────────
   SVG PATH  (900 × 480 viewBox — unchanged)
───────────────────────────────────────────── */
const VB_W = 900;
const VB_H = 480;

const PATH_D = [
    "M 70 420",
    "C 70 310, 45 175, 85 100",
    "C 118 38,  210 25, 295 62",
    "C 375 98,  390 185, 335 255",
    "C 295 305, 255 325, 285 375",
    "C 318 428, 415 445, 510 405",
    "C 600 365, 645 285, 670 210",
    "C 695 135, 750 98,  820 100",
    "C 870 102, 890 148, 885 230",
    "C 880 310, 865 385, 875 460",
].join(" ");

const NODES = [
    { x: 70, y: 420, side: "right" },
    { x: 78, y: 108, side: "right" },
    { x: 335, y: 255, side: "left" },
    { x: 285, y: 375, side: "right" },
    { x: 670, y: 210, side: "left" },
    { x: 820, y: 100, side: "left" },
    { x: 875, y: 460, side: "left" },
];

/* ─────────────────────────────────────────────
   CARD DIMENSIONS (in viewBox units, for
   connector math only — actual card is HTML)
───────────────────────────────────────────── */
const CW_VB = 240; // viewBox units for connector math

export default function CompanyJourney() {
    const wrapRef = useRef(null);
    const pathRef = useRef(null);
    const glowRef = useRef(null);
    const canvasRef = useRef(null);
    const svgRef = useRef(null);

    const [pathLen, setPathLen] = useState(2800);
    const [progress, setProgress] = useState(0);
    const [activeIdx, setActiveIdx] = useState(0);
    const [tipPt, setTipPt] = useState(null);
    /* svgRect tracks the SVG element's bounding box for card positioning */
    const [svgRect, setSvgRect] = useState(null);

    /* ── MOBILE refs & state ── */
    const mobileRef = useRef(null);
    const mobileLineRef = useRef(null);
    const cardRefs = useRef([]);
    const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
    const [mobileProgress, setMobileProgress] = useState(0);

    /* measure path length */
    useEffect(() => {
        if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
    }, []);

    /* track SVG bounding rect for card placement */
    useEffect(() => {
        function measure() {
            if (svgRef.current) setSvgRect(svgRef.current.getBoundingClientRect());
        }
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    /* scroll driver */
    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        function onScroll() {
            const rect = wrap.getBoundingClientRect();
            const totalScroll = wrap.offsetHeight - window.innerHeight;
            const scrolled = Math.max(0, -rect.top);
            const p = Math.min(1, Math.max(0, scrolled / totalScroll));
            setProgress(p);

            const step = 1 / (MILESTONES.length - 1);
            const idx = p >= 1 ? MILESTONES.length - 1 : Math.floor(p / step);
            setActiveIdx(idx);

            if (pathRef.current && p > 0.005 && p < 0.997) {
                try {
                    const pt = pathRef.current.getPointAtLength(
                        pathRef.current.getTotalLength() * p
                    );
                    setTipPt({ x: pt.x, y: pt.y });
                } catch { setTipPt(null); }
            } else {
                setTipPt(null);
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* path draw */
    useEffect(() => {
        const offset = pathLen * (1 - progress);
        if (pathRef.current) pathRef.current.style.strokeDashoffset = offset;
        if (glowRef.current) glowRef.current.style.strokeDashoffset = offset;
    }, [progress, pathLen]);

    /* particles */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext("2d");
        const pts = Array.from({ length: 38 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 0.9 + 0.2,
            vx: (Math.random() - 0.5) * 0.11,
            vy: (Math.random() - 0.5) * 0.11,
            a: Math.random() * 0.22 + 0.03,
        }));
        let raf;
        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pts.forEach((p) => {
                p.x = (p.x + p.vx + canvas.width) % canvas.width;
                p.y = (p.y + p.vy + canvas.height) % canvas.height;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(43,126,161,${p.a})`;
                ctx.fill();
            });
            raf = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(raf);
    }, []);

    /* ── MOBILE: scroll driver ── */
    useEffect(() => {
        const section = mobileRef.current;
        if (!section) return;
        function onMobileScroll() {
            const rect = section.getBoundingClientRect();
            const totalScroll = section.offsetHeight - window.innerHeight;
            const scrolled = Math.max(0, -rect.top);
            const p = Math.min(1, Math.max(0, scrolled / totalScroll));
            setMobileProgress(p);
            const step = 1 / (MILESTONES.length - 1);
            const idx = p >= 1 ? MILESTONES.length - 1 : Math.floor(p / step);
            setMobileActiveIdx(idx);
        }
        window.addEventListener("scroll", onMobileScroll, { passive: true });
        onMobileScroll();
        return () => window.removeEventListener("scroll", onMobileScroll);
    }, []);

    /* ── MOBILE: animate line fill ── */
    useEffect(() => {
        const line = mobileLineRef.current;
        if (!line) return;
        const parent = line.parentElement;
        if (!parent) return;
        const totalH = parent.offsetHeight - 16;
        line.style.height = `${mobileProgress * totalH}px`;
    }, [mobileProgress]);

    /* ── MOBILE: card reveal via IntersectionObserver ── */
    useEffect(() => {
        /* Manually check cards already in viewport on mount — fixes first card */
        const timer = setTimeout(() => {
            cardRefs.current.forEach((r) => {
                if (!r) return;
                const rect = r.getBoundingClientRect();
                if (rect.top < window.innerHeight + 60) {
                    r.classList.add("hrpjm-card-visible");
                }
            });
        }, 80);

        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) e.target.classList.add("hrpjm-card-visible");
            }),
            { threshold: 0.05, rootMargin: "0px 0px 80px 0px" }
        );
        cardRefs.current.forEach((r) => r && obs.observe(r));
        return () => { obs.disconnect(); clearTimeout(timer); };
    }, []);

    /* checkpoint local progress */
    function cpP(i) {
        const step = 1 / (MILESTONES.length - 1);
        return Math.min(1, Math.max(0, (progress - step * i) / (step * 0.55)));
    }

    /* card state: active / prev / hidden */
    function cardState(i) {
        if (i === activeIdx) return "active";
        if (i === activeIdx - 1) return "prev";
        return "hidden";
    }

    /*
      Convert viewBox coords → screen px relative to the sticky container.
      svgRef bounding rect + viewBox scale factor.
    */
    function vbToScreen(vx, vy) {
        if (!svgRect) return { sx: 0, sy: 0 };
        const scaleX = svgRect.width / VB_W;
        const scaleY = svgRect.height / VB_H;
        return {
            sx: svgRect.left + vx * scaleX,
            sy: svgRect.top + vy * scaleY,
        };
    }

    /*
      Card screen position:
      Cards are positioned relative to the STICKY container (position:absolute inside it).
      We use the sticky div as the positioning parent.
    */
    const CARD_W = 280; // px — actual HTML card width
    const CARD_H = 360; // px — actual HTML card height

    function cardScreenPos(node) {
        if (!svgRect || !wrapRef.current) return { left: 0, top: 0 };

        const scaleX = svgRect.width / VB_W;
        const scaleY = svgRect.height / VB_H;

        /* node position in screen coords relative to viewport */
        const nodeScreenX = svgRect.left + node.x * scaleX;
        const nodeScreenY = svgRect.top + node.y * scaleY;

        /* sticky container top = 0 (it's stuck to viewport top) */
        const stickyLeft = wrapRef.current.getBoundingClientRect().left;

        const gap = 24; // px gap between node and card edge
        let left = node.side === "right"
            ? nodeScreenX + gap - stickyLeft
            : nodeScreenX - gap - CARD_W - stickyLeft;

        /* clamp horizontally */
        const vw = window.innerWidth;
        left = Math.min(Math.max(left, 16), vw - CARD_W - 16);

        /* vertically center on node, clamp to viewport */
        let top = nodeScreenY - CARD_H / 2;
        top = Math.min(Math.max(top, 80), window.innerHeight - CARD_H - 16);

        return { left, top };
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,200;0,300;0,400;1,300&display=swap');

        .hrpj *, .hrpj *::before, .hrpj *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        /* ── SCROLL CONTAINER ── */
        .hrpj-outer {
          position: relative;
          height: ${MILESTONES.length * 100}vh;
        }

        /* ── STICKY VIEWPORT ── */
        .hrpj-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: #080d14;
        }

        /* Blueprint grid */
        .hrpj-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(43,126,161,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43,126,161,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* Ambient glow blobs */
        .hrpj-ambient {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 20% 50%, rgba(43,126,161,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 45% 38% at 80% 25%, rgba(141,198,63,0.04) 0%, transparent 60%);
        }

        /* Vignette */
        .hrpj-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 145% 125% at 50% 50%,
            transparent 25%, rgba(8,13,20,0.92) 100%);
        }

        /* Noise grain */
        .hrpj-noise {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── SECTION HEADER ── */
        .hrpj-header {
          position: absolute;
          top: 5.5%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 15;
          pointer-events: none;
          white-space: nowrap;
        }
        .hrpj-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.64rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(74,158,197,0.7);
          margin-bottom: 8px;
        }
        .hrpj-hairline {
          width: 120px; height: 1px;
          margin: 0 auto 12px;
          background: linear-gradient(90deg,
            transparent, rgba(43,126,161,0.5) 30%,
            rgba(141,198,63,0.38) 70%, transparent);
        }
        .hrpj-h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 2.6vw, 2.4rem);
          color: #dde8f5;
          line-height: 1.1;
          letter-spacing: -0.025em;
        }
        .hrpj-h2 em {
          color: #8DC63F;
          font-style: italic;
          font-weight: 700;
        }
        .hrpj-hint {
          font-family: 'DM Sans', sans-serif;
          font-weight: 200;
          font-size: 0.7rem;
          color: rgba(140,170,200,0.32);
          margin-top: 7px;
          letter-spacing: 0.05em;
        }

        /* ── SIDE PROGRESS PIPS ── */
        .hrpj-pips {
          position: absolute;
          right: 1.8rem; top: 50%;
          transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 8px;
          z-index: 30;
        }
        .hrpj-pip {
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        }

        /* ── GHOST YEAR WATERMARK ── */
        .hrpj-ghost {
          position: absolute;
          bottom: 7%; left: 3.5%;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(3rem, 7vw, 6.5rem);
          color: rgba(43,126,161,0.07);
          line-height: 1;
          letter-spacing: -0.05em;
          user-select: none; pointer-events: none; z-index: 5;
        }

        /* ── MILESTONE COUNTER ── */
        .hrpj-counter {
          position: absolute;
          bottom: 6%; left: 50%;
          transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          z-index: 20;
        }
        .hrpj-clabel {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(43,126,161,0.35);
        }
        .hrpj-cval {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.82rem;
          color: #4a9ec5;
        }

        /* ── NODE PULSE ── */
        @keyframes hrpj-pulse {
          0%,100% { transform:scale(1);   opacity:0.5; }
          50%      { transform:scale(1.65); opacity:0.08; }
        }
        .hrpj-pulse {
          animation: hrpj-pulse 2.2s ease-in-out infinite;
        }

        /* ════════════════════════════════════════
           CINEMATIC STORY CARD
        ════════════════════════════════════════ */
        .hrpj-card {
          position: absolute;
          width: 280px;
          /* height is auto — content drives it */
          z-index: 25;
          border-radius: 14px;
          overflow: hidden;

          /* Glass surface */
          background: rgba(8, 14, 24, 0.82);
          border: 1px solid rgba(43,126,161,0.18);

          /* Layered shadow */
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03) inset,
            0 2px 0 rgba(255,255,255,0.04) inset,
            0 20px 60px rgba(0,0,0,0.7),
            0 4px 20px rgba(0,0,0,0.5);

          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          /* State transitions */
          transition:
            opacity    0.6s cubic-bezier(0.22,1,0.36,1),
            transform  0.6s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.6s ease,
            border-color 0.6s ease;
        }

        .hrpj-card.active {
          opacity: 1;
          transform: translateY(0) scale(1);
          border-color: rgba(141,198,63,0.28);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 2px 0 rgba(255,255,255,0.05) inset,
            0 0 50px rgba(141,198,63,0.06),
            0 0 100px rgba(43,126,161,0.08),
            0 24px 70px rgba(0,0,0,0.75),
            0 4px 20px rgba(0,0,0,0.5);
          pointer-events: auto;
        }
        .hrpj-card.prev {
          opacity: 0.22;
          transform: translateY(6px) scale(0.93);
          border-color: rgba(43,126,161,0.1);
          pointer-events: none;
        }
        .hrpj-card.hidden {
          opacity: 0;
          transform: translateY(14px) scale(0.88);
          pointer-events: none;
        }

        /* ── IMAGE AREA ── */
        .hrpj-img-wrap {
          position: relative;
          width: 100%;
          height: 155px;
          overflow: hidden;
        }
        .hrpj-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.8s cubic-bezier(0.22,1,0.36,1),
                      filter 0.6s ease;
          transform: scale(1.06);
          filter: brightness(0.55) saturate(0.7);
        }
        .hrpj-card.active .hrpj-img {
          transform: scale(1.0);
          filter: brightness(0.7) saturate(0.85);
        }

        /* Image overlay — cinematic gradient */
        .hrpj-img-overlay {
          position: absolute; inset: 0;
          background:
            /* bottom fade into card body */
            linear-gradient(
              to bottom,
              transparent 20%,
              rgba(8,14,24,0.5) 65%,
              rgba(8,14,24,0.97) 100%
            ),
            /* left atmospheric vignette */
            linear-gradient(
              to right,
              rgba(8,14,24,0.45) 0%,
              transparent 50%
            );
        }

        /* Blue industrial glow tint on image (active only) */
        .hrpj-img-glow {
          position: absolute; inset: 0;
          background: radial-gradient(
            ellipse 80% 60% at 30% 60%,
            rgba(43,126,161,0.18) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .hrpj-card.active .hrpj-img-glow { opacity: 1; }

        /* Chapter label floating over image */
        .hrpj-chapter {
          position: absolute;
          top: 12px;
          left: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(141,198,63,0.85);
          background: rgba(8,14,24,0.55);
          padding: 3px 8px;
          border-radius: 2px;
          border: 1px solid rgba(141,198,63,0.2);
          backdrop-filter: blur(8px);
          transition: color 0.5s, border-color 0.5s;
        }
        .hrpj-card.prev .hrpj-chapter {
          color: rgba(43,126,161,0.6);
          border-color: rgba(43,126,161,0.15);
        }

        /* ── CARD BODY ── */
        .hrpj-body {
          padding: 0 16px 16px;
          position: relative;
        }

        /* Year — large editorial number */
        .hrpj-year-block {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 6px;
          /* Pull up slightly to overlap image fade */
          margin-top: -2px;
        }
        .hrpj-year {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -0.04em;
          color: #c8dcea;
          transition: color 0.5s;
        }
        .hrpj-card.active .hrpj-year { color: #e8f3fb; }
        .hrpj-card.prev   .hrpj-year { color: rgba(140,175,200,0.45); }

        /* Thin technical rule next to year */
        .hrpj-year-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg,
            rgba(141,198,63,0.5) 0%, transparent 100%);
          transition: background 0.5s;
          margin-bottom: 4px;
        }
        .hrpj-card.prev .hrpj-year-rule {
          background: linear-gradient(90deg,
            rgba(43,126,161,0.3) 0%, transparent 100%);
        }

        /* Stat badge beside the rule */
        .hrpj-stat {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(141,198,63,0.75);
          background: rgba(141,198,63,0.07);
          border: 1px solid rgba(141,198,63,0.18);
          padding: 2px 7px;
          border-radius: 2px;
          white-space: nowrap;
          transition: all 0.5s;
          margin-bottom: 4px;
        }
        .hrpj-card.prev .hrpj-stat {
          color: rgba(43,126,161,0.5);
          background: rgba(43,126,161,0.04);
          border-color: rgba(43,126,161,0.12);
        }

        /* Milestone subtitle */
        .hrpj-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(141,198,63,0.65);
          margin-bottom: 5px;
          transition: color 0.5s;
        }
        .hrpj-card.prev .hrpj-subtitle {
          color: rgba(43,126,161,0.4);
        }

        /* Title */
        .hrpj-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.02rem;
          line-height: 1.18;
          letter-spacing: -0.01em;
          color: #ddeaf7;
          margin-bottom: 10px;
          transition: color 0.5s;
        }
        .hrpj-card.prev .hrpj-title {
          color: rgba(140,175,210,0.4);
        }

        /* Story text — thin horizontal rule above it */
        .hrpj-story-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg,
            rgba(43,126,161,0.25) 0%,
            transparent 80%);
          margin-bottom: 9px;
        }

        /* Story paragraph */
        .hrpj-story {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.7rem;
          line-height: 1.65;
          color: rgba(155,190,220,0.65);
          font-style: italic;
          transition: color 0.5s;
        }
        .hrpj-card.active .hrpj-story {
          color: rgba(170,205,230,0.72);
        }
        .hrpj-card.prev .hrpj-story {
          color: rgba(100,140,175,0.3);
        }

        /* Tag pill — bottom of card */
        .hrpj-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 11px;
        }
        .hrpj-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.56rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(43,126,161,0.55);
          padding: 2px 7px;
          border: 1px solid rgba(43,126,161,0.15);
          border-radius: 2px;
        }
        .hrpj-card.active .hrpj-tag {
          color: rgba(141,198,63,0.6);
          border-color: rgba(141,198,63,0.18);
        }

        /* Blueprint grid fragment inside card */
        .hrpj-card-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(43,126,161,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43,126,161,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          border-radius: 14px;
        }

        /* Subtle green glow edge on active card top */
        .hrpj-card-edge {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(141,198,63,0.5) 40%,
            rgba(43,126,161,0.4) 70%,
            transparent 100%);
          opacity: 0;
          transition: opacity 0.6s;
        }
        .hrpj-card.active .hrpj-card-edge { opacity: 1; }

        /* ── CONNECTOR LINE (SVG) ── */
        /* handled in SVG */

        @media (prefers-reduced-motion: reduce) {
          .hrpj-pulse { animation: none; }
          .hrpj-card  { transition: none; }
          .hrpj-img   { transition: none; }
        }

        /* ══════════════════════════════════════════
           PREMIUM MOBILE TIMELINE  (< 1024px)
        ══════════════════════════════════════════ */

        .hrpjm {
          display: none;
          background: #080d14;
          position: relative;
          overflow: hidden;
        }

        /* ── Blueprint grid ── */
        .hrpjm-bg-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(43,126,161,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43,126,161,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .hrpjm-bg-ambient {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 35% at 50% 0%,   rgba(43,126,161,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 70% 25% at 80% 100%, rgba(141,198,63,0.05) 0%, transparent 60%);
        }
        .hrpjm-bg-noise {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── STICKY PROGRESS BAR ── */
        .hrpjm-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px;
          height: 52px;
          background: rgba(8,13,20,0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(43,126,161,0.12);
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .hrpjm-bar-year {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: -0.03em;
          color: #ddeaf7;
          min-width: 46px;
        }
        .hrpjm-bar-sep {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          color: rgba(43,126,161,0.3);
        }
        .hrpjm-bar-chapter {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(141,198,63,0.7);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hrpjm-bar-track {
          width: 64px;
          height: 2px;
          background: rgba(43,126,161,0.15);
          border-radius: 2px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .hrpjm-bar-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #2B7EA1, #8DC63F);
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .hrpjm-bar-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.14em;
          color: rgba(74,158,197,0.5);
          flex-shrink: 0;
        }

        /* ── SECTION HEADER ── */
        .hrpjm-header {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 64px 24px 52px;
        }

        /* ── TIMELINE BODY ── */
        .hrpjm-timeline {
          position: relative;
          padding: 8px 20px 80px 62px;
          z-index: 2;
        }

        /* Ghost track — full height always visible */
        .hrpjm-line-track {
          position: absolute;
          left: 28px;
          top: 8px;
          bottom: 80px;
          width: 1px;
          background: rgba(43,126,161,0.1);
        }

        /* Animated fill line */
        .hrpjm-line-fill {
          position: absolute;
          left: 28px;
          top: 8px;
          width: 1px;
          height: 0;
          background: linear-gradient(
            to bottom,
            #1a4f66 0%,
            #2B7EA1 35%,
            #4a9ec5 65%,
            #8DC63F 100%
          );
          box-shadow: 0 0 8px rgba(43,126,161,0.45), 0 0 2px rgba(43,126,161,0.8);
          transition: height 0.12s linear;
        }

        /* ── MILESTONE ITEM ── */
        .hrpjm-item {
          position: relative;
          margin-bottom: 32px;
        }
        .hrpjm-item:last-child { margin-bottom: 0; }

        /* Node */
        .hrpjm-node {
          position: absolute;
          left: -42px;
          top: 10px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #080d14;
          border: 1.5px solid rgba(43,126,161,0.3);
          box-shadow: none;
          transition: border-color 0.5s ease, box-shadow 0.5s ease, background 0.5s ease;
          z-index: 5;
        }
        .hrpjm-node::after {
          content: '';
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: rgba(43,126,161,0.2);
          transition: background 0.5s ease;
        }
        .hrpjm-node.passed {
          border-color: #2B7EA1;
          box-shadow: 0 0 6px rgba(43,126,161,0.4);
        }
        .hrpjm-node.passed::after {
          background: #2B7EA1;
        }
        .hrpjm-node.active {
          border-color: #8DC63F;
          box-shadow:
            0 0 0 5px rgba(141,198,63,0.1),
            0 0 14px rgba(141,198,63,0.55);
          animation: hrpjm-pulse 2.2s ease-in-out infinite;
        }
        .hrpjm-node.active::after {
          background: #8DC63F;
        }
        @keyframes hrpjm-pulse {
          0%,100% { box-shadow: 0 0 0 5px rgba(141,198,63,0.1), 0 0 14px rgba(141,198,63,0.55); }
          50%      { box-shadow: 0 0 0 9px rgba(141,198,63,0.05), 0 0 22px rgba(141,198,63,0.35); }
        }

        /* ── CARD ── */
        .hrpjm-card {
          opacity: 0;
          transform: translateY(44px);
          filter: blur(10px);
          transition:
            opacity    0.75s cubic-bezier(0.22,1,0.36,1),
            transform  0.75s cubic-bezier(0.22,1,0.36,1),
            filter     0.65s cubic-bezier(0.22,1,0.36,1),
            border-color 0.5s ease,
            box-shadow   0.5s ease;
          background: rgba(8,14,24,0.85);
          border: 1px solid rgba(43,126,161,0.16);
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.02) inset,
            0 16px 48px rgba(0,0,0,0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: relative;
        }
        .hrpjm-card-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        /* Active card styling (synced with mobileActiveIdx via inline style) */
        .hrpjm-card.active-card {
          border-color: rgba(141,198,63,0.24);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03) inset,
            0 0 40px rgba(141,198,63,0.06),
            0 0 80px rgba(43,126,161,0.07),
            0 20px 60px rgba(0,0,0,0.65);
        }

        /* Blueprint grid inside card */
        .hrpjm-card-grid {
          position: absolute; inset: 0; pointer-events: none; border-radius: 14px;
          background-image:
            linear-gradient(rgba(43,126,161,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43,126,161,0.025) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* Top glowing edge — reveals on active */
        .hrpjm-card-edge {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(141,198,63,0.45) 40%,
            rgba(43,126,161,0.35) 70%,
            transparent);
          opacity: 0;
          transition: opacity 0.55s ease;
        }
        .hrpjm-card.active-card .hrpjm-card-edge { opacity: 1; }

        /* Image area */
        .hrpjm-img-wrap {
          position: relative;
          width: 100%;
          height: 190px;
          overflow: hidden;
        }
        .hrpjm-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          filter: brightness(0.55) saturate(0.72);
          transform: scale(1.06);
          transition:
            transform 0.9s cubic-bezier(0.22,1,0.36,1),
            filter    0.7s ease;
        }
        .hrpjm-card.active-card .hrpjm-img {
          transform: scale(1.0);
          filter: brightness(0.7) saturate(0.88);
        }
        .hrpjm-img-overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, transparent 25%, rgba(8,14,24,0.55) 70%, rgba(8,14,24,0.98) 100%),
            linear-gradient(to right,  rgba(8,14,24,0.4) 0%, transparent 50%);
        }
        .hrpjm-img-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 30% 60%, rgba(43,126,161,0.16) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.6s ease;
        }
        .hrpjm-card.active-card .hrpjm-img-glow { opacity: 1; }

        /* Chapter pill over image */
        .hrpjm-chapter {
          position: absolute; top: 12px; left: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.56rem; font-weight: 300;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(141,198,63,0.85);
          background: rgba(8,14,24,0.6);
          padding: 3px 9px; border-radius: 2px;
          border: 1px solid rgba(141,198,63,0.2);
          backdrop-filter: blur(8px);
        }

        /* Card body */
        .hrpjm-body { padding: 0 16px 18px; }

        .hrpjm-year-row {
          display: flex; align-items: baseline; gap: 10px;
          margin-bottom: 5px; margin-top: -2px;
        }
        .hrpjm-year {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 2rem;
          line-height: 1; letter-spacing: -0.04em;
          color: #c8dcea;
          transition: color 0.5s;
        }
        .hrpjm-card.active-card .hrpjm-year { color: #e8f3fb; }
        .hrpjm-year-rule {
          flex: 1; height: 1px; margin-bottom: 4px;
          background: linear-gradient(90deg, rgba(141,198,63,0.45), transparent);
        }
        .hrpjm-stat {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem; font-weight: 300;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(141,198,63,0.72);
          background: rgba(141,198,63,0.07);
          border: 1px solid rgba(141,198,63,0.16);
          padding: 2px 7px; border-radius: 2px; white-space: nowrap;
          margin-bottom: 4px;
        }
        .hrpjm-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem; font-weight: 300;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: rgba(141,198,63,0.62); margin-bottom: 4px;
        }
        .hrpjm-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 1.02rem;
          line-height: 1.18; letter-spacing: -0.01em;
          color: #ddeaf7; margin-bottom: 10px;
        }
        .hrpjm-story-rule {
          width: 100%; height: 1px; margin-bottom: 9px;
          background: linear-gradient(90deg, rgba(43,126,161,0.22), transparent 80%);
        }
        .hrpjm-story {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.74rem; font-weight: 300;
          line-height: 1.65; color: rgba(155,190,220,0.62);
          font-style: italic; margin-bottom: 11px;
        }
        .hrpjm-tag {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.56rem; letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(43,126,161,0.55);
          border: 1px solid rgba(43,126,161,0.14);
          padding: 2px 8px; border-radius: 2px;
        }
        .hrpjm-card.active-card .hrpjm-tag {
          color: rgba(141,198,63,0.6);
          border-color: rgba(141,198,63,0.18);
        }

        /* Ghost year watermark */
        .hrpjm-ghost {
          position: absolute; bottom: 72px; right: 20px;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(3.5rem, 14vw, 7rem);
          color: rgba(43,126,161,0.055);
          line-height: 1; letter-spacing: -0.05em;
          pointer-events: none; user-select: none; z-index: 1;
          transition: opacity 0.4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .hrpjm-card { transition: opacity 0.3s; filter: none !important; transform: none !important; }
          .hrpjm-node { animation: none; }
        }

        /* ── RESPONSIVE BREAKPOINT ── */
        @media (max-width: 1023px) {
          .hrpj-outer { display: none; }
          .hrpjm      { display: block; }
        }
      `}</style>

            <section className="hrpj hrpj-outer" ref={wrapRef} aria-label="Company Journey">
                <div className="hrpj-sticky">

                    {/* BG LAYERS */}
                    <div className="hrpj-grid" />
                    <div className="hrpj-ambient" />
                    <div className="hrpj-noise" />
                    <canvas ref={canvasRef} style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%", pointerEvents: "none",
                    }} />
                    <div className="hrpj-vignette" />

                    {/* HEADER */}
                    <div className="hrpj-header">
                        <p className="hrpj-eyebrow">Est. 2009 · Industrial Heritage</p>
                        <div className="hrpj-hairline" />
                        <h2 className="hrpj-h2">
                            Engineering Growth<br /><em>Since 2009</em>
                        </h2>
                        <p className="hrpj-hint">Scroll to travel through our milestones</p>
                    </div>

                    {/* SIDE PIPS */}
                    <div className="hrpj-pips">
                        {MILESTONES.map((_, i) => {
                            const isA = i === activeIdx;
                            const isP = i < activeIdx;
                            return (
                                <div key={i} className="hrpj-pip" style={{
                                    width: isA ? "24px" : isP ? "6px" : "4px",
                                    height: isA ? "4px" : isP ? "6px" : "4px",
                                    background: isA ? "#8DC63F" : isP ? "#2B7EA1" : "rgba(43,126,161,0.15)",
                                    boxShadow: isA ? "0 0 8px rgba(141,198,63,0.6)"
                                        : isP ? "0 0 4px rgba(43,126,161,0.3)" : "none",
                                }} />
                            );
                        })}
                    </div>

                    {/* GHOST YEAR */}
                    <div className="hrpj-ghost">{MILESTONES[activeIdx]?.year ?? "2009"}</div>

                    {/* COUNTER */}
                    <div className="hrpj-counter">
                        <span className="hrpj-clabel">Milestone</span>
                        <span className="hrpj-cval">
                            {activeIdx + 1}
                            <span style={{ color: "rgba(43,126,161,0.25)" }}> / </span>
                            {MILESTONES.length}
                        </span>
                    </div>

                    {/* ══════════════════════════════════════════
              CINEMATIC STORY CARDS
              Positioned absolutely inside .hrpj-sticky
              using screen coordinates derived from SVG
          ══════════════════════════════════════════ */}
                    {svgRect && MILESTONES.map((m, i) => {
                        const node = NODES[i];
                        const state = cardState(i);
                        if (state === "hidden" && i !== activeIdx - 1) return null;

                        const { left, top } = cardScreenPos(node);

                        return (
                            <div
                                key={i}
                                className={`hrpj-card ${state}`}
                                style={{ left: `${left}px`, top: `${top}px` }}
                            >
                                {/* Blueprint grid fragment */}
                                <div className="hrpj-card-grid" />

                                {/* Top glowing edge */}
                                <div className="hrpj-card-edge" />

                                {/* IMAGE AREA */}
                                <div className="hrpj-img-wrap">
                                    <img
                                        src={m.image}
                                        alt={m.title}
                                        className="hrpj-img"
                                        loading="lazy"
                                        draggable={false}
                                    />
                                    <div className="hrpj-img-overlay" />
                                    <div className="hrpj-img-glow" />
                                    {/* Chapter label over image */}
                                    <div className="hrpj-chapter">{m.chapter}</div>
                                </div>

                                {/* CARD BODY */}
                                <div className="hrpj-body">

                                    {/* Year row */}
                                    <div className="hrpj-year-block">
                                        <span className="hrpj-year">{m.year}</span>
                                        <div className="hrpj-year-rule" />
                                        <span className="hrpj-stat">{m.stat}</span>
                                    </div>

                                    {/* Subtitle */}
                                    <div className="hrpj-subtitle">{m.subtitle}</div>

                                    {/* Title */}
                                    <div className="hrpj-title">{m.title}</div>

                                    {/* Thin rule */}
                                    <div className="hrpj-story-rule" />

                                    {/* Story paragraph */}
                                    <p className="hrpj-story">{m.story}</p>

                                    {/* Tag */}
                                    <div className="hrpj-tag-row">
                                        <span className="hrpj-tag">{m.tag}</span>
                                    </div>

                                </div>
                            </div>
                        );
                    })}

                    {/* ══════════════════════════════════════════
              SVG ROADMAP — path + nodes only
              Cards are now HTML elements above
          ══════════════════════════════════════════ */}
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${VB_W} ${VB_H}`}
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                            position: "absolute",
                            top: "17%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "min(90vw, 860px)",
                            height: "auto",
                            overflow: "visible",
                            zIndex: 10,
                        }}
                    >
                        <defs>
                            <filter id="hrpj-pg" x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="5" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <filter id="hrpj-ng" x="-120%" y="-120%" width="340%" height="340%">
                                <feGaussianBlur stdDeviation="7" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <linearGradient id="hrpj-grad" gradientUnits="userSpaceOnUse"
                                x1="70" y1="420" x2="875" y2="460">
                                <stop offset="0%" stopColor="#1a4f66" />
                                <stop offset="40%" stopColor="#2B7EA1" />
                                <stop offset="75%" stopColor="#4a9ec5" />
                                <stop offset="100%" stopColor="#8DC63F" />
                            </linearGradient>
                        </defs>

                        {/* Ghost track */}
                        <path d={PATH_D} fill="none"
                            stroke="rgba(43,126,161,0.055)" strokeWidth="1.5" strokeLinecap="round" />

                        {/* Wide glow layer */}
                        <path ref={glowRef} d={PATH_D} fill="none"
                            stroke="url(#hrpj-grad)" strokeWidth="9" strokeLinecap="round"
                            strokeDasharray={pathLen} strokeDashoffset={pathLen}
                            opacity="0.18" filter="url(#hrpj-pg)"
                            style={{ transition: "stroke-dashoffset 0.06s linear" }} />

                        {/* Main drawn path */}
                        <path ref={pathRef} d={PATH_D} fill="none"
                            stroke="url(#hrpj-grad)" strokeWidth="1.8" strokeLinecap="round"
                            strokeDasharray={pathLen} strokeDashoffset={pathLen}
                            style={{ transition: "stroke-dashoffset 0.06s linear" }} />

                        {/* ── CHECKPOINT NODES ── */}
                        {MILESTONES.map((_, i) => {
                            const node = NODES[i];
                            const cp = cpP(i);
                            const show = i === 0 ? true : cp > 0.05;
                            if (!show) return null;

                            const isA = i === activeIdx;
                            const isP = i < activeIdx;

                            return (
                                <g key={i} opacity={i === 0 ? 1 : Math.min(1, cp * 2.8)}>

                                    {/* Ambient bloom */}
                                    <circle cx={node.x} cy={node.y}
                                        r={isA ? 22 : 13}
                                        fill={isA ? "rgba(141,198,63,0.09)" : "rgba(43,126,161,0.06)"}
                                        filter="url(#hrpj-ng)"
                                        style={{ transition: "all 0.5s ease" }} />

                                    {/* Pulse ring */}
                                    {isA && (
                                        <circle cx={node.x} cy={node.y} r={17}
                                            fill="none" stroke="#8DC63F" strokeWidth="1"
                                            className="hrpj-pulse"
                                            style={{ transformOrigin: `${node.x}px ${node.y}px` }} />
                                    )}

                                    {/* Outer ring */}
                                    <circle cx={node.x} cy={node.y}
                                        r={isA ? 9 : isP ? 7 : 6}
                                        fill="#080d14"
                                        stroke={isA ? "#8DC63F" : isP ? "#2B7EA1" : "rgba(43,126,161,0.28)"}
                                        strokeWidth={isA ? 2 : 1.5}
                                        filter={isA ? "url(#hrpj-ng)" : undefined}
                                        style={{ transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)" }} />

                                    {/* Inner dot */}
                                    <circle cx={node.x} cy={node.y}
                                        r={isA ? 3.5 : isP ? 2.5 : 2}
                                        fill={isA ? "#8DC63F" : isP ? "#2B7EA1" : "rgba(43,126,161,0.18)"}
                                        style={{ transition: "all 0.4s ease" }} />

                                    {/* Tick marks */}
                                    {(isA || isP) && (
                                        <>
                                            <line x1={node.x - 14} y1={node.y} x2={node.x - 11} y2={node.y}
                                                stroke={isA ? "rgba(141,198,63,0.4)" : "rgba(43,126,161,0.22)"}
                                                strokeWidth="0.7" />
                                            <line x1={node.x + 11} y1={node.y} x2={node.x + 14} y2={node.y}
                                                stroke={isA ? "rgba(141,198,63,0.4)" : "rgba(43,126,161,0.22)"}
                                                strokeWidth="0.7" />
                                        </>
                                    )}
                                </g>
                            );
                        })}

                        {/* Moving tip dot */}
                        {tipPt && (
                            <g>
                                <circle cx={tipPt.x} cy={tipPt.y} r={11}
                                    fill="rgba(141,198,63,0.1)" filter="url(#hrpj-ng)" />
                                <circle cx={tipPt.x} cy={tipPt.y} r={4.5}
                                    fill="#8DC63F" opacity="0.9" filter="url(#hrpj-ng)" />
                                <circle cx={tipPt.x} cy={tipPt.y} r={2}
                                    fill="#e5f8c5" opacity="0.88" />
                            </g>
                        )}
                    </svg>

                </div>
            </section>

            {/* ══════════════════════════════════════════
                PREMIUM MOBILE TIMELINE — shown on < lg
                Scroll-driven line + IntersectionObserver
                card reveals. Same atmosphere, vertical
                storytelling format.
            ══════════════════════════════════════════ */}
            <div className="hrpjm" ref={mobileRef} aria-label="Company Journey">

                {/* Background atmosphere */}
                <div className="hrpjm-bg-grid" />
                <div className="hrpjm-bg-ambient" />
                <div className="hrpjm-bg-noise" />

                {/* Ghost year watermark — updates with active milestone */}
                <div className="hrpjm-ghost">
                    {MILESTONES[mobileActiveIdx]?.year ?? "2009"}
                </div>

                {/* ── STICKY PROGRESS BAR ── */}
                <div className="hrpjm-bar">
                    <span className="hrpjm-bar-year">
                        {MILESTONES[mobileActiveIdx]?.year}
                    </span>
                    <span className="hrpjm-bar-sep">—</span>
                    <span className="hrpjm-bar-chapter">
                        {MILESTONES[mobileActiveIdx]?.chapter}
                    </span>
                    <div className="hrpjm-bar-track">
                        <div
                            className="hrpjm-bar-fill"
                            style={{ width: `${mobileProgress * 100}%` }}
                        />
                    </div>
                    <span className="hrpjm-bar-count">
                        {mobileActiveIdx + 1}&nbsp;/&nbsp;{MILESTONES.length}
                    </span>
                </div>

                {/* ── SECTION HEADER ── */}
                <div className="hrpjm-header">
                    <p className="hrpj-eyebrow">Est. 2009 · Industrial Heritage</p>
                    <div className="hrpj-hairline" />
                    <h2 className="hrpj-h2">
                        Engineering Growth<br /><em>Since 2009</em>
                    </h2>
                    <p className="hrpj-hint" style={{ marginTop: '8px' }}>
                        Scroll to travel through our milestones
                    </p>
                </div>

                {/* ── TIMELINE ── */}
                <div className="hrpjm-timeline">

                    {/* Ghost track (always visible) */}
                    <div className="hrpjm-line-track" />

                    {/* Animated fill line (grows with scroll) */}
                    <div className="hrpjm-line-fill" ref={mobileLineRef} />

                    {/* Milestone items */}
                    {MILESTONES.map((m, i) => {
                        const isActive = i === mobileActiveIdx;
                        const isPassed = i < mobileActiveIdx;

                        return (
                            <div className="hrpjm-item" key={m.year}>

                                {/* Node */}
                                <div className={`hrpjm-node${isActive ? ' active' : isPassed ? ' passed' : ''}`} />

                                {/* Card — revealed by IntersectionObserver */}
                                <div
                                    ref={(el) => (cardRefs.current[i] = el)}
                                    className={`hrpjm-card${isActive ? ' active-card' : ''}`}
                                >
                                    {/* Blueprint grid */}
                                    <div className="hrpjm-card-grid" />

                                    {/* Top glowing edge */}
                                    <div className="hrpjm-card-edge" />

                                    {/* Cinematic image */}
                                    <div className="hrpjm-img-wrap">
                                        <img
                                            src={m.image}
                                            alt={m.title}
                                            className="hrpjm-img"
                                            loading="lazy"
                                            draggable={false}
                                        />
                                        <div className="hrpjm-img-overlay" />
                                        <div className="hrpjm-img-glow" />
                                        <div className="hrpjm-chapter">{m.chapter}</div>
                                    </div>

                                    {/* Card body */}
                                    <div className="hrpjm-body">
                                        <div className="hrpjm-year-row">
                                            <span className="hrpjm-year">{m.year}</span>
                                            <div className="hrpjm-year-rule" />
                                            <span className="hrpjm-stat">{m.stat}</span>
                                        </div>
                                        <div className="hrpjm-subtitle">{m.subtitle}</div>
                                        <div className="hrpjm-title">{m.title}</div>
                                        <div className="hrpjm-story-rule" />
                                        <p className="hrpjm-story">{m.story}</p>
                                        <span className="hrpjm-tag">{m.tag}</span>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}