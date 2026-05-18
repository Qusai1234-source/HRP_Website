"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const NAV = [
    {
        href: "/admin/dashboard",
        label: "Dashboard",
        exact: true,
        icon: (
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
    },
    {
        href: "/admin/dashboard/categories",
        label: "Categories",
        icon: (
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        href: null,
        label: "Products",
        soon: true,
        icon: (
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        href: null,
        label: "Inquiries",
        soon: true,
        icon: (
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

// ── Global Search Modal ──────────────────────────────────────────────────────
function GlobalSearch({ open, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef();
    const router = useRouter();

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 60);
            setQuery("");
            setResults([]);
        }
    }, [open]);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const t = setTimeout(async () => {
            setSearching(true);
            const [cats, inqs] = await Promise.all([
                supabase.from("categories").select("id,name,slug").ilike("name", `%${query}%`).limit(5),
                supabase.from("inquiries").select("id,name,phone,category").ilike("name", `%${query}%`).limit(5),
            ]);
            const r = [
                ...(cats.data || []).map(c => ({ type: "category", label: c.name, sub: `/${c.slug}`, href: "/admin/dashboard/categories" })),
                ...(inqs.data || []).map(i => ({ type: "inquiry", label: i.name, sub: i.category || i.phone, href: "/admin/dashboard/inquiries" })),
            ];
            setResults(r);
            setSearching(false);
        }, 280);
        return () => clearTimeout(t);
    }, [query]);

    if (!open) return null;

    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 200, backdropFilter: "blur(3px)" }} />
            <div style={{
                position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
                width: "540px", maxWidth: "calc(100vw - 32px)",
                background: "#1E2D3D", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px", zIndex: 201, overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search categories, inquiries…"
                        style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#ffffff", fontSize: "15px", fontFamily: "inherit" }}
                    />
                    <kbd onClick={onClose} style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "3px 7px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>Esc</kbd>
                </div>

                <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                    {query.trim() ? (
                        searching ? (
                            <p style={{ padding: "24px", color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center" }}>Searching…</p>
                        ) : results.length === 0 ? (
                            <p style={{ padding: "24px", color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center" }}>No results for "{query}"</p>
                        ) : results.map((r, i) => (
                            <div key={i} onClick={() => { router.push(r.href); onClose(); }}
                                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.1s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <div style={{
                                    width: "30px", height: "30px", borderRadius: "7px", flexShrink: 0,
                                    background: r.type === "category" ? "rgba(43,126,161,0.18)" : "rgba(229,160,32,0.18)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: r.type === "category" ? "#2B7EA1" : "#E5A020", fontSize: "14px",
                                }}>
                                    {r.type === "category" ? "≡" : "✉"}
                                </div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <p style={{ fontSize: "14px", color: "#ffffff", marginBottom: "2px" }}>{r.label}</p>
                                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sub}</p>
                                </div>
                                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{r.type}</span>
                            </div>
                        ))
                    ) : (
                        <p style={{ padding: "20px", color: "rgba(255,255,255,0.2)", fontSize: "12px", textAlign: "center" }}>
                            Type to search across all data
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

// ── Main Layout ──────────────────────────────────────────────────────────────
export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState("");
    const [checking, setChecking] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const isLoginPage = pathname === "/admin/login";

    // ⌘K shortcut
    useEffect(() => {
        function onKey(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
            if (e.key === "Escape") setSearchOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session && !isLoginPage) {
                router.replace("/admin/login");
            } else {
                setUserEmail(session?.user?.email || "");
                setChecking(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session && !isLoginPage) router.replace("/admin/login");
            else setUserEmail(session?.user?.email || "");
        });

        return () => subscription.unsubscribe();
    }, [isLoginPage, router]);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.replace("/admin/login");
    }

    if (isLoginPage) return <>{children}</>;

    if (checking) return (
        <div style={{ minHeight: "100vh", backgroundColor: "#1A2533", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "28px", height: "28px", border: "2px solid rgba(43,126,161,0.25)", borderTopColor: "#2B7EA1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const avatarLetter = userEmail ? userEmail[0].toUpperCase() : "A";
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumb = segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" › ");

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#1A2533", display: "flex", fontFamily: "var(--font-inter, Inter, sans-serif)" }}>

            <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 40 }} />
            )}

            {/* ── SIDEBAR ── */}
            <aside className="admin-sidebar" style={{
                position: "fixed", top: 0, width: "240px", height: "100vh",
                backgroundColor: "#172030",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                display: "flex", flexDirection: "column", zIndex: 50,
            }}>
                {/* Logo */}
                <div style={{ padding: "20px 18px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src="/images/hrp_logo.png" alt="HRP" style={{ height: "26px", width: "auto" }} onError={e => e.target.style.display = "none"} />
                    <span style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontWeight: 700, fontSize: "17px", color: "#ffffff", letterSpacing: "0.04em" }}>HRP</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin</span>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 8px", marginBottom: "8px" }}>
                        Navigation
                    </p>
                    {NAV.map(item => {
                        const isActive = item.href && (item.exact ? pathname === item.href : pathname.startsWith(item.href));
                        return item.href ? (
                            <Link key={item.label} href={item.href} onClick={() => setSidebarOpen(false)} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                padding: "9px 10px", borderRadius: "8px", marginBottom: "2px",
                                color: isActive ? "#ffffff" : "rgba(255,255,255,0.52)",
                                backgroundColor: isActive ? "rgba(43,126,161,0.2)" : "transparent",
                                borderLeft: isActive ? "2px solid #2B7EA1" : "2px solid transparent",
                                textDecoration: "none", fontSize: "13.5px",
                                fontWeight: isActive ? 600 : 400, transition: "all 0.15s",
                            }}>
                                {item.icon}
                                {item.label}
                            </Link>
                        ) : (
                            <div key={item.label} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                padding: "9px 10px", borderRadius: "8px", marginBottom: "2px",
                                color: "rgba(255,255,255,0.2)", fontSize: "13.5px",
                                cursor: "not-allowed", borderLeft: "2px solid transparent",
                            }}>
                                {item.icon}
                                {item.label}
                                <span style={{ marginLeft: "auto", fontSize: "9px", background: "rgba(141,198,63,0.1)", color: "#8DC63F", padding: "2px 7px", borderRadius: "20px", letterSpacing: "0.05em" }}>
                                    Soon
                                </span>
                            </div>
                        );
                    })}
                </nav>

                {/* User block — single unified card, no orphan avatar */}
                <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                            background: "linear-gradient(135deg, #2B7EA1 0%, #1a5975 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "13px", fontWeight: 700, color: "#fff",
                        }}>
                            {avatarLetter}
                        </div>
                        <div style={{ overflow: "hidden", flex: 1 }}>
                            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", marginBottom: "3px", letterSpacing: "0.04em" }}>Signed in as</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.82)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {userEmail}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleSignOut} style={{
                        width: "100%", padding: "8px 12px",
                        background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.16)",
                        borderRadius: "8px", color: "rgba(252,165,165,0.8)", fontSize: "13px",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "6px", fontFamily: "inherit",
                    }}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── MAIN AREA ── */}
            <div className="admin-main" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

                {/* Topbar — fixed spacing, no overlap */}
                <header style={{
                    height: "60px", backgroundColor: "rgba(23,32,48,0.98)",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center",
                    padding: "0 24px", gap: "10px",
                    position: "sticky", top: 0, zIndex: 30, backdropFilter: "blur(10px)",
                }}>
                    {/* Mobile hamburger */}
                    <button onClick={() => setSidebarOpen(true)} className="admin-hamburger" style={{
                        background: "none", border: "none", color: "rgba(255,255,255,0.55)",
                        cursor: "pointer", padding: "4px", display: "none", flexShrink: 0,
                    }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Breadcrumb */}
                    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {breadcrumb}
                    </p>

                    {/* Push right */}
                    <div style={{ flex: 1 }} />

                    {/* Search trigger */}
                    <button onClick={() => setSearchOpen(true)} style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "6px 12px", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
                        color: "rgba(255,255,255,0.38)", fontSize: "13px", cursor: "pointer",
                        fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                        </svg>
                        Search…
                        <kbd style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)", padding: "1px 5px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}>⌘K</kbd>
                    </button>

                    {/* View site — clearly separated */}
                    <a href="/" target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "6px 14px", border: "1px solid rgba(43,126,161,0.32)",
                        borderRadius: "8px", color: "#2B7EA1", fontSize: "13px",
                        textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        View Site
                    </a>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: "32px 28px" }}>{children}</main>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 769px) {
          .admin-sidebar { position: fixed !important; left: 0 !important; transform: none !important; }
          .admin-main { margin-left: 240px; }
          .admin-hamburger { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); transition: transform 0.25s ease; }
          .admin-hamburger { display: flex !important; }
          .admin-main { margin-left: 0; }
        }
      `}</style>
        </div>
    );
}