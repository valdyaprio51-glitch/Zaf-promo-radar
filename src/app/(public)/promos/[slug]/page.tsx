import React from "react";
import { PromoService } from "@/services/promo.service";
import { formatIDR, formatWIB } from "@/lib/utils";
import { PromoBadge } from "@/components/promo/PromoBadge";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Store,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Tag,
  Clock,
  ArrowLeft,
  Share2,
  TrendingDown,
  Info,
} from "lucide-react";
import { Metadata } from "next";

interface PromoDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PromoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const promo = await PromoService.getPromotionBySlug(slug);

  if (!promo) {
    return {
      title: "Promo Tidak Ditemukan — PromoRadar",
    };
  }

  return {
    title: `${promo.title} — PromoRadar`,
    description: `${promo.title} di ${promo.merchant?.name || "Merchant"}. Hemat dengan diskon hingga ${promo.discountPercentage || 0}%. Valid hingga ${formatWIB(promo.endAt)}.`,
    openGraph: {
      title: promo.title,
      description: promo.description,
      images: promo.imageUrl ? [{ url: promo.imageUrl }] : [],
    },
  };
}

export default async function PromoDetailPage({ params }: PromoDetailPageProps) {
  const { slug } = await params;
  let promo: any = null;

  try {
    promo = await PromoService.getPromotionBySlug(slug);
  } catch (err) {
    console.error("Error fetching promo detail:", err);
  }

  if (!promo) {
    notFound();
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/promos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Promo
        </Link>
      </div>

      {/* Main Detail Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Promo Image */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="relative aspect-square w-full bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promo.imageUrl || fallbackImage}
              alt={promo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <PromoBadge
                status={promo.displayStatus || promo.status}
                verificationStatus={promo.verificationStatus}
              />
              {promo.discountPercentage && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                  Hemat {promo.discountPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info & Price Box */}
        <div className="md:col-span-7 space-y-6">
          {/* Category & Merchant */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {promo.merchant && (
              <Link
                href={`/promos?merchant=${promo.merchant.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-semibold hover:bg-zinc-200 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                {promo.merchant.name}
              </Link>
            )}
            {promo.category && (
              <Link
                href={`/promos?category=${promo.category.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                {promo.category.name}
              </Link>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-snug">
            {promo.title}
          </h1>

          {/* Price Card */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Harga Promo Terverifikasi
            </span>
            <div className="flex items-baseline gap-3">
              {promo.promoPrice ? (
                <>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                    {formatIDR(promo.promoPrice)}
                  </span>
                  {promo.originalPrice && promo.originalPrice > promo.promoPrice && (
                    <span className="text-sm sm:text-base text-zinc-400 line-through">
                      {formatIDR(promo.originalPrice)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xl font-bold text-zinc-800">
                  Lihat Ketentuan Diskon
                </span>
              )}
            </div>
            {promo.originalPrice && promo.promoPrice && (
              <p className="text-xs text-emerald-700 flex items-center gap-1 pt-1 font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                Anda menghemat {formatIDR(promo.originalPrice - promo.promoPrice)} dari harga normal
              </p>
            )}
          </div>

          {/* Validity & Verification Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-zinc-600 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                Masa Berlaku
              </span>
              <p className="font-semibold text-zinc-800">
                {promo.startAt ? formatWIB(promo.startAt) : "Sekarang"} s/d{" "}
                {promo.endAt ? formatWIB(promo.endAt) : "Selama stok tersedia"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-zinc-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Terakhir Diverifikasi
              </span>
              <p className="font-semibold text-zinc-800">
                {promo.lastVerifiedAt
                  ? formatWIB(promo.lastVerifiedAt, true)
                  : "Baru ditambahkan"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {promo.sourceUrl ? (
              <a
                href={promo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-md shadow-emerald-600/20"
              >
                Lihat di Sumber Resmi
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-200 text-zinc-500 font-semibold text-sm cursor-not-allowed"
              >
                Sumber Tidak Tersedia
              </button>
            )}

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-sm transition-colors"
            >
              <Share2 className="w-4 h-4 text-zinc-500" />
              Bagikan
            </button>
          </div>
        </div>
      </div>

      {/* Syarat & Ketentuan Section */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-zinc-200 space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600" />
          Syarat & Ketentuan Promo
        </h2>
        <div className="prose prose-zinc text-xs sm:text-sm text-zinc-600 max-w-none space-y-3 leading-relaxed">
          <p>{promo.description}</p>
          {promo.termsText && (
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-700 font-medium">
              {promo.termsText}
            </div>
          )}
        </div>
      </div>

      {/* Price History Timeline */}
      {promo.priceHistory && promo.priceHistory.length > 0 && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-zinc-200 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Transparansi Riwayat Harga
          </h2>
          <div className="space-y-3">
            {promo.priceHistory.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between text-xs py-2 border-b border-zinc-100 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-800">
                    {formatIDR(item.promoPrice || item.originalPrice)}
                  </span>
                  <span className="text-zinc-600 text-[11px]">
                    Dicatat pada: {formatWIB(item.capturedAt, true)}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-600">
                  {item.sourceReference || "Official Partner"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
