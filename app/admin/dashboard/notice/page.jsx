"use client";
// ─── app/admin/dashboard/notice/page.jsx ─────────────────────────────────────
// Manage the homepage notice popup.
// Only one notice is "active" at a time. Toggling one active deactivates the
// others. Visitors see the latest active notice once until they dismiss it.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const TYPE_OPTIONS = [
    { value: "info", label: "Info (blue)", color: "#2B7EA1" },
    { value: "sale", label: "Sale (green)", color: "#8DC63F" },
    { value: "closure", label: "Closure (amber)", color: "#E5A020" },
    { value: "urgent", label: "Urgent (red)", color: "#ef4444" },
];

const EMPTY = {
    title: "",
    message: "",
    type: "info",
    cta_label: "",
    cta_link: "",
    is_active: true,
};

const S = {
    label: { display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 },
    input: { width: "100%", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "rgba(255,255,255,0.06)", color: "#fff" },
    select: { padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, fontSize: 13, outline: "none", background: "#1a2535", color: "#fff", cursor: "pointer", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
    btnPri: { background: "#2B7EA1", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
    btnSec: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
    btnDanger: { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "9px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 },
};

function timeAgo(ts) {
    if (!ts) return "—";
    const s = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

export default function AdminNoticePage() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [confirmDel, setConfirmDel] = useState(null);

    async function fetchAll() {
        setLoading(true);
        const { data, error } = await supabase
            .from("notices")
            .select("*")
            .order("updated_at", { ascending: false });
        if (error) {
            console.error(error);
            setError(error.message);
        } else {
            setNotices(data || []);
        }
        setLoading(false);
    }

    useEffect(() => { fetchAll(); }, []);

    function setF(k, v) { setForm((p) => ({ ...p, [k]: v })); }

    function resetForm() {
        setForm(EMPTY);
        setEditId(null);
        setError("");
    }

    function openEdit(n) {
        setForm({
            title: n.title || "",
            message: n.message || "",
            type: n.type || "info",
            cta_label: n.cta_label || "",
            cta_link: n.cta_link || "",
            is_active: !!n.is_active,
        });
        setEditId(n.id);
        setError("");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSave() {
        setError("");
        if (!form.title.trim()) { setError("Title is required."); return; }
        if (!form.message.trim()) { setError("Message is required."); return; }
        if (form.cta_label && !form.cta_link) { setError("CTA link is required when a CTA label is set."); return; }

        setSaving(true);
        try {
            // If we're activating this one, deactivate everything else first
            if (form.is_active) {
                const { error: deactivateErr } = await supabase
                    .from("notices")
                    .update({ is_active: false })
                    .neq("id", editId ?? -1);
                if (deactivateErr) throw deactivateErr;
            }

            const payload = {
                title: form.title.trim(),
                message: form.message.trim(),
                type: form.type,
                cta_label: form.cta_label.trim() || null,
                cta_link: form.cta_link.trim() || null,
                is_active: form.is_active,
            };

            const { error: saveErr } = editId
                ? await supabase.from("notices").update(payload).eq("id", editId)
                : await supabase.from("notices").insert([payload]);

            if (saveErr) throw saveErr;
            resetForm();
            fetchAll();
        } catch (err) {
            setError(err.message || "Failed to save notice.");
        } finally {
            setSaving(false);
        }
    }

    async function toggleActive(n) {
        if (!n.is_active) {
            await supabase.from("notices").update({ is_active: false }).neq("id", n.id);
        }
        await supabase.from("notices").update({ is_active: !n.is_active }).eq("id", n.id);
        fetchAll();
    }

    async function handleDelete(id) {
        if (confirmDel !== id) {
            setConfirmDel(id);
            setTimeout(() => setConfirmDel((c) => (c === id ? null : c)), 3000);
            return;
        }
        await supabase.from("notices").delete().eq("id", id);
        setConfirmDel(null);
        if (editId === id) resetForm();
        fetchAll();
    }

    const activeNotice = notices.find((n) => n.is_active);

    return (
        <div style={{ maxWidth: 1040, fontFamily: "'Inter',sans-serif" }}>
            {/* ── Header ── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "var(--font-syne,Syne,sans-serif)", fontWeight: 700, fontSize: 26, color: "#fff", marginBottom: 5 }}>
                    Site Notice
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    Manage the popup that appears when visitors land on the homepage. Only one notice can be active at a time.
                </p>
            </div>

            {/* ── Active notice status banner ── */}
            <div
                style={{
                    background: activeNotice ? "rgba(141,198,63,0.07)" : "rgba(255,255,255,0.025)",
                    border: `1px solid ${activeNotice ? "rgba(141,198,63,0.25)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 12, padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap",
                }}
            >
                <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: activeNotice ? "#8DC63F" : "rgba(255,255,255,0.2)",
                    boxShadow: activeNotice ? "0 0 8px #8DC63F" : "none",
                    flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginBottom: 2 }}>
                        {activeNotice ? `Live: "${activeNotice.title}"` : "No active notice"}
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        {activeNotice
                            ? "Homepage visitors see this popup once until they dismiss it."
                            : "The homepage popup is currently hidden from all visitors."}
                    </p>
                </div>
            </div>

            {/* ── Form ── */}
            <div style={{ ...S.card, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "var(--font-syne,Syne,sans-serif)" }}>
                        {editId ? "Edit notice" : "Create new notice"}
                    </h2>
                    {editId && (
                        <button style={S.btnSec} onClick={resetForm}>Cancel edit</button>
                    )}
                </div>

                {error && (
                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                {/* Type */}
                <div style={{ marginBottom: 16 }}>
                    <label style={S.label}>Notice type</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {TYPE_OPTIONS.map((opt) => {
                            const active = form.type === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setF("type", opt.value)}
                                    style={{
                                        padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        border: `1px solid ${active ? opt.color : "rgba(255,255,255,0.1)"}`,
                                        background: active ? `${opt.color}22` : "rgba(255,255,255,0.04)",
                                        color: active ? opt.color : "rgba(255,255,255,0.55)",
                                        transition: "all 0.15s",
                                        display: "flex", alignItems: "center", gap: 8,
                                    }}
                                >
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: opt.color }} />
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Title */}
                <div style={{ marginBottom: 16 }}>
                    <label style={S.label}>Title *</label>
                    <input
                        style={S.input}
                        placeholder="e.g. Diwali Sale — 20% Off All Products"
                        value={form.title}
                        onChange={(e) => setF("title", e.target.value)}
                        maxLength={80}
                    />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{form.title.length}/80</div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 16 }}>
                    <label style={S.label}>Message *</label>
                    <textarea
                        style={{ ...S.input, resize: "vertical", minHeight: 90 }}
                        placeholder="e.g. Shop will be closed from 1st to 5th November for the festive season. Place orders early to ensure timely delivery."
                        value={form.message}
                        onChange={(e) => setF("message", e.target.value)}
                        maxLength={300}
                    />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{form.message.length}/300</div>
                </div>

                {/* CTA */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={S.label}>CTA button label (optional)</label>
                        <input
                            style={S.input}
                            placeholder="e.g. View Offers"
                            value={form.cta_label}
                            onChange={(e) => setF("cta_label", e.target.value)}
                            maxLength={30}
                        />
                    </div>
                    <div>
                        <label style={S.label}>CTA link (optional)</label>
                        <input
                            style={S.input}
                            placeholder="e.g. /products or https://…"
                            value={form.cta_link}
                            onChange={(e) => setF("cta_link", e.target.value)}
                        />
                    </div>
                </div>

                {/* Is active toggle */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}>
                        <div
                            onClick={() => setF("is_active", !form.is_active)}
                            style={{ width: 44, height: 24, borderRadius: 12, position: "relative", background: form.is_active ? "#8DC63F" : "#374151", transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}
                        >
                            <div style={{ position: "absolute", top: 2, left: form.is_active ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Show this notice on the homepage</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Saving will automatically deactivate any other notice.</div>
                        </div>
                    </label>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button style={S.btnPri} onClick={handleSave} disabled={saving}>
                        {saving ? "Saving…" : editId ? "Update notice" : "Create notice"}
                    </button>
                </div>
            </div>

            {/* ── List ── */}
            <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                    All notices ({notices.length})
                </p>

                {loading ? (
                    <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid #2B7EA1", borderTopColor: "transparent", animation: "spin 0.7s linear infinite", margin: "0 auto 10px" }} />
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading…</p>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : notices.length === 0 ? (
                    <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>No notices yet. Create one above.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {notices.map((n) => {
                            const typeOpt = TYPE_OPTIONS.find((t) => t.value === n.type) || TYPE_OPTIONS[0];
                            return (
                                <div
                                    key={n.id}
                                    style={{
                                        ...S.card,
                                        padding: "14px 18px",
                                        display: "flex", alignItems: "center", gap: 14,
                                        borderLeft: `3px solid ${n.is_active ? "#8DC63F" : "rgba(255,255,255,0.08)"}`,
                                    }}
                                >
                                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${typeOpt.color}1f`, border: `1px solid ${typeOpt.color}44`, color: typeOpt.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, textTransform: "uppercase" }}>
                                        {n.type.slice(0, 3)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                                            <p style={{ fontSize: 14, color: "#fff", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                                                {n.title}
                                            </p>
                                            {n.is_active && (
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(141,198,63,0.18)", color: "#8DC63F", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {n.message}
                                        </p>
                                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                                            Updated {timeAgo(n.updated_at)}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                        <button
                                            style={{
                                                padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                border: `1px solid ${n.is_active ? "rgba(239,68,68,0.3)" : "rgba(141,198,63,0.3)"}`,
                                                background: n.is_active ? "rgba(239,68,68,0.1)" : "rgba(141,198,63,0.1)",
                                                color: n.is_active ? "#f87171" : "#8DC63F",
                                            }}
                                            onClick={() => toggleActive(n)}
                                        >
                                            {n.is_active ? "Deactivate" : "Activate"}
                                        </button>
                                        <button
                                            style={{ padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid rgba(43,126,161,0.3)", background: "rgba(43,126,161,0.12)", color: "#2B7EA1" }}
                                            onClick={() => openEdit(n)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            style={{
                                                padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                border: confirmDel === n.id ? "1px solid #ef4444" : "1px solid rgba(239,68,68,0.25)",
                                                background: confirmDel === n.id ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.08)",
                                                color: "#ef4444",
                                            }}
                                            onClick={() => handleDelete(n.id)}
                                        >
                                            {confirmDel === n.id ? "Confirm?" : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Setup hint */}
            <div style={{ marginTop: 18, fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                If you see &quot;relation notices does not exist&quot;, run <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>supabase-notices-setup.sql</code> in your Supabase SQL editor.
            </div>
        </div>
    );
}
