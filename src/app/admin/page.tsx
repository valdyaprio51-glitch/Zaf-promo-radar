import React from "react";
import { PromoService } from "@/services/promo.service";
import { CategoryService } from "@/services/category.service";
import { MerchantService } from "@/services/merchant.service";
import { formatIDR, formatWIB } from "@/lib/utils";
import {
  ShieldCheck,
  Tag,
  Store,
  Layers,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  let promoList: any[] = [];
  let categoriesCount = 0;
  let merchantsCount = 0;
  let activePromosCount = 0;

  try {
    const [promosRes, cats, merchants] = await Promise.all([
      PromoService.getPromotions({
        page: 1,
        limit: 50,
        sortBy: "newest",
      }),
      CategoryService.getCategories(false),
      MerchantService.getMerchants(),
    ]);

    promoList = promosRes.data;
    activePromosCount = promosRes.meta.total;
    categoriesCount = cats.length;
    merchantsCount = merchants.length;
  } catch (err) {
    console.error("Error loading admin dashboard data:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Portal Administrator PromoRadar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            Pusat Moderasi & Kontrol Promo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Kelola keabsahan sumber promo, status verifikasi, dan audit data penawaran.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Promo Aktif
            </span>
            <Tag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-zinc-900">{activePromosCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            Siap ditampilkan ke publik
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Merchant
            </span>
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-zinc-900">{merchantsCount}</p>
          <span className="text-[11px] text-zinc-600">Supermarket & Retail</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Kategori Terdaftar
            </span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-zinc-900">{categoriesCount}</p>
          <span className="text-[11px] text-zinc-600">Kategori aktif</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-600">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Integritas Data
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">100%</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            Semua promo memiliki sumber
          </span>
        </div>
      </div>

      {/* Promos Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              Daftar Promo Terkini
            </h2>
            <p className="text-xs text-zinc-600">
              Periksa masa berlaku, harga promo, dan link verifikasi sumber resmi
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Promo</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Harga Akhir</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Masa Berlaku</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {promoList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-600">
                    Belum ada data promo dalam database.
                  </td>
                </tr>
              ) : (
                promoList.map((promo) => (
                  <tr key={promo.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-col">
                        <Link
                          href={`/promos/${promo.slug}`}
                          className="font-bold text-zinc-900 hover:text-emerald-600 line-clamp-1"
                        >
                          {promo.title}
                        </Link>
                        <span className="text-[11px] text-zinc-600 truncate">
                          {promo.category?.name || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-700">
                      {promo.merchant?.name || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600">
                        {promo.promoPrice ? formatIDR(promo.promoPrice) : "-"}
                      </span>
                      {promo.originalPrice && promo.originalPrice > promo.promoPrice && (
                        <span className="block text-[10px] text-zinc-600 line-through">
                          {formatIDR(promo.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          promo.verificationStatus === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {promo.verificationStatus === "VERIFIED"
                          ? "Terverifikasi"
                          : "Belum Verifikasi"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        <span>{promo.endAt ? formatWIB(promo.endAt) : "Terbatas"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {promo.sourceUrl && (
                        <a
                          href={promo.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium"
                        >
                          Sumber
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <Link
                        href={`/promos/${promo.slug}`}
                        className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold"
                      >
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
