"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {

            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (authError) {
                setError(authError.message);
            } else {
                router.push("/admin/dashboard");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#1A2533",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                backgroundImage:
                    "radial-gradient(ellipse at 60% 20%, rgba(43,126,161,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(141,198,63,0.06) 0%, transparent 50%)",
            }}
        >
            {/* Grid texture */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "8px",
                        }}
                    >
                        <img
                            src="/images/hrp_logo.png"
                            alt="HRP"
                            style={{ height: "40px", width: "auto" }}
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "var(--font-syne, Syne, sans-serif)",
                                fontWeight: 700,
                                fontSize: "22px",
                                color: "#ffffff",
                                letterSpacing: "0.05em",
                            }}
                        >
                            HRP
                        </span>
                    </div>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "13px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                        }}
                    >
                        Admin Panel
                    </p>
                </div>

                {/* Card */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "40px",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "var(--font-syne, Syne, sans-serif)",
                            fontWeight: 700,
                            fontSize: "22px",
                            color: "#ffffff",
                            marginBottom: "8px",
                        }}
                    >
                        Sign in
                    </h1>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.45)",
                            fontSize: "14px",
                            marginBottom: "32px",
                        }}
                    >
                        Enter your credentials to access the dashboard
                    </p>

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    color: "rgba(255,255,255,0.6)",
                                    marginBottom: "8px",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@hrp.com"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                    color: "#ffffff",
                                    fontSize: "15px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) =>
                                    (e.target.style.borderColor = "rgba(43,126,161,0.6)")
                                }
                                onBlur={(e) =>
                                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                                }
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: "28px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    color: "rgba(255,255,255,0.6)",
                                    marginBottom: "8px",
                                }}
                            >
                                Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: "100%",
                                        padding: "12px 48px 12px 16px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "8px",
                                        color: "#ffffff",
                                        fontSize: "15px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "rgba(43,126,161,0.6)")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "14px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "rgba(255,255,255,0.35)",
                                        fontSize: "13px",
                                        padding: "0",
                                    }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                style={{
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    borderRadius: "8px",
                                    padding: "12px 16px",
                                    color: "#fca5a5",
                                    fontSize: "13px",
                                    marginBottom: "20px",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "13px",
                                background: loading ? "rgba(43,126,161,0.5)" : "#2B7EA1",
                                border: "none",
                                borderRadius: "8px",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "var(--font-syne, Syne, sans-serif)",
                                letterSpacing: "0.02em",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "background 0.2s",
                            }}
                        >
                            {loading ? (
                                <>
                                    <span
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            border: "2px solid rgba(255,255,255,0.3)",
                                            borderTopColor: "#fff",
                                            borderRadius: "50%",
                                            display: "inline-block",
                                            animation: "spin 0.7s linear infinite",
                                        }}
                                    />
                                    Signing in…
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}