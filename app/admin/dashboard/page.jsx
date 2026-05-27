"use client";
// ─── app/admin/dashboard/page.jsx ─────────────────────────────────────────────
// Updated: Products and Inquiries cards are now ACTIVE (no longer "Coming Soon")
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

function StatCard({ label, value, sub, color, href, loading, icon }) {
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
            onMouseEnter={(e) => {
                if (href) {
                    e.currentTarget.style.background = `${color}0a`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 32px ${color}18`;
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: `${color}10`, filter: "blur(20px)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: `${color}16`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                    {icon}
                </div>
                {href && (
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.2)" strokeWidth={2}>
                        <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <p style={{ fontSize: "34px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-syne,Syne,sans-serif)", marginBottom: "4px", lineHeight: 1 }}>
                {loading ? <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.2)" }}>—</span> : value}
            </p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: "3px" }}>{label}</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{sub}</p>
        </div>
    );
    return href ? <Link href={href} style={{ textDecoration: "none" }}>{card}</Link> : card;
}

function ActionCard({ title, desc, href, color, icon }) {
    return (
        <Link href={href} style={{ textDecoration: "none", display: "block" }}>
            <div
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px", padding: "22px",
                    height: "100%", boxSizing: "border-box",
                    cursor: "pointer", transition: "background 0.2s, border-color 0.2s",
                    position: "relative", display: "flex", flexDirection: "column",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.055)"; e.currentTarget.style.borderColor = `${color}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
                <span style={{
                    position: "absolute", top: "14px", right: "14px",
                    fontSize: "10px", padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.05em",
                    background: `${color}18`, color, border: `1px solid ${color}28`,
                }}>Active</span>
                <div style={{ width: "38px", height: "38px", borderRadius: "9px", backgroundColor: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: "14px" }}>
                    {icon}
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "6px", fontFamily: "var(--font-syne,Syne,sans-serif)", paddingRight: "64px" }}>{title}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.55, flex: 1 }}>{desc}</p>
                <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color, fontWeight: 500 }}>Manage →</span>
                </div>
            </div>
        </Link>
    );
}

function timeAgo(ts) {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function ActivityFeed({ recentCategories, recentProducts, recentInquiries, loading }) {
    const items = [
        ...(recentCategories || []).map((c) => ({ label: `Category added: ${c.name}`, sub: `/${c.slug}`, ts: c.created_at, color: "#2B7EA1", icon: "≡" })),
        ...(recentProducts || []).map((p) => ({ label: `Product added: ${p.name}`, sub: p.category_slug, ts: p.created_at, color: "#8DC63F", icon: "◈" })),
        ...(recentInquiries || []).map((i) => ({ label: `Inquiry from ${i.name}`, sub: i.category || i.phone, ts: i.created_at, color: "#E5A020", icon: "✉" })),
    ].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8);

    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px" }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Recent Activity</p>
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ height: "38px", borderRadius: "7px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s ease-in-out infinite" }} />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "20px 0" }}>No recent activity yet</p>
            ) : items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `${item.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: item.color, flexShrink: 0 }}>
                        {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontFamily: "monospace" }}>{item.sub}</p>
                    </div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{timeAgo(item.ts)}</p>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState({ categories: null, products: null, inquiries: null, newInquiries: null });
    const [recentCats, setRecentCats] = useState([]);
    const [recentProds, setRecentProds] = useState([]);
    const [recentInqs, setRecentInqs] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [cat, prod, inq, newInq, latestCats, latestProds, latestInqs] = await Promise.all([
                supabase.from("categories").select("id", { count: "exact", head: true }),
                supabase.from("products").select("id", { count: "exact", head: true }),
                supabase.from("inquiries").select("id", { count: "exact", head: true }),
                supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
                supabase.from("categories").select("name,slug,created_at").order("created_at", { ascending: false }).limit(4),
                supabase.from("products").select("name,category_slug,created_at").order("created_at", { ascending: false }).limit(4),
                supabase.from("inquiries").select("name,phone,category,created_at").order("created_at", { ascending: false }).limit(4),
            ]);
            setCounts({ categories: cat.count ?? 0, products: prod.count ?? 0, inquiries: inq.count ?? 0, newInquiries: newInq.count ?? 0 });
            setRecentCats(latestCats.data || []);
            setRecentProds(latestProds.data || []);
            setRecentInqs(latestInqs.data || []);
            setActivityLoading(false);
        }
        fetchData();
    }, []);

    const loading = counts.categories === null;

    return (
        <div style={{ maxWidth: "1040px" }}>
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontFamily: "var(--font-syne,Syne,sans-serif)", fontWeight: 700, fontSize: "26px", color: "#fff", marginBottom: "5px" }}>Dashboard</h1>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px" }}>Overview of your HRP Industrial Products website</p>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "14px", marginBottom: "32px" }}>
                <StatCard label="Categories" value={counts.categories} sub="Product categories defined" color="#2B7EA1" href="/admin/dashboard/categories" loading={loading}
                    icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" /></svg>} />
                <StatCard label="Products" value={counts.products} sub="Total products listed" color="#8DC63F" href="/admin/dashboard/product" loading={loading}
                    icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
                <StatCard label="Inquiries" value={counts.inquiries} sub={`${counts.newInquiries ?? "—"} new unread`} color="#E5A020" href="/admin/dashboard/inquiries" loading={loading}
                    icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
            </div>

            {/* Two-col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }} className="dashboard-grid">
                <div>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Quick Actions</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                        <ActionCard title="Manage Categories" desc="Add, edit or remove product categories shown on the website." href="/admin/dashboard/categories" color="#2B7EA1"
                            icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" /></svg>} />
                        <ActionCard title="Manage Products" desc="Upload and manage your industrial product catalogue with subcategory filters." href="/admin/dashboard/product" color="#8DC63F"
                            icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
                        <ActionCard title="View Inquiries" desc="Review and manage customer inquiries from the contact form." href="/admin/dashboard/inquiries" color="#E5A020"
                            icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
                        <ActionCard title="Site Notice" desc="Edit the popup that greets visitors on the homepage — announce sales, closures, or any update." href="/admin/dashboard/notice" color="#a855f7"
                            icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
                    </div>
                </div>
                <ActivityFeed recentCategories={recentCats} recentProducts={recentProds} recentInquiries={recentInqs} loading={activityLoading} />
            </div>

            {/* Status */}
            <div style={{ marginTop: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#8DC63F", boxShadow: "0 0 6px #8DC63F", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>All systems operational — Supabase connected</p>
            </div>

            <style>{`@media(max-width:900px){.dashboard-grid{grid-template-columns:1fr!important;}}`}</style>
        </div>
    );
}