"use client";
// ─── app/admin/login/page.jsx ─────────────────────────────────────────────────
// Admin login — Supabase email + password auth.
// On success → redirect to /admin/dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPw, setShowPw] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError(""); setLoading(true);
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        setLoading(false);
        if (err) { setError(err.message || "Login failed. Check your credentials."); return; }
        router.push("/admin/dashboard");
    }

    return (
        <div style={{
            minHeight: "100vh", background: "#0E1520",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, fontFamily: "'Inter',sans-serif",
            backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(43,126,161,0.25), transparent)",
        }}>
            {/* Card */}
            <div style={{
                width: "100%", maxWidth: 400,
                background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
                padding: "40px 36px", boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}>
                {/* Logo area */}
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14, background: "rgba(43,126,161,0.15)",
                        border: "1px solid rgba(43,126,161,0.25)", display: "flex",
                        alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                    }}>
                        <svg width="22" height="22" fill="none" stroke="#2B7EA1" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "var(--font-syne,Syne,sans-serif)", marginBottom: 4 }}>Admin Panel</h1>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>HRP Industrial Products</p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)",
                        borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#FCA5A5",
                        marginBottom: 20, display: "flex", gap: 8, alignItems: "center",
                    }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Email */}
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Email</label>
                        <input
                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@hrpindustrial.com"
                            style={{
                                width: "100%", padding: "11px 14px", borderRadius: 10,
                                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                                color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                                fontFamily: "inherit", transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(43,126,161,0.6)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                style={{
                                    width: "100%", padding: "11px 42px 11px 14px", borderRadius: 10,
                                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                                    fontFamily: "inherit", transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(43,126,161,0.6)")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                            />
                            <button
                                type="button" onClick={() => setShowPw((p) => !p)}
                                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0 }}
                            >
                                {showPw ? (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit" disabled={loading}
                        style={{
                            marginTop: 6, width: "100%", padding: "12px",
                            background: loading ? "rgba(43,126,161,0.5)" : "#2B7EA1",
                            border: "none", borderRadius: 10, color: "#fff",
                            fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                            transition: "background 0.2s", fontFamily: "inherit",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#246d8e"; }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#2B7EA1"; }}
                    >
                        {loading ? (
                            <>
                                <div style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
                                Signing in…
                            </>
                        ) : "Sign In"}
                    </button>
                </form>

                {/* Footer note */}
                <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 28 }}>
                    This page is not publicly linked. Admin access only.
                </p>
            </div>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}