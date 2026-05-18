"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, glowColor, icon, href, loading }) {
    const card = (
        <div
            style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${color}28`,
                borderTop: `3px solid ${color}`,
                borderRadius: "12px",
                padding: "22px",
                cursor: href ? "pointer" : "default",
                transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden",
            }}
            onMouseEnter={e => {
                if (href) {
                    e.currentTarget.style.background = `${color}0a`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 32px ${color}18`;
                }
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {/* Soft glow blob */}
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: `${color}10`, filter: "blur(20px)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    backgroundColor: `${color}16`, display: "flex", alignItems: "center",
                    justifyContent: "center", color: color,
                }}>
                    {icon}
                </div>
                {href && (
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.2)" strokeWidth={2}>
                        <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>

            <p style={{ fontSize: "34px", fontWeight: 700, color: "#ffffff", fontFamily: "var(--font-syne, Syne, sans-serif)", marginBottom: "4px", lineHeight: 1 }}>
                {loading ? <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.2)" }}>—</span> : value}
            </p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: "3px" }}>{label}</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{sub}</p>
        </div>
    );

    return href ? (
        <Link href={href} style={{ textDecoration: "none" }}>{card}</Link>
    ) : card;
}

// ── Quick Action Card — consistent layout for all 3 ──────────────────────────
function ActionCard({ title, desc, href, color, icon, soon }) {
    const inner = (
        <div
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px", padding: "22px",
                height: "100%", boxSizing: "border-box",
                cursor: soon ? "not-allowed" : "pointer",
                transition: "background 0.2s, border-color 0.2s",
                position: "relative", opacity: soon ? 0.65 : 1,
                display: "flex", flexDirection: "column",
            }}
            onMouseEnter={e => { if (!soon) { e.currentTarget.style.background = "rgba(255,255,255,0.055)"; e.currentTarget.style.borderColor = `${color}40`; } }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
        >
            {/* Badge — always top-right, same corner, same size */}
            <span style={{
                position: "absolute", top: "14px", right: "14px",
                fontSize: "10px", padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.05em",
                background: soon ? "rgba(141,198,63,0.12)" : `${color}18`,
                color: soon ? "#8DC63F" : color,
                border: `1px solid ${soon ? "rgba(141,198,63,0.2)" : `${color}28`}`,
            }}>
                {soon ? "Coming Soon" : "Active"}
            </span>

            <div style={{
                width: "38px", height: "38px", borderRadius: "9px",
                backgroundColor: `${color}14`, display: "flex", alignItems: "center",
                justifyContent: "center", color: color, marginBottom: "14px",
            }}>
                {icon}
            </div>

            <p style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", marginBottom: "6px", fontFamily: "var(--font-syne, Syne, sans-serif)", paddingRight: "64px" }}>
                {title}
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.55, flex: 1 }}>{desc}</p>

            {/* Footer row — same position in all cards */}
            <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: soon ? "rgba(255,255,255,0.2)" : color, fontWeight: 500 }}>
                    {soon ? "Not yet available" : "Manage →"}
                </span>
            </div>
        </div>
    );

    return soon ? (
        <div style={{ display: "block" }}>{inner}</div>
    ) : (
        <Link href={href} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>
    );
}

