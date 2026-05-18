import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { getWhatsAppUrl } from "@/app/lib/utils";

// TODO: Replace with real client data before launch
const CONTACT = {
    phone: "+91 9014538495",
    email: "info@hrpvizag.com",
    address: "Your City, State — India",
};

const PRODUCT_CATEGORIES = [
    "SS Bellows",
    "Hydraulic Hoses",
    "Pneumatic Hoses",
    "Pressure Gauges",
    "Valves",
    "Fittings",
];

const QUICK_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
];

function FooterHeading({ children }) {
    return (
        <h3 className="font-heading font-bold text-white text-sm tracking-widest uppercase mb-5">
            {children}
        </h3>
    );
}

function FooterLink({ href, children }) {
    return (
        <Link
            href={href}
            className="font-body text-white/50 hover:text-brand-accent text-sm transition-colors duration-200"
        >
            {children}
        </Link>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-dark border-t border-white/5">
            <div className="container-hrp py-14 lg:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* Col 1 — Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white">
                                <img src="/images/hrp_logo.png"></img>
                            </div>
                            <span className="font-heading font-bold text-white text-lg">Hydraulic &Rubber Products</span>
                        </div>
                        <p className="font-body text-white/45 text-sm leading-relaxed max-w-[240px]">
                            Supplying high-quality industrial products — SS Bellows, Hoses, Gauges, Valves and Fittings.
                        </p>
                        <a
                            href={getWhatsAppUrl("Hello HRP! I would like to make an enquiry.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-5 text-brand-accent hover:text-white font-body font-medium text-sm transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.099 1.508 5.814L.057 23.887c-.05.195.063.393.248.456.04.013.083.019.125.019a.37.37 0 0 0 .259-.104l5.767-3.505A11.949 11.949 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.55 9.55 0 0 1-4.993-1.404l-.357-.213-3.705 2.253 1.077-3.936-.233-.372A9.557 9.557 0 0 1 2.4 12C2.4 6.698 6.698 2.4 12 2.4S21.6 6.698 21.6 12 17.302 21.6 12 21.6z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <FooterHeading>Quick Links</FooterHeading>
                        <ul className="space-y-3">
                            {QUICK_LINKS.map(({ label, href }) => (
                                <li key={href}>
                                    <FooterLink href={href}>{label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Products */}
                    <div>
                        <FooterHeading>Products</FooterHeading>
                        <ul className="space-y-3">
                            {PRODUCT_CATEGORIES.map((cat) => (
                                <li key={cat}>
                                    <FooterLink href={`/products?category=${encodeURIComponent(cat)}`}>
                                        {cat}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Contact */}
                    <div>
                        <FooterHeading>Contact</FooterHeading>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                                <a href={`tel:${CONTACT.phone}`} className="font-body text-white/50 hover:text-brand-accent text-sm transition-colors duration-200">
                                    {CONTACT.phone}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                                <a href={`mailto:${CONTACT.email}`} className="font-body text-white/50 hover:text-brand-accent text-sm transition-colors duration-200 break-all">
                                    {CONTACT.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
                                <span className="font-body text-white/50 text-sm leading-relaxed">
                                    {CONTACT.address}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 pb-12">
                <div className="container-hrp py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="font-body text-white/25 text-xs">
                        © {currentYear} HRP. All rights reserved.
                    </p>
                    <p className="font-body text-white/20 text-xs">
                        Industrial Products · Quality You Can Trust
                    </p>
                </div>
            </div>
        </footer>
    );
}