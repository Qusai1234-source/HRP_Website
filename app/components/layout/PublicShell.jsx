"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import WhatsAppFAB from "@/app/components/layout/WhatsAppFAB";

export default function PublicShell({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <>
            {!isAdmin && <Navbar />}
            <main className="flex-1">{children}</main>
            {!isAdmin && <Footer />}
            {!isAdmin && <WhatsAppFAB />}
        </>
    );
}