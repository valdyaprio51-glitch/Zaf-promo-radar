import React from "react";
import Link from "next/link";
import { formatIDR, formatWIB } from "@/lib/utils";
import { PromoBadge } from "./PromoBadge";
import { Calendar, Store, ArrowUpRight } from "lucide-react";

export interface PromoCardProps {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  originalPrice?: number | null;
  promoPrice?: number | null;
  discountPercentage?: number | null;
  startAt?: Date | string | null;
  endAt?: Date | string | null;
  status: string;
  verificationStatus: string;
  merchant?: {
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
  category?: {
    name: string;
    slug: string;
  };
}

export function PromoCard({
  title,
  slug,
  imageUrl,
  originalPrice,
  promoPrice,
  discountPercentage,
  endAt,
  status,
  verificationStatus,
  merchant,
  category,
}: PromoCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || fallbackImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          <PromoBadge status={status} verificationStatus={verificationStatus} />
          {discountPercentage && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm">
              Hemat {discountPercentage}%
            </span>
          )}
        </div>

        {/* Category Pill */}
        {category && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-black/60 backdrop-blur-sm text-white">
              {category.name}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Merchant Info */}
        {merchant && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-1.5">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-zinc-800 truncate">
              {merchant.name}
            </span>
          </div>
        )}

        {/* Title */}
        <Link href={`/promos/${slug}`} className="focus:outline-none">
          <h3 className="font-semibold text-zinc-900 text-sm md:text-base line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <div className="flex items-baseline gap-2">
            {promoPrice ? (
              <>
                <span className="text-lg md:text-xl font-extrabold text-emerald-600">
                  {formatIDR(promoPrice)}
                </span>
                {originalPrice && originalPrice > promoPrice && (
                  <span className="text-xs text-zinc-600 line-through">
                    {formatIDR(originalPrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-semibold text-zinc-700">
                Lihat Syarat Promo
              </span>
            )}
          </div>
        </div>

        {/* Expiry Date & Action */}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-zinc-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
            <span>
              {endAt ? `Hingga ${formatWIB(endAt)}` : "Periode terbatas"}
            </span>
          </div>

          <Link
            href={`/promos/${slug}`}
            className="inline-flex items-center gap-0.5 text-emerald-600 font-medium hover:underline"
          >
            Detail
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

