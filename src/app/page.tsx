import React from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { CategoryPills } from "@/components/search/CategoryPills";
import { PromoGrid } from "@/components/promo/PromoGrid";
import { PromoService } from "@/services/promo.service";
import { CategoryService } from "@/services/category.service";
import { MerchantService } from "@/services/merchant.service";
import {
  Sparkles,
  ShieldCheck,
  Flame,
  Clock,
  Store,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Fallback data if DB connection is unavailable during development
const FALLBACK_CATEGORIES = [
  { id: "1", name: "Supermarket & Sembako", slug: "supermarket-sembako" },
  { id: "2", name: "Makanan & Minuman", slug: "makanan-minuman" },
  { id: "3", name: "Elektronik & Gadget", slug: "elektronik-gadget" },
  { id: "4", name: "Kesehatan & Kecantikan", slug: "kesehatan-kecantikan" },
  { id: "5", name: "Fashion & Gaya Hidup", slug: "fashion-lifestyle" },
];

const FALLBACK_MERCHANTS = [
  {
    id: "m1",
    name: "Super Indo",
    slug: "super-indo",
    logoUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "m2",
    name: "Indomaret",
    slug: "indomaret",
    logoUrl: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "m3",
    name: "Alfamart",
    slug: "alfamart",
    logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "m4",
    name: "Kopi Kenangan",
    slug: "kopi-kenangan",
    logoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "m5",
    name: "Watsons Indonesia",
    slug: "watsons",
    logoUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=128&auto=format&fit=crop&q=80",
  },
  {
    id: "m6",
    name: "Tokopedia",
    slug: "tokopedia",
    logoUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=128&auto=format&fit=crop&q=80",
  },
];

const FALLBACK_PROMOTIONS = [
  {
    id: "p1",
    title: "Minyak Goreng Sania Pouch 2 Liter Hemat Super Kepo",
    slug: "minyak-goreng-sania-2l-super-indo",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    originalPrice: 38900,
    promoPrice: 32500,
    discountPercentage: 16,
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    merchant: { name: "Super Indo", slug: "super-indo" },
    category: { name: "Supermarket & Sembako", slug: "supermarket-sembako" },
  },
  {
    id: "p2",
    title: "Beli 2 Kopi Kenangan Mantan Large Gratis 1 Roti Cokelat Klasik",
    slug: "promo-kopi-kenangan-mantan-gratis-roti",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
    originalPrice: 58000,
    promoPrice: 42000,
    discountPercentage: 28,
    status: "EXPIRING_SOON",
    verificationStatus: "VERIFIED",
    endAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    merchant: { name: "Kopi Kenangan", slug: "kopi-kenangan" },
    category: { name: "Makanan & Minuman", slug: "makanan-minuman" },
  },
  {
    id: "p3",
    title: "Susu UHT Ultra Milk 1000ml All Variant Promo JSM Gajian",
    slug: "susu-ultra-milk-1l-alfamart-jsm",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    originalPrice: 21500,
    promoPrice: 17500,
    discountPercentage: 19,
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    endAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    merchant: { name: "Alfamart", slug: "alfamart" },
    category: { name: "Supermarket & Sembako", slug: "supermarket-sembako" },
  },
  {
    id: "p4",
    title: "Skintific 5X Ceramide Barrier Moisture Gel 30g Diskon 35%",
    slug: "skintific-5x-ceramide-moisturizer-watsons",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    originalPrice: 169000,
    promoPrice: 109850,
    discountPercentage: 35,
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    merchant: { name: "Watsons Indonesia", slug: "watsons" },
    category: { name: "Kesehatan & Kecantikan", slug: "kesehatan-kecantikan" },
  },
];

export default async function HomePage() {
  let categories: Array<{ id: string; name: string; slug: string }> = FALLBACK_CATEGORIES;
  let merchants: Array<{ id: string; name: string; slug: string; logoUrl?: string | null }> = FALLBACK_MERCHANTS;
  let latestPromos: any[] = FALLBACK_PROMOTIONS;
  let endingSoonPromos: any[] = FALLBACK_PROMOTIONS.filter(
    (p) => p.status === "EXPIRING_SOON"
  );

  try {
    const [catRes, merchRes, promoRes, endingRes] = await Promise.all([
      CategoryService.getCategories(true),
      MerchantService.getMerchants("ACTIVE"),
      PromoService.getPromotions({
        status: "ACTIVE",
        sortBy: "newest",
        page: 1,
        limit: 8,
      }),
      PromoService.getPromotions({
        status: "ACTIVE",
        sortBy: "ending_soon",
        page: 1,
        limit: 4,
      }),
    ]);

    if (catRes && catRes.length > 0) categories = catRes;
    if (merchRes && merchRes.length > 0) merchants = merchRes;
    if (promoRes && promoRes.data && promoRes.data.length > 0) {
      latestPromos = promoRes.data as any;
    }
    if (endingRes && endingRes.data && endingRes.data.length > 0) {
      endingSoonPromos = endingRes.data as any;
    }
  } catch (err) {
    console.warn("Using fallback data for homepage due to DB connection:", err);
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs md:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Radar Promo & Diskon Belanja Terpercaya di Indonesia</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Temukan Promo Asli, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
              Bandingkan Harga Akhir
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Kumpulan promo katalog supermarket, kuliner, dan kebutuhan harian dengan validasi tanggal kedaluwarsa & sumber resmi. Tanpa hoax diskon palsu.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <SearchBar className="shadow-2xl shadow-emerald-950/50" />
          </div>

          {/* Quick Stats or Trust Indicators */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-emerald-200/80">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verifikasi Sumber Resmi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Deteksi Kedaluwarsa Otomatis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-300" />
              <span>Transparansi Riwayat Harga</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Category Pills Slider */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 flex items-center gap-2">
              <span>Pilih Kategori Kebutuhan</span>
            </h2>
            <Link
              href="/promos"
              className="text-xs md:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CategoryPills categories={categories} />
        </section>

        {/* Promo Terbaru (Fresh Curated Promos) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
                Promo Terbaru & Terverifikasi
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 mt-0.5">
                Penawaran pilihan langsung dari supermarket & retail resmi
              </p>
            </div>
            <Link
              href="/promos?sortBy=newest"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <PromoGrid promotions={latestPromos} />

          <div className="text-center sm:hidden pt-2">
            <Link
              href="/promos?sortBy=newest"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline"
            >
              Jelajahi semua promo terbaru →
            </Link>
          </div>
        </section>

        {/* Ending Soon Banner Section */}
        {endingSoonPromos.length > 0 && (
          <section className="space-y-4 bg-amber-50/60 p-6 sm:p-8 rounded-3xl border border-amber-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900 inline-block mb-1.5">
                  Jangan Lewatkan
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-zinc-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Promo Segera Berakhir
                </h2>
                <p className="text-xs md:text-sm text-zinc-600 mt-0.5">
                  Berakhir dalam 24-48 jam ke depan. Ambil kesempatan sebelum kuota atau periode habis!
                </p>
              </div>
              <Link
                href="/promos?sortBy=ending_soon"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber-800 hover:text-amber-900"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <PromoGrid promotions={endingSoonPromos} />
          </section>
        )}

        {/* Merchant Partners Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <Store className="w-6 h-6 text-emerald-600" />
                Merchant & Toko Populer
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 mt-0.5">
                Cari promo berdasarkan supermarket atau restoran langganan Anda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {merchants.map((merchant) => (
              <Link
                key={merchant.id}
                href={`/promos?merchant=${merchant.slug}`}
                className="group flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                  {merchant.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={merchant.logoUrl}
                      alt={merchant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-6 h-6 text-zinc-400" />
                  )}
                </div>
                <span className="font-semibold text-xs md:text-sm text-zinc-800 group-hover:text-emerald-600 line-clamp-1">
                  {merchant.name}
                </span>
                <span className="text-[11px] text-zinc-600 mt-0.5">
                  Lihat Promo →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Value Proposition & Security Rules Banner */}
        <section className="rounded-3xl bg-gradient-to-tr from-zinc-900 to-zinc-800 text-white p-8 sm:p-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Standar Integritas PromoRadar
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Belanja Lebih Cerdas Tanpa Terjebak Diskon Semu
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              PromoRadar selalu menampilkan harga akhir setelah diskon, syarat minimum transaksi, metode pembayaran yang berlaku, dan masa aktif resmi. Setiap promo dilengkapi tautan ke sumber asli untuk transparansi total.
            </p>
            <div className="pt-2">
              <Link
                href="/promos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-900/30"
              >
                Mulai Cari Promo Hari Ini
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
