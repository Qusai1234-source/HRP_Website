import "./globals.css";
import IntroWrapper from "@/app/components/IntroWrapper";
import PublicShell from "@/app/components/layout/PublicShell";

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
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}