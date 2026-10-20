import React from "react";
import { MerchantService } from "@/services/merchant.service";
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Merchant & Toko Resmi — PromoRadar",
  description: "Daftar merchant, supermarket, minimarket, dan restoran resmi mitra PromoRadar.",
};

export default async function MerchantsPage() {
  let merchants: any[] = [];
  try {
    merchants = await MerchantService.getMerchants("ACTIVE");
  } catch (err) {
    console.error("Error fetching merchants:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
          Merchant & Toko Resmi
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1">
          Katalog promo terverifikasi dari supermarket dan toko ritel terpercaya di Indonesia
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {merchants.map((merchant) => (
          <Link
            key={merchant.id}
            href={`/promos?merchant=${merchant.slug}`}
            className="group p-5 bg-white rounded-3xl border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              {merchant.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={merchant.logoUrl}
                  alt={merchant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-7 h-7 text-zinc-400" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 text-sm line-clamp-1 transition-colors">
                {merchant.name}
              </h3>
              <p className="text-[11px] text-zinc-600">
                {merchant._count?.promotions ? `${merchant._count.promotions} Promo` : "Lihat Promo"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 pt-1">
              Katalog
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
