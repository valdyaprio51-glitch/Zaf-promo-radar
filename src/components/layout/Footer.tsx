import React from "react";
import Link from "next/link";
import { Radar, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-400 text-sm mt-20 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Radar className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">
                Promo<span className="text-emerald-500">Radar</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Platform kurasi promo terverifikasi di Indonesia. Membantu masyarakat menemukan penawaran terbaik dan harga akhir transparan dari supermarket, restoran, toko ritel, dan e-commerce.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Promo Terverifikasi dari Sumber Resmi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-white text-xs tracking-wider uppercase mb-3">
              Kategori Populer
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/promos?category=supermarket-sembako" className="hover:text-white transition-colors">
                  Supermarket & Sembako
                </Link>
              </li>
              <li>
                <Link href="/promos?category=makanan-minuman" className="hover:text-white transition-colors">
                  Makanan & Minuman
                </Link>
              </li>
              <li>
                <Link href="/promos?category=elektronik-gadget" className="hover:text-white transition-colors">
                  Elektronik & Gadget
                </Link>
              </li>
              <li>
                <Link href="/promos?category=kesehatan-kecantikan" className="hover:text-white transition-colors">
                  Kesehatan & Skincare
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h5 className="font-semibold text-white text-xs tracking-wider uppercase mb-3">
              Informasi
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Portal Admin
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">Syarat & Ketentuan Penggunaan</span>
              </li>
              <li>
                <span className="text-zinc-500">Kebijakan Privasi</span>
              </li>
              <li>
                <span className="text-zinc-500">Kemitraan Merchant (Phase 2)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 PromoRadar Indonesia. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1 text-zinc-500">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk belanja hemat Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
