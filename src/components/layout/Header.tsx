import React from "react";
import Link from "next/link";
import { Radar, Compass, Store, Grid, Shield } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-zinc-900 group-hover:text-emerald-600 transition-colors">
              Promo<span className="text-emerald-600">Radar</span>
            </span>
            <span className="text-[10px] text-zinc-600 font-medium tracking-wide -mt-1 hidden sm:inline">
              Smart Promo Discovery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-zinc-600">
          <Link
            href="/promos"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 transition-colors"
          >
            <Compass className="w-4 h-4" />
            Jelajah Promo
          </Link>
          <Link
            href="/promos?category=supermarket-sembako"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 transition-colors"
          >
            <Grid className="w-4 h-4" />
            Kategori
          </Link>
          <Link
            href="/promos?sortBy=ending_soon"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-amber-600 hover:bg-amber-50/60 transition-colors"
          >
            <Store className="w-4 h-4" />
            Segera Berakhir
          </Link>
        </nav>

        {/* Actions / Admin & Auth */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-600" />
            Portal Admin
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}