// ── Activity Feed ────────────────────────────────────────────────────────────
function timeAgo(ts) {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function ActivityFeed({ recentCategories, recentInquiries, loading }) {
    const items = [
        ...(recentCategories || []).map(c => ({
            type: "category",
            label: `Category added: ${c.name}`,
            sub: `/${c.slug}`,
            ts: c.created_at,
            color: "#2B7EA1",
            icon: "≡",
        })),
        ...(recentInquiries || []).map(i => ({
            type: "inquiry",
            label: `Inquiry from ${i.name}`,
            sub: i.category || i.phone,
            ts: i.created_at,
            color: "#E5A020",
            icon: "✉",
        })),
    ].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8);

    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Recent Activity</p>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8DC63F", boxShadow: "0 0 6px #8DC63F" }} />
            </div>

            {loading ? (
                <p style={{ padding: "24px", color: "rgba(255,255,255,0.25)", fontSize: "13px", textAlign: "center" }}>Loading…</p>
            ) : items.length === 0 ? (
                <div style={{ padding: "32px 20px", textAlign: "center" }}>
                    <p style={{ fontSize: "24px", marginBottom: "8px" }}>📋</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>No activity yet — add a category to get started</p>
                </div>
            ) : (
                items.map((item, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 20px",
                        borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                        <div style={{
                            width: "28px", height: "28px", borderRadius: "7px", flexShrink: 0,
                            background: `${item.color}18`, display: "flex", alignItems: "center",
                            justifyContent: "center", color: item.color, fontSize: "12px",
                        }}>
                            {item.icon}
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</p>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontFamily: "monospace" }}>{item.sub}</p>
                        </div>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{timeAgo(item.ts)}</p>
                    </div>
                ))
            )}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const [counts, setCounts] = useState({ categories: null, products: null, inquiries: null });
    const [recentCats, setRecentCats] = useState([]);
    const [recentInqs, setRecentInqs] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [cat, prod, inq, latestCats, latestInqs] = await Promise.all([
                supabase.from("categories").select("id", { count: "exact", head: true }),
                supabase.from("products").select("id", { count: "exact", head: true }),
                supabase.from("inquiries").select("id", { count: "exact", head: true }),
                supabase.from("categories").select("name,slug,created_at").order("created_at", { ascending: false }).limit(5),
                supabase.from("inquiries").select("name,phone,category,created_at").order("created_at", { ascending: false }).limit(5),
            ]);
            setCounts({ categories: cat.count ?? 0, products: prod.count ?? 0, inquiries: inq.count ?? 0 });
            setRecentCats(latestCats.data || []);
            setRecentInqs(latestInqs.data || []);
            setActivityLoading(false);
        }
        fetchData();
    }, []);

    const loading = counts.categories === null;

    return (
        <div style={{ maxWidth: "1040px" }}>
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontWeight: 700, fontSize: "26px", color: "#ffffff", marginBottom: "5px" }}>
                    Dashboard
                </h1>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px" }}>
                    Overview of your HRP Industrial Products website
                </p>
            </div>

            {/* Stat cards — each with distinct accent color */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px", marginBottom: "32px" }}>
                <StatCard
                    label="Categories"
                    value={counts.categories}
                    sub="Product categories defined"
                    color="#2B7EA1"
                    href="/admin/dashboard/categories"
                    loading={loading}
                    icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" /></svg>}
                />
                <StatCard
                    label="Products"
                    value={counts.products}
                    sub="Total products listed"
                    color="#8DC63F"
                    loading={loading}
                    icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                />
                <StatCard
                    label="Inquiries"
                    value={counts.inquiries}
                    sub="Customer inquiries received"
                    color="#E5A020"
                    loading={loading}
                    icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                />
            </div>

            {/* Two-col layout: actions + activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }} className="dashboard-grid">

                {/* Quick actions */}
                <div>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                        Quick Actions
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                        <ActionCard
                            title="Manage Categories"
                            desc="Add, edit or remove product categories shown on the website."
                            href="/admin/dashboard/categories"
                            color="#2B7EA1"
                            icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" /></svg>}
                        />
                        <ActionCard
                            title="Manage Products"
                            desc="Upload and manage your industrial product catalogue."
                            href="/admin/dashboard/products"
                            color="#8DC63F"
                            soon
                            icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        />
                        <ActionCard
                            title="View Inquiries"
                            desc="Review customer inquiries submitted through the contact form."
                            href="/admin/dashboard/inquiries"
                            color="#E5A020"
                            soon
                            icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        />
                    </div>

                    {/* Empty state for products — shown when 0 products */}
                    {!loading && counts.products === 0 && (
                        <div style={{
                            marginTop: "16px", background: "rgba(141,198,63,0.05)",
                            border: "1px dashed rgba(141,198,63,0.2)", borderRadius: "10px",
                            padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px",
                        }}>
                            <span style={{ fontSize: "28px" }}>📦</span>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>No products yet</p>
                                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                                    Get started by adding categories first, then upload your industrial product catalogue.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Activity feed */}
                <ActivityFeed recentCategories={recentCats} recentInquiries={recentInqs} loading={activityLoading} />
            </div>

            {/* System status bar */}
            <div style={{
                marginTop: "20px", background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px",
                padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px",
            }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#8DC63F", boxShadow: "0 0 6px #8DC63F", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>All systems operational — Supabase connected</p>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}