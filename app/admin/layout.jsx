"use client";
// ─── app/admin/layout.jsx ────────────────────────────────────────────────────
// Auth-guarded admin shell. Checks Supabase session on mount.
// If no session → redirect to /admin/login.
// Renders sidebar + top bar + page content when authenticated.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const NAV = [
    {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        href: "/admin/dashboard/categories",
        label: "Categories",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
        ),
    },
    {
        href: "/admin/dashboard/product",
        label: "Products",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
            </svg>
        ),
    },
    {
        href: "/admin/dashboard/inquiries",
        label: "Inquiries",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        badge: "inquiries", // special: shows count of new inquiries
    },
    {
        href: "/admin/dashboard/notice",
        label: "Site Notice",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        ),
    },
];

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const [authChecked, setAuthChecked] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [newInquiries, setNewInquiries] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [signingOut, setSigningOut] = useState(false);

    // Auth check on mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.replace("/admin/login"); return; }
            setUserEmail(session.user.email || "");
            setAuthChecked(true);
        });

        // Listen for sign-out events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") router.replace("/admin/login");
        });
        return () => subscription.unsubscribe();
    }, [router]);

    // Fetch new inquiry count
    useEffect(() => {
        if (!authChecked) return;
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new")
            .then(({ count }) => setNewInquiries(count || 0));
    }, [authChecked, pathname]);

    async function handleSignOut() {
        setSigningOut(true);
        await supabase.auth.signOut();
    }

    // Skip layout on login page
    if (pathname === "/admin/login") return <>{children}</>;

    // Loading / auth check
    if (!authChecked) {
        return (
            <div style={{ minHeight: "100vh", background: "#0E1520", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2.5px solid #2B7EA1", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

    const initials = userEmail ? userEmail[0].toUpperCase() : "A";

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0E1520", fontFamily: "'Inter',sans-serif" }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: sidebarOpen ? 224 : 64, flexShrink: 0,
                background: "rgba(255,255,255,0.025)", borderRight: "1px solid rgba(255,255,255,0.07)",
                display: "flex", flexDirection: "column", transition: "width 0.22s ease",
                overflow: "hidden",
            }}>
                {/* Logo */}
                <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 9, background: "rgb(255, 255, 255)", border: "1px solid rgba(43,126,161,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        <img
                            src="/images/hrp_logo.png"
                            alt="HRP Logo"
                            style={{ width: 48, height: 48, objectFit: "contain" }}
                        />
                    </div>
                    {sidebarOpen && (
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "var(--font-syne,Syne,sans-serif)", whiteSpace: "nowrap" }}>HRP Admin</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>Industrial Products</div>
                        </div>
                    )}
                </div>

                {/* Nav links */}
                <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                    {NAV.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: sidebarOpen ? "9px 12px" : "9px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
                                    borderRadius: 9, transition: "background 0.15s, color 0.15s",
                                    background: isActive ? "rgba(43,126,161,0.18)" : "transparent",
                                    color: isActive ? "#2B7EA1" : "rgba(255,255,255,0.45)",
                                    border: isActive ? "1px solid rgba(43,126,161,0.22)" : "1px solid transparent",
                                    position: "relative",
                                }}
                                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; } }}
                                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
                                >
                                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                    {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
                                    {/* Badge for new inquiries */}
                                    {item.badge === "inquiries" && newInquiries > 0 && (
                                        <span style={{
                                            position: sidebarOpen ? "static" : "absolute", top: sidebarOpen ? undefined : 4, right: sidebarOpen ? undefined : 4,
                                            marginLeft: sidebarOpen ? "auto" : 0, background: "#E5A020", color: "#fff",
                                            fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 20, lineHeight: 1.6,
                                        }}>
                                            {newInquiries}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: view site + sign out */}
                <div style={{ padding: "10px 10px 18px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 4 }}>
                    <a href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: sidebarOpen ? "8px 12px" : "8px 0", justifyContent: sidebarOpen ? "flex-start" : "center", borderRadius: 9, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {sidebarOpen && <span style={{ fontSize: 12 }}>View Site</span>}
                        </div>
                    </a>

                    {/* User row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: sidebarOpen ? "8px 12px" : "8px 0", justifyContent: sidebarOpen ? "flex-start" : "center", borderRadius: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(43,126,161,0.2)", border: "1px solid rgba(43,126,161,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#2B7EA1", flexShrink: 0 }}>
                            {initials}
                        </div>
                        {sidebarOpen && (
                            <>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>
                                </div>
                                <button onClick={handleSignOut} disabled={signingOut}
                                    title="Sign out"
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", padding: 2, flexShrink: 0 }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FCA5A5")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                {/* Top bar */}
                <header style={{
                    height: 56, background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", padding: "0 28px", gap: 14, flexShrink: 0,
                }}>
                    {/* Collapse toggle */}
                    <button onClick={() => setSidebarOpen((p) => !p)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: 4 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Breadcrumb */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                        <span>Admin</span>
                        {pathname !== "/admin/dashboard" && (
                            <>
                                <span style={{ opacity: 0.4 }}>/</span>
                                <span style={{ color: "rgba(255,255,255,0.65)", textTransform: "capitalize" }}>
                                    {pathname.split("/").pop()}
                                </span>
                            </>
                        )}
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* New inquiry badge */}
                    {newInquiries > 0 && (
                        <Link href="/admin/dashboard/inquiries" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(229,160,32,0.1)", border: "1px solid rgba(229,160,32,0.2)", borderRadius: 20, padding: "5px 12px", cursor: "pointer" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E5A020" }} />
                                <span style={{ fontSize: 12, color: "#E5A020", fontWeight: 600 }}>{newInquiries} new {newInquiries === 1 ? "inquiry" : "inquiries"}</span>
                            </div>
                        </Link>
                    )}
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: "0", overflowY: "auto" }}>
                    <div style={{ padding: "28px" }}>
                        {children}
                    </div>
                </main>
            </div>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}
