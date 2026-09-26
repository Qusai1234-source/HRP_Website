"use client";
// ─── app/admin/dashboard/users/page.jsx ──────────────────────────────────────
// Admin user management: list users, add a user, delete a user (not yourself),
// and change your own password.
//
// Privileged operations (list / create / delete) go through /api/admin/users,
// which runs server-side with the service-role key. Changing your OWN password
// is done client-side via supabase.auth.updateUser — safe, uses your session.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const S = {
    label:    { display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 },
    input:    { width: "100%", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "rgba(255,255,255,0.06)", color: "#fff" },
    btnPri:   { background: "#2B7EA1", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
    btnDanger:{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
    card:     { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 },
    ok:       { background: "rgba(141,198,63,0.1)", border: "1px solid rgba(141,198,63,0.3)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#8DC63F", marginBottom: 16 },
    err:      { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 },
};

function fmtDate(ts) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

async function authFetch(url, options = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}

export default function AdminUsersPage() {
    const [users, setUsers]     = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(true);

    // add-user form
    const [form, setForm]       = useState({ email: "", password: "", confirm: "" });
    const [adding, setAdding]   = useState(false);
    const [addErr, setAddErr]   = useState("");
    const [addOk, setAddOk]     = useState("");

    // change-my-password form
    const [pw, setPw]           = useState({ next: "", confirm: "" });
    const [pwSaving, setPwSaving] = useState(false);
    const [pwErr, setPwErr]     = useState("");
    const [pwOk, setPwOk]       = useState("");

    // delete
    const [confirmDel, setConfirmDel] = useState(null);
    const delTimer = useRef(null);
    const [listErr, setListErr] = useState("");

    async function fetchUsers() {
        setLoading(true);
        setListErr("");
        try {
            const res = await authFetch("/api/admin/users");
            const json = await res.json();
            if (!res.ok) { setListErr(json.error || "Failed to load users."); setUsers([]); }
            else { setUsers(json.users || []); setCurrentId(json.currentUserId); }
        } catch {
            setListErr("Could not reach the server.");
        }
        setLoading(false);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, []);

    async function handleAdd() {
        setAddErr(""); setAddOk("");
        if (!form.email.trim()) { setAddErr("Email is required."); return; }
        if (form.password.length < 8) { setAddErr("Password must be at least 8 characters."); return; }
        if (form.password !== form.confirm) { setAddErr("Passwords do not match."); return; }

        setAdding(true);
        try {
            const res = await authFetch("/api/admin/users", {
                method: "POST",
                body: JSON.stringify({ email: form.email.trim(), password: form.password }),
            });
            const json = await res.json();
            if (!res.ok) { setAddErr(json.error || "Failed to create user."); }
            else {
                setAddOk(`User ${form.email.trim()} created.`);
                setForm({ email: "", password: "", confirm: "" });
                fetchUsers();
            }
        } catch {
            setAddErr("Could not reach the server.");
        }
        setAdding(false);
    }

    async function handleChangeMyPassword() {
        setPwErr(""); setPwOk("");
        if (pw.next.length < 8) { setPwErr("Password must be at least 8 characters."); return; }
        if (pw.next !== pw.confirm) { setPwErr("Passwords do not match."); return; }

        setPwSaving(true);
        const { error } = await supabase.auth.updateUser({ password: pw.next });
        setPwSaving(false);
        if (error) { setPwErr(error.message); return; }
        setPwOk("Your password has been updated.");
        setPw({ next: "", confirm: "" });
    }

    async function handleDelete(u) {
        if (confirmDel !== u.id) {
            setConfirmDel(u.id);
            clearTimeout(delTimer.current);
            delTimer.current = setTimeout(() => setConfirmDel(null), 3000);
            return;
        }
        clearTimeout(delTimer.current);
        setConfirmDel(null);
        setListErr("");
        const res = await authFetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setListErr(json.error || "Failed to delete user.");
            return;
        }
        fetchUsers();
    }

    return (
        <div style={{ maxWidth: 940, fontFamily: "'Inter',sans-serif" }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "var(--font-syne,Syne,sans-serif)", fontWeight: 700, fontSize: 26, color: "#fff", marginBottom: 5 }}>
                    Users
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    Manage who can sign in to this admin panel. Every user here has full admin access.
                </p>
            </div>

            {/* ── User list ── */}
            <div style={{ ...S.card, marginBottom: 24, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                        Admin users {!loading && `(${users.length})`}
                    </h2>
                </div>

                {listErr && <div style={{ ...S.err, margin: 16 }}>{listErr}</div>}

                {loading ? (
                    <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Loading…</div>
                ) : users.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>No users found.</div>
                ) : (
                    <div>
                        {users.map((u) => {
                            const isMe = u.id === currentId;
                            return (
                                <div key={u.id} style={{
                                    display: "flex", alignItems: "center", gap: 14,
                                    padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.04)",
                                }}>
                                    <div style={{
                                        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                                        background: "rgba(43,126,161,0.15)", border: "1px solid rgba(43,126,161,0.3)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#2B7EA1", fontWeight: 700, fontSize: 13, textTransform: "uppercase",
                                    }}>
                                        {(u.email || "?").slice(0, 2)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 14, color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {u.email}
                                            </span>
                                            {isMe && (
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(141,198,63,0.18)", color: "#8DC63F", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                                            Added {fmtDate(u.created_at)} · Last sign in {fmtDate(u.last_sign_in_at)}
                                        </div>
                                    </div>
                                    {isMe ? (
                                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic", flexShrink: 0 }}>
                                            Current account
                                        </span>
                                    ) : (
                                        <button style={S.btnDanger} onClick={() => handleDelete(u)}>
                                            {confirmDel === u.id ? "Confirm delete?" : "Delete"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Two-column: add user + change my password ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Add user */}
                <div style={S.card}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Add a new user</h2>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
                        They can sign in immediately with the password you set.
                    </p>

                    {addErr && <div style={S.err}>{addErr}</div>}
                    {addOk && <div style={S.ok}>{addOk}</div>}

                    <div style={{ marginBottom: 14 }}>
                        <label style={S.label}>Email</label>
                        <input style={S.input} type="email" placeholder="name@hrpvizag.com"
                            value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                        <label style={S.label}>Password (min 8 characters)</label>
                        <input style={S.input} type="password" placeholder="••••••••"
                            value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={S.label}>Confirm password</label>
                        <input style={S.input} type="password" placeholder="••••••••"
                            value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} />
                    </div>
                    <button style={{ ...S.btnPri, width: "100%", opacity: adding ? 0.6 : 1 }} onClick={handleAdd} disabled={adding}>
                        {adding ? "Creating…" : "Create user"}
                    </button>
                </div>

                {/* Change my password */}
                <div style={S.card}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Change my password</h2>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
                        Updates the password for your own account, signed in now.
                    </p>

                    {pwErr && <div style={S.err}>{pwErr}</div>}
                    {pwOk && <div style={S.ok}>{pwOk}</div>}

                    <div style={{ marginBottom: 14 }}>
                        <label style={S.label}>New password (min 8 characters)</label>
                        <input style={S.input} type="password" placeholder="••••••••"
                            value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={S.label}>Confirm new password</label>
                        <input style={S.input} type="password" placeholder="••••••••"
                            value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
                    </div>
                    <button style={{ ...S.btnPri, width: "100%", opacity: pwSaving ? 0.6 : 1 }} onClick={handleChangeMyPassword} disabled={pwSaving}>
                        {pwSaving ? "Updating…" : "Update my password"}
                    </button>
                </div>
            </div>
        </div>
    );
}
