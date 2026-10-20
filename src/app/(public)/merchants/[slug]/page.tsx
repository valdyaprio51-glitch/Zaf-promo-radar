import React from "react";
import { MerchantService } from "@/services/merchant.service";
import { PromoService } from "@/services/promo.service";
import { PromoGrid } from "@/components/promo/PromoGrid";
import { SearchBar } from "@/components/search/SearchBar";
import Link from "next/link";
import { ArrowLeft, Store, ExternalLink } from "lucide-react";
import { Metadata } from "next";

interface MerchantDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MerchantDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const merchant = await MerchantService.getMerchantBySlug(slug);

  if (!merchant) {
    return {
      title: "Merchant Promo — PromoRadar",
    };
  }

  return {
    title: `Katalog Promo ${merchant.name} Terbaru & Terverifikasi — PromoRadar`,
    description: `Kumpulan promo hemat, diskon mingguan, dan katalog penawaran resmi dari ${merchant.name} di seluruh Indonesia.`,
  };
}

export default async function MerchantDetailPage({
  params,
}: MerchantDetailPageProps) {
  const { slug } = await params;
  let merchant: any = null;
  let promotions: any[] = [];

  try {
    const [m, promoRes] = await Promise.all([
      MerchantService.getMerchantBySlug(slug),
      PromoService.getPromotions({
        merchant: slug,
        status: "ACTIVE",
        sortBy: "newest",
        page: 1,
        limit: 20,
      }),
    ]);

    merchant = m;
    promotions = promoRes.data;
  } catch (err) {
    console.error("Error loading merchant promos:", err);
  }

  if (!merchant) {
    merchant = {
      name: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug,
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/merchants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Semua Merchant & Toko
        </Link>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200">
            {merchant.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={merchant.logoUrl}
                alt={merchant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store className="w-8 h-8 text-zinc-400" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1">
              <Store className="w-3.5 h-3.5" />
              Merchant Terverifikasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">
              {merchant.name}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Katalog promo dan penawaran hemat resmi
            </p>
          </div>
        </div>

        {merchant.websiteUrl && (
          <a
            href={merchant.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
          >
            Situs Resmi Toko
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-xl">
        <SearchBar placeholder={`Cari promo di ${merchant.name}...`} />
      </div>

      {/* Promo Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900">
          Promo Aktif dari {merchant.name}
        </h2>
        <PromoGrid
          promotions={promotions}
          emptyMessage={`Saat ini belum ada promo aktif terdaftar dari ${merchant.name}.`}
        />
      </div>
    </div>
  );
}

