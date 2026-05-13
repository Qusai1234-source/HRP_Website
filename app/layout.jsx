import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import WhatsAppFAB from "@/app/components/layout/WhatsAppFAB";
import IntroWrapper from '@/app/components/IntroWrapper';

export const metadata = {
  title: {
    default: "HRP — Industrial Products",
    template: "%s | HRP",
  },
  description:
    "HRP supplies SS Bellows, Hydraulic Hoses, Pneumatic Hoses, Pressure Gauges, Valves, and Fittings for industrial applications.",
  keywords: [
    "SS Bellows", "Hydraulic Hoses", "Pneumatic Hoses",
    "Pressure Gauges", "Valves", "Fittings", "Industrial Products", "HRP",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <IntroWrapper />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFAB />
      </body>
    </html>
  );
}