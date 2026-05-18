"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const isAbout = pathname === "/about";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const isActive = (href) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${(scrolled && !isAbout) || menuOpen ? "navbar-glass" : "bg-transparent"
                    }`}
            >
                <div className="container-hrp">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white">
                                <img src="/images/hrp_logo.png" alt="HRP Logo" className="w-12 h-12" />
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
                            {NAV_LINKS.map(({ label, href }) => (
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
                            ))}
                        </nav>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="lg:hidden p-2 text-white rounded-md hover:bg-white/10 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
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
                        className="fixed inset-0 z-40 navbar-glass pt-16 lg:hidden flex flex-col"
                    >
                        <nav className="container-hrp flex flex-col gap-1 pt-6">
                            {NAV_LINKS.map(({ label, href }, i) => (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.25 }}
                                >
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
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}