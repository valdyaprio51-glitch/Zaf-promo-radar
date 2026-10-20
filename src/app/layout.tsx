import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PromoRadar — Smart Promo Discovery Platform Indonesia",
  description:
    "Cari dan bandingkan promo diskon belanja terverifikasi dari supermarket, restoran, minimarket, dan marketplace di Indonesia. Hemat lebih banyak setiap hari.",
  keywords: [
    "promo supermarket",
    "diskon gajian",
    "promo jsm",
    "katalog promo indomaret",
    "katalog promo alfamart",
    "promo hemat minyak goreng",
    "voucher diskon indonesia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
      </body>
    </html>
  );
}
