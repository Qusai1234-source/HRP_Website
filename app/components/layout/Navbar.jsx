"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/app/lib/supabase";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products", hasDropdown: true },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [catsLoading, setCatsLoading] = useState(true);

    const pathname = usePathname();
    const isAbout = pathname === "/about";

    const productsRef = useRef(null);
    const closeTimer = useRef(null);

    // Scroll listener
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMenuOpen(false);
        setProductsOpen(false);
        setMobileProductsOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Fetch categories
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data, error } = await supabase
                    .from("categories")
                    .select("id, name, slug")
                    .order("sort_order", { ascending: true });
                if (error) throw error;
                if (!cancelled) setCategories(data || []);
            } catch (err) {
                console.warn("[Navbar] Could not fetch categories:", err?.message);
                if (!cancelled) setCategories([]);
            } finally {
                if (!cancelled) setCatsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Outside-click + Escape close for the dropdown
    useEffect(() => {
        if (!productsOpen) return;
        const onClick = (e) => {
            if (productsRef.current && !productsRef.current.contains(e.target)) {
                setProductsOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === "Escape") setProductsOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [productsOpen]);

    const isActive = (href) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const activeCategorySlug = (() => {
        if (pathname.startsWith("/products/")) {
            const segs = pathname.split("/").filter(Boolean);
            return segs[1] || null;
        }
        return null;
    })();

    // Hover handlers with small grace period to prevent flicker
    const handleProductsEnter = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setProductsOpen(true);
    };
    const handleProductsLeave = () => {
        closeTimer.current = setTimeout(() => setProductsOpen(false), 120);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${(scrolled && !isAbout) || menuOpen ? "navbar-glass" : "bg-transparent"
                    }`}
            >
                <div className="container-hrp">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-white overflow-hidden">
                                <img
                                    src="/images/hrp_logo.png"
                                    alt="HRP Logo"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <p className="font-heading font-bold text-white text-lg leading-none">
                                    Hydraulics & Rubber Products
                                </p>
                                <p className="font-body text-white/40 text-[10px] tracking-widest uppercase leading-none mt-0.5">
                                    Industrial Products
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map(({ label, href, hasDropdown }) => {
                                if (hasDropdown) {
                                    return (
                                        <div
                                            key={href}
                                            ref={productsRef}
                                            className="relative"
                                            onMouseEnter={handleProductsEnter}
                                            onMouseLeave={handleProductsLeave}
                                        >
                                            <Link
                                                href={href}
                                                className={`relative inline-flex items-center gap-1 px-4 py-2 font-body text-sm font-medium rounded-md transition-colors duration-200 ${isActive(href)
                                                    ? "text-brand-accent"
                                                    : "text-white/70 hover:text-white"
                                                    }`}
                                                aria-haspopup="true"
                                                aria-expanded={productsOpen}
                                            >
                                                {label}
                                                <ChevronDown
                                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                                {isActive(href) && (
                                                    <motion.span
                                                        layoutId="nav-indicator"
                                                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-accent rounded-full"
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </Link>

                                            <AnimatePresence>
                                                {productsOpen && (
                                                    <motion.div
                                                        key="products-dropdown"
                                                        initial={{ opacity: 0, y: -8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -8 }}
                                                        transition={{
                                                            duration: productsOpen ? 0.2 : 0.15,
                                                            ease: productsOpen ? "easeOut" : "easeIn",
                                                        }}
                                                        className="absolute left-0 top-full pt-2 min-w-[200px] max-w-[280px]"
                                                    >
                                                        <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden py-1.5">
                                                            {catsLoading ? (
                                                                <DropdownShimmer />
                                                            ) : categories.length === 0 ? (
                                                                <div className="px-4 py-3 text-sm text-brand-secondary/60 font-body">
                                                                    No categories yet
                                                                </div>
                                                            ) : (
                                                                categories.map((cat) => {
                                                                    const active = activeCategorySlug === cat.slug;
                                                                    return (
                                                                        <Link
                                                                            key={cat.id}
                                                                            href={`/products/${cat.slug}`}
                                                                            className={`group flex items-center justify-between px-4 py-2.5 text-sm font-body transition-colors duration-150 ${active
                                                                                ? "bg-brand-primary/[0.08] text-brand-primary font-semibold"
                                                                                : "text-brand-secondary hover:bg-brand-primary/[0.08] hover:text-brand-primary"
                                                                                }`}
                                                                        >
                                                                            <span className="truncate">{cat.name}</span>
                                                                            <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                                                                        </Link>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`relative px-4 py-2 font-body text-sm font-medium rounded-md transition-colors duration-200 ${isActive(href)
                                            ? "text-brand-accent"
                                            : "text-white/70 hover:text-white"
                                            }`}
                                    >
                                        {label}
                                        {isActive(href) && (
                                            <motion.span
                                                layoutId="nav-indicator"
                                                className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-accent rounded-full"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right cluster: Admin pill (desktop) + mobile hamburger */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin"
                                className="hidden lg:inline-flex items-center gap-1.5 border border-brand-primary text-brand-primary font-body text-xs font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors duration-200"
                            >
                                <Lock size={14} />
                                Admin
                            </Link>

                            <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="lg:hidden p-2 text-white rounded-md hover:bg-white/10 transition-colors"
                                aria-label="Toggle menu"
                                aria-expanded={menuOpen}
                            >
                                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed inset-0 z-40 navbar-glass pt-16 lg:hidden flex flex-col overflow-y-auto"
                    >
                        <nav className="container-hrp flex flex-col gap-1 pt-6 pb-8">
                            {NAV_LINKS.map(({ label, href, hasDropdown }, i) => (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.25 }}
                                >
                                    {hasDropdown ? (
                                        <div className="border-b border-white/5">
                                            <div className="flex items-stretch">
                                                <Link
                                                    href={href}
                                                    className={`flex-1 flex items-center px-4 py-4 rounded-xl font-heading font-semibold text-lg ${isActive(href)
                                                        ? "text-brand-accent"
                                                        : "text-white/80 hover:text-white"
                                                        }`}
                                                >
                                                    {label}
                                                </Link>
                                                <button
                                                    onClick={() => setMobileProductsOpen((p) => !p)}
                                                    aria-label="Toggle product categories"
                                                    aria-expanded={mobileProductsOpen}
                                                    className="px-4 text-white/60 hover:text-white"
                                                >
                                                    <ChevronDown
                                                        className={`w-5 h-5 transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <AnimatePresence initial={false}>
                                                {mobileProductsOpen && (
                                                    <motion.ul
                                                        key="mobile-prod-acc"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.22, ease: "easeOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pl-4 pr-2 pb-3 flex flex-col gap-0.5">
                                                            {catsLoading ? (
                                                                <DropdownShimmer dark />
                                                            ) : categories.length === 0 ? (
                                                                <span className="px-3 py-2 text-white/40 text-sm font-body">
                                                                    No categories yet
                                                                </span>
                                                            ) : (
                                                                categories.map((cat) => {
                                                                    const active = activeCategorySlug === cat.slug;
                                                                    return (
                                                                        <Link
                                                                            key={cat.id}
                                                                            href={`/products/${cat.slug}`}
                                                                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${active
                                                                                ? "bg-brand-primary/15 text-brand-accent"
                                                                                : "text-white/70 hover:bg-white/5 hover:text-white"
                                                                                }`}
                                                                        >
                                                                            <span className="truncate">{cat.name}</span>
                                                                            <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0 ml-2" />
                                                                        </Link>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            href={href}
                                            className={`flex items-center justify-between px-4 py-4 rounded-xl font-heading font-semibold text-lg border-b border-white/5 ${isActive(href)
                                                ? "text-brand-accent"
                                                : "text-white/80 hover:text-white"
                                                }`}
                                        >
                                            {label}
                                            <ChevronRight className="w-4 h-4 opacity-40" />
                                        </Link>
                                    )}
                                </motion.div>
                            ))}

                            {/* Admin entry — mobile */}
                            <motion.div
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.07, duration: 0.25 }}
                                className="mt-4"
                            >
                                <Link
                                    href="/admin"
                                    className={`flex items-center justify-between px-4 py-4 rounded-xl font-heading font-semibold text-lg border-b border-white/5 ${pathname.startsWith("/admin")
                                        ? "text-brand-accent"
                                        : "text-white/80 hover:text-white"
                                        }`}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Lock size={16} />
                                        Admin
                                    </span>
                                    <ChevronRight className="w-4 h-4 opacity-40" />
                                </Link>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ── Shimmer rows for the dropdown loading state ── */
function DropdownShimmer({ dark = false }) {
    const base = dark ? "bg-white/10" : "bg-gray-200";
    return (
        <div className="flex flex-col gap-1.5 px-3 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className={`h-4 ${base} rounded animate-pulse`}
                    style={{ width: `${60 + ((i * 13) % 35)}%` }}
                />
            ))}
        </div>
    );
}
