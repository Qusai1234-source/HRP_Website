"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppUrl } from "@/app/lib/utils";

export default function WhatsAppFAB() {
    const [visible, setVisible] = useState(false);
    const [tooltip, setTooltip] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.85);
        };
        checkScroll();
        window.addEventListener('scroll', checkScroll, { passive: true });
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="whatsapp-fab"
                    initial={{ opacity: 0, scale: 0.6, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 16 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="fixed bottom-8 right-5 z-50 flex flex-col items-end gap-2"
                >
                    {/* Tooltip */}
                    <AnimatePresence>
                        {tooltip && (
                            <motion.div
                                key="tooltip"
                                initial={{ opacity: 0, x: 8, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="relative bg-brand-dark border border-white/10 text-white font-body text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap"
                            >
                                Chat with us on WhatsApp
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Button */}
                    <a
                        href={getWhatsAppUrl("Hello HRP! I would like to make an enquiry.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setTooltip(true)}
                        onMouseLeave={() => setTooltip(false)}
                        aria-label="Chat with HRP on WhatsApp"
                        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl animate-pulse-ring"
                        style={{ backgroundColor: "#25D366" }}
                    >
                        <svg
                            className="w-7 h-7 text-white relative z-10"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.099 1.508 5.814L.057 23.887c-.05.195.063.393.248.456.04.013.083.019.125.019a.37.37 0 0 0 .259-.104l5.767-3.505A11.949 11.949 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.55 9.55 0 0 1-4.993-1.404l-.357-.213-3.705 2.253 1.077-3.936-.233-.372A9.557 9.557 0 0 1 2.4 12C2.4 6.698 6.698 2.4 12 2.4S21.6 6.698 21.6 12 17.302 21.6 12 21.6z" />
                        </svg>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}