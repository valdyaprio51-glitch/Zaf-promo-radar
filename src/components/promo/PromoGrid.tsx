import React from "react";
import { PromoCard, PromoCardProps } from "./PromoCard";
import { Tag } from "lucide-react";

interface PromoGridProps {
  promotions: PromoCardProps[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function PromoGrid({
  promotions,
  isLoading = false,
  emptyMessage = "Belum ada promo yang sesuai dengan pencarian Anda.",
}: PromoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 bg-white overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/10] bg-zinc-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-200 rounded w-1/3" />
              <div className="h-5 bg-zinc-200 rounded w-full" />
              <div className="h-5 bg-zinc-200 rounded w-2/3" />
              <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
                <div className="h-6 bg-zinc-200 rounded w-1/2" />
                <div className="h-4 bg-zinc-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="py-16 px-4 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
          <Tag className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-zinc-800">Tidak ada promo ditemukan</h4>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {promotions.map((promo) => (
        <PromoCard key={promo.id} {...promo} />
      ))}
    </div>
  );
}

