"use client";

import React, { useState, useEffect } from "react";
import { PromoGrid } from "@/components/promo/PromoGrid";
import { PromoCardProps } from "@/components/promo/PromoCard";
import Link from "next/link";
import { Heart, Compass } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<PromoCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read favorites from localStorage (guest & user fallback)
    try {
      const stored = localStorage.getItem("promoradar_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error loading favorites from storage:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            Promo Pilihan Saya
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            Daftar Promo Favorit
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Simpan promo incaran Anda dan pantau tanggal kedaluwarsanya agar tidak terlewat
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin menghapus semua promo favorit?")) {
                localStorage.removeItem("promoradar_favorites");
                setFavorites([]);
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:underline self-start sm:self-auto"
          >
            Hapus Semua Favorit
          </button>
        )}
      </div>

      {/* Grid or Empty */}
      {favorites.length === 0 && !isLoading ? (
        <div className="py-20 px-4 text-center bg-white rounded-3xl border border-dashed border-zinc-300 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-zinc-900 text-base">
              Belum Ada Promo yang Disimpan
            </h3>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto">
              Saat menemukan promo menarik, tekan tombol simpan agar mudah ditemukan kembali di halaman ini.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/promos"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-colors"
            >
              <Compass className="w-4 h-4" />
              Mulai Jelajah Promo
            </Link>
          </div>
        </div>
      ) : (
        <PromoGrid
          promotions={favorites}
          isLoading={isLoading}
          emptyMessage="Belum ada promo favorit yang disimpan."
        />
      )}
    </div>
  );
}

