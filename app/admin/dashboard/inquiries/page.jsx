"use client";
// ─── app/admin/dashboard/inquiries/page.jsx ──────────────────────────────────
// Full inquiry management: stats, filter tabs, search, table, detail modal,
// status updates, two-click delete, toast system.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(ts) {
    const s = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
    return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(ts) {
    return new Date(ts).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function truncate(str, n) {
    if (!str) return "—";
    return str.length > n ? str.slice(0, n) + "…" : str;
}

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
    new:      { label: "New",      bg: "#E5A020", color: "#fff" },
    read:     { label: "Read",     bg: "#2B7EA1", color: "#fff" },
    resolved: { label: "Resolved", bg: "#4CAF50", color: "#fff" },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || { label: status, bg: "#555", color: "#fff" };
    return (
        <span style={{
            background: cfg.bg, color: cfg.color,
            fontSize: 11, fontWeight: 700, padding: "2px 10px",
            borderRadius: 20, letterSpacing: "0.03em",
            display: "inline-block",
        }}>
            {cfg.label}
        </span>
    );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 9999,
            background: toast.type === "success" ? "#166534" : "#7f1d1d",
            border: `1px solid ${toast.type === "success" ? "#4ade80" : "#f87171"}`,
            color: "#fff", borderRadius: 12, padding: "13px 20px",
            fontSize: 14, fontWeight: 500, maxWidth: 320,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", gap: 10,
            animation: "slideInRight 0.22s ease",
        }}>
            {toast.type === "success"
                ? <svg width="16" height="16" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg width="16" height="16" fill="none" stroke="#f87171" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            }
            {toast.msg}
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon, loading }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${color}28`,
            borderTop: `3px solid ${color}`, borderRadius: 12, padding: "20px 22px",
            position: "relative", overflow: "hidden",
        }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${color}10`, filter: "blur(20px)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}16`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
            </div>
            <p style={{ fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "var(--font-syne,Syne,sans-serif)", lineHeight: 1, marginBottom: 4 }}>
                {loading ? <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 18 }}>—</span> : value}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{label}</p>
        </div>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ inquiry, onClose, onStatusChange }) {
    if (!inquiry) return null;
    const [updating, setUpdating] = useState(false);

    async function setStatus(newStatus) {
        setUpdating(true);
        await onStatusChange(inquiry.id, newStatus);
        setUpdating(false);
        onClose();
    }

    return (
        <>
            {/* Overlay */}
            <div onClick={onClose} style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(4px)", zIndex: 200,
            }} />
            {/* Modal */}
            <div style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: "min(600px, 95vw)", maxHeight: "90vh", overflowY: "auto",
                background: "#0E1520", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, zIndex: 201, boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}>
                {/* Header */}
                <div style={{
                    padding: "22px 26px", borderBottom: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "sticky", top: 0, background: "#0E1520", zIndex: 10,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(43,126,161,0.15)", border: "1px solid rgba(43,126,161,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="18" height="18" fill="none" stroke="#2B7EA1" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "var(--font-syne,Syne,sans-serif)", margin: 0 }}>{inquiry.name}</h2>
                            {inquiry.company && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{inquiry.company}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "26px" }}>
                    {/* Contact details grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
                        {[
                            { label: "Phone", value: inquiry.phone, icon: "📞" },
                            { label: "Email", value: inquiry.email || "—", icon: "✉️" },
                            { label: "Company", value: inquiry.company || "—", icon: "🏢" },
                            { label: "Category", value: inquiry.category || "—", icon: "🏷️" },
                        ].map(({ label, value, icon }) => (
                            <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "13px 16px" }}>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</p>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{icon} {value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Message */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Message</p>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>{inquiry.message}</p>
                    </div>

                    {/* Submitted + Status row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                            Submitted {formatDateTime(inquiry.created_at)}
                        </p>
                        <StatusBadge status={inquiry.status} />
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {inquiry.status !== "read" && (
                            <button onClick={() => setStatus("read")} disabled={updating} style={{
                                flex: 1, padding: "11px 18px", background: "rgba(43,126,161,0.15)",
                                border: "1px solid rgba(43,126,161,0.35)", borderRadius: 10,
                                color: "#2B7EA1", fontWeight: 600, fontSize: 13, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Mark as Read
                            </button>
                        )}
                        {inquiry.status !== "resolved" && (
                            <button onClick={() => setStatus("resolved")} disabled={updating} style={{
                                flex: 1, padding: "11px 18px", background: "rgba(76,175,80,0.12)",
                                border: "1px solid rgba(76,175,80,0.3)", borderRadius: 10,
                                color: "#4CAF50", fontWeight: 600, fontSize: 13, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Mark as Resolved
                            </button>
                        )}
                        <button onClick={onClose} style={{
                            padding: "11px 20px", background: "transparent",
                            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                            color: "rgba(255,255,255,0.45)", fontWeight: 500, fontSize: 13, cursor: "pointer",
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, timer }
    const [selected, setSelected] = useState(null); // inquiry for detail modal

    // Stats
    const total = inquiries.length;
    const newCount = inquiries.filter(i => i.status === "new").length;
    const resolvedCount = inquiries.filter(i => i.status === "resolved" || i.status === "read").length;

    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("inquiries")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error) setInquiries(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

    // Status update
    async function handleStatusChange(id, newStatus) {
        const { error } = await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
        if (error) { showToast("Failed to update status", "error"); return; }
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        showToast(`Marked as ${newStatus}`);
    }

    // Two-click delete
    function handleDeleteClick(id) {
        if (deleteConfirm?.id === id) {
            // Second click — execute
            clearTimeout(deleteConfirm.timer);
            executeDelete(id);
        } else {
            // First click — arm
            if (deleteConfirm?.timer) clearTimeout(deleteConfirm.timer);
            const timer = setTimeout(() => setDeleteConfirm(null), 3000);
            setDeleteConfirm({ id, timer });
        }
    }

    async function executeDelete(id) {
        setDeleteConfirm(null);
        const { error } = await supabase.from("inquiries").delete().eq("id", id);
        if (error) { showToast("Failed to delete inquiry", "error"); return; }
        setInquiries(prev => prev.filter(i => i.id !== id));
        showToast("Inquiry deleted");
    }

    // Filter
    const filtered = inquiries.filter(inq => {
        const matchTab = tab === "all" || inq.status === tab;
        const q = search.toLowerCase();
        const matchSearch = !q || (
            (inq.name || "").toLowerCase().includes(q) ||
            (inq.phone || "").toLowerCase().includes(q) ||
            (inq.email || "").toLowerCase().includes(q) ||
            (inq.message || "").toLowerCase().includes(q) ||
            (inq.company || "").toLowerCase().includes(q)
        );
        return matchTab && matchSearch;
    });

    const TABS = [
        { key: "all", label: "All", count: total },
        { key: "new", label: "New", count: newCount },
        { key: "read", label: "Read", count: inquiries.filter(i => i.status === "read").length },
        { key: "resolved", label: "Resolved", count: inquiries.filter(i => i.status === "resolved").length },
    ];

    return (
        <div style={{ fontFamily: "'Inter',sans-serif", paddingBottom: 60 }}>

            {/* ── Header ── */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(229,160,32,0.14)", border: "1px solid rgba(229,160,32,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" fill="none" stroke="#E5A020" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "var(--font-syne,Syne,sans-serif)", margin: 0 }}>Inquiries</h1>
                    {newCount > 0 && (
                        <span style={{ background: "#E5A020", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>{newCount} new</span>
                    )}
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Manage and respond to customer inquiries</p>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
                <StatCard label="Total Inquiries" value={total} color="#2B7EA1" loading={loading}
                    icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <StatCard label="New / Unread" value={newCount} color="#E5A020" loading={loading}
                    icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
                />
                <StatCard label="Resolved" value={resolvedCount} color="#4CAF50" loading={loading}
                    icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            {/* ── Toolbar: Tabs + Search ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                {/* Filter tabs */}
                <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 4 }}>
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                            background: tab === t.key ? "#2B7EA1" : "transparent",
                            color: tab === t.key ? "#fff" : "rgba(255,255,255,0.4)",
                            transition: "all 0.15s",
                            display: "flex", alignItems: "center", gap: 6,
                        }}>
                            {t.label}
                            {t.count > 0 && (
                                <span style={{ fontSize: 10, background: tab === t.key ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", borderRadius: 10, padding: "1px 6px" }}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, phone, email…"
                        style={{
                            paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                            borderRadius: 10, color: "#fff", fontSize: 13, outline: "none", width: 260,
                            fontFamily: "inherit",
                        }}
                    />
                </div>
            </div>

            {/* ── Table ── */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: "60px 0", display: "flex", justifyContent: "center" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2.5px solid #2B7EA1", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: "64px 0", textAlign: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(43,126,161,0.08)", border: "1px solid rgba(43,126,161,0.15)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                            <svg width="24" height="24" fill="none" stroke="rgba(43,126,161,0.5)" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>No inquiries found</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>{search ? `No results for "${search}"` : "Customer inquiries will appear here."}</p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                                {["#", "Contact", "Company", "Category", "Message", "Date", "Status", "Actions"].map(h => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(255,255,255,0.02)", whiteSpace: "nowrap" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((inq, idx) => {
                                const isDeleting = deleteConfirm?.id === inq.id;
                                return (
                                    <tr key={inq.id} style={{
                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)",
                                        transition: "background 0.15s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(43,126,161,0.05)"}
                                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)"}
                                    >
                                        {/* # */}
                                        <td style={{ padding: "13px 16px", color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>{idx + 1}</td>

                                        {/* Contact */}
                                        <td style={{ padding: "13px 16px", minWidth: 140 }}>
                                            <p style={{ fontWeight: 600, color: "#fff", marginBottom: 2 }}>{inq.name}</p>
                                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{inq.phone}</p>
                                        </td>

                                        {/* Company */}
                                        <td style={{ padding: "13px 16px", color: inq.company ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}>
                                            {inq.company || "—"}
                                        </td>

                                        {/* Category */}
                                        <td style={{ padding: "13px 16px" }}>
                                            {inq.category ? (
                                                <span style={{ background: "rgba(141,198,63,0.12)", border: "1px solid rgba(141,198,63,0.25)", color: "#8DC63F", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20 }}>
                                                    {inq.category}
                                                </span>
                                            ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                                        </td>

                                        {/* Message */}
                                        <td style={{ padding: "13px 16px", color: "rgba(255,255,255,0.45)", maxWidth: 220 }}>
                                            {truncate(inq.message, 60)}
                                        </td>

                                        {/* Date */}
                                        <td style={{ padding: "13px 16px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", fontSize: 12 }}>
                                            {timeAgo(inq.created_at)}
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: "13px 16px" }}>
                                            <StatusBadge status={inq.status} />
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: "13px 16px" }}>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                {/* Eye — view detail */}
                                                <button onClick={() => setSelected(inq)} title="View detail" style={{
                                                    width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                                                    background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)",
                                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                                    transition: "all 0.15s",
                                                }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(43,126,161,0.15)"; e.currentTarget.style.color = "#2B7EA1"; e.currentTarget.style.borderColor = "rgba(43,126,161,0.3)"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                                                >
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>

                                                {/* Delete */}
                                                <button onClick={() => handleDeleteClick(inq.id)} title={isDeleting ? "Click again to confirm" : "Delete"} style={{
                                                    width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    border: isDeleting ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                                    background: isDeleting ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                                                    color: isDeleting ? "#ef4444" : "rgba(255,255,255,0.5)",
                                                    transition: "all 0.15s", position: "relative",
                                                }}
                                                    onMouseEnter={e => { if (!isDeleting) { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; } }}
                                                    onMouseLeave={e => { if (!isDeleting) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; } }}
                                                >
                                                    {isDeleting ? (
                                                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.02em" }}>Sure?</span>
                                                    ) : (
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Row count */}
            {!loading && filtered.length > 0 && (
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 12, textAlign: "right" }}>
                    Showing {filtered.length} of {total} inquiries
                </p>
            )}

            {/* Detail modal */}
            {selected && (
                <DetailModal
                    inquiry={selected}
                    onClose={() => setSelected(null)}
                    onStatusChange={async (id, status) => {
                        await handleStatusChange(id, status);
                        setSelected(prev => prev ? { ...prev, status } : null);
                    }}
                />
            )}

            {/* Toast */}
            <Toast toast={toast} />

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideInRight { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
            `}</style>
        </div>
    );
}
