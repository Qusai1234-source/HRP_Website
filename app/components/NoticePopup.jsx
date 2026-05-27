"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const STORAGE_KEY = "hrp_notice_dismissed_id";

const THEMES = {
    sale: {
        accent: "#8DC63F",
        accentSoft: "rgba(141,198,63,0.18)",
        accentBorder: "rgba(141,198,63,0.45)",
        bgGlow: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(141,198,63,0.18) 0%, transparent 70%)",
        eyebrow: "Limited Time Offer",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V22H4V12" />
                <path d="M2 7h20v5H2z" />
                <path d="M12 22V7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
        ),
    },
    closure: {
        accent: "#E5A020",
        accentSoft: "rgba(229,160,32,0.15)",
        accentBorder: "rgba(229,160,32,0.45)",
        bgGlow: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(229,160,32,0.15) 0%, transparent 70%)",
        eyebrow: "Important Notice",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
    },
    urgent: {
        accent: "#ef4444",
        accentSoft: "rgba(239,68,68,0.15)",
        accentBorder: "rgba(239,68,68,0.45)",
        bgGlow: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(239,68,68,0.15) 0%, transparent 70%)",
        eyebrow: "Urgent",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    info: {
        accent: "#2B7EA1",
        accentSoft: "rgba(43,126,161,0.18)",
        accentBorder: "rgba(43,126,161,0.45)",
        bgGlow: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(43,126,161,0.18) 0%, transparent 70%)",
        eyebrow: "Announcement",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
    },
};

export default function NoticePopup() {
    const [notice, setNotice] = useState(null);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const { data, error } = await supabase
                    .from("notices")
                    .select("id,title,message,type,cta_label,cta_link,updated_at")
                    .eq("is_active", true)
                    .order("updated_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (cancelled || error || !data) return;

                const dismissedKey = `${data.id}:${data.updated_at}`;
                const lastDismissed = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
                if (lastDismissed === dismissedKey) return;

                setNotice({ ...data, dismissedKey });
                setTimeout(() => !cancelled && setVisible(true), 600);
            } catch (err) {
                console.warn("[NoticePopup] fetch failed:", err?.message);
            }
        })();

        return () => { cancelled = true; };
    }, []);

    function dismiss() {
        setClosing(true);
        if (notice && typeof window !== "undefined") {
            try { localStorage.setItem(STORAGE_KEY, notice.dismissedKey); } catch {}
        }
        setTimeout(() => {
            setVisible(false);
            setNotice(null);
            setClosing(false);
        }, 250);
    }

    if (!notice || !visible) return null;

    const theme = THEMES[notice.type] || THEMES.info;
    const hasCTA = notice.cta_label && notice.cta_link;

    return (
        <>
            <style>{`
                @keyframes hrp-notice-overlay-in { from { opacity: 0 } to { opacity: 1 } }
                @keyframes hrp-notice-overlay-out { from { opacity: 1 } to { opacity: 0 } }
                @keyframes hrp-notice-card-in {
                    from { opacity: 0; transform: translateY(-24px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)     scale(1); }
                }
                @keyframes hrp-notice-card-out {
                    from { opacity: 1; transform: translateY(0)    scale(1); }
                    to   { opacity: 0; transform: translateY(12px) scale(0.98); }
                }
                @keyframes hrp-notice-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 ${theme.accentSoft}; }
                    50%      { box-shadow: 0 0 0 14px transparent; }
                }
            `}</style>

            {/* Overlay */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="hrp-notice-title"
                onClick={dismiss}
                style={{
                    position: "fixed", inset: 0, zIndex: 9000,
                    background: "rgba(8,13,20,0.78)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "24px",
                    animation: `${closing ? "hrp-notice-overlay-out" : "hrp-notice-overlay-in"} 0.25s ease forwards`,
                }}
            >
                {/* Card */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: "relative",
                        width: "100%", maxWidth: "480px",
                        background: "linear-gradient(180deg, #142133 0%, #0E1520 100%)",
                        border: `1px solid ${theme.accentBorder}`,
                        borderRadius: "18px",
                        overflow: "hidden",
                        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset`,
                        animation: `${closing ? "hrp-notice-card-out" : "hrp-notice-card-in"} 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                    }}
                >
                    {/* Top glow */}
                    <div aria-hidden style={{ position: "absolute", inset: 0, background: theme.bgGlow, pointerEvents: "none" }} />
                    {/* Top accent line */}
                    <div aria-hidden style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                        background: `linear-gradient(90deg, transparent, ${theme.accent} 30%, ${theme.accent} 70%, transparent)`,
                    }} />

                    {/* Close button */}
                    <button
                        onClick={dismiss}
                        aria-label="Close notice"
                        style={{
                            position: "absolute", top: "14px", right: "14px",
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "background 0.15s, color 0.15s",
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Content */}
                    <div style={{ position: "relative", padding: "36px 32px 28px", textAlign: "center" }}>
                        {/* Icon badge */}
                        <div
                            style={{
                                width: "60px", height: "60px", borderRadius: "16px",
                                background: theme.accentSoft,
                                border: `1px solid ${theme.accentBorder}`,
                                color: theme.accent,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 18px",
                                animation: "hrp-notice-pulse 2.4s ease-in-out infinite",
                            }}
                        >
                            {theme.icon}
                        </div>

                        {/* Eyebrow */}
                        <p style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase",
                            color: theme.accent,
                            marginBottom: "10px",
                        }}>
                            {theme.eyebrow}
                        </p>

                        {/* Title */}
                        <h2
                            id="hrp-notice-title"
                            style={{
                                fontFamily: "var(--font-syne), Syne, sans-serif",
                                fontWeight: 700,
                                fontSize: "clamp(1.4rem, 2.5vw, 1.7rem)",
                                lineHeight: 1.2,
                                color: "#fff",
                                margin: "0 0 12px",
                            }}
                        >
                            {notice.title}
                        </h2>

                        {/* Message */}
                        <p style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: "0.95rem", lineHeight: 1.6,
                            color: "rgba(255,255,255,0.65)",
                            margin: "0 0 26px",
                            whiteSpace: "pre-wrap",
                        }}>
                            {notice.message}
                        </p>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                            {hasCTA && (
                                <a
                                    href={notice.cta_link}
                                    onClick={dismiss}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "8px",
                                        padding: "11px 22px", borderRadius: "10px",
                                        background: theme.accent,
                                        color: notice.type === "sale" ? "#0E1520" : "#fff",
                                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                        fontWeight: 600, fontSize: "0.88rem",
                                        textDecoration: "none",
                                        transition: "transform 0.15s, box-shadow 0.15s, filter 0.15s",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.08)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.filter = "none"; }}
                                >
                                    {notice.cta_label}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </a>
                            )}
                            <button
                                onClick={dismiss}
                                style={{
                                    padding: "11px 22px", borderRadius: "10px",
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "rgba(255,255,255,0.7)",
                                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                    fontWeight: 600, fontSize: "0.88rem",
                                    cursor: "pointer",
                                    transition: "background 0.15s, color 0.15s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                            >
                                {hasCTA ? "Maybe later" : "Got it"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
