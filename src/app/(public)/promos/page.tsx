import React from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { PromoGrid } from "@/components/promo/PromoGrid";
import { PromoService } from "@/services/promo.service";
import { CategoryService } from "@/services/category.service";
import { MerchantService } from "@/services/merchant.service";
import Link from "next/link";
import { Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface PromosPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    merchant?: string;
    status?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function PromosPage({ searchParams }: PromosPageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "";
  const merchant = params.merchant || "";
  const status = (params.status as any) || "ACTIVE";
  const sortBy = (params.sortBy as any) || "newest";
  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = 12;

  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let merchants: Array<{ id: string; name: string; slug: string }> = [];
  let promoData: any[] = [];
  let totalCount = 0;
  let totalPages = 1;

  try {
    const [catList, merchList, promoRes] = await Promise.all([
      CategoryService.getCategories(true),
      MerchantService.getMerchants("ACTIVE"),
      PromoService.getPromotions({
        q,
        category: category || undefined,
        merchant: merchant || undefined,
        status: status === "ALL" ? undefined : status,
        sortBy,
        page,
        limit,
      }),
    ]);

    categories = catList;
    merchants = merchList;
    promoData = promoRes.data;
    totalCount = promoRes.meta.total;
    totalPages = promoRes.meta.totalPages;
  } catch (err) {
    console.error("Error loading promos:", err);
  }

  // Construct query url helper
  const createFilterUrl = (overrides: Record<string, string | undefined>) => {
    const current = new URLSearchParams();
    if (q) current.set("q", q);
    if (category) current.set("category", category);
    if (merchant) current.set("merchant", merchant);
    if (status) current.set("status", status);
    if (sortBy) current.set("sortBy", sortBy);
    current.set("page", "1"); // reset page on filter change

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    return `/promos?${current.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            Jelajah Promo & Diskon Terverifikasi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            {totalCount > 0
              ? `Menampilkan ${totalCount} penawaran aktif di seluruh Indonesia`
              : "Cari promo berdasarkan supermarket, minimarket, atau kategori"}
          </p>
        </div>

        <SearchBar initialQuery={q} />
      </div>

      {/* Main Layout: Filters & Promo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-emerald-600" />
                Filter Penawaran
              </span>
              {(q || category || merchant || status !== "ACTIVE" || sortBy !== "newest") && (
                <Link
                  href="/promos"
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Reset
                </Link>
              )}
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Urutkan Berdasarkan
              </label>
              <div className="flex flex-col gap-1 text-xs">
                {[
                  { label: "Paling Baru", val: "newest" },
                  { label: "Segera Berakhir", val: "ending_soon" },
                  { label: "Diskon Terbesar", val: "discount_desc" },
                  { label: "Harga Terendah", val: "price_asc" },
                ].map((s) => (
                  <Link
                    key={s.val}
                    href={createFilterUrl({ sortBy: s.val })}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === s.val
                        ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                        : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Kategori</label>
              <div className="flex flex-col gap-1 text-xs max-h-48 overflow-y-auto pr-1">
                <Link
                  href={createFilterUrl({ category: undefined })}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    !category
                      ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Semua Kategori
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={createFilterUrl({ category: c.slug })}
                    className={`px-3 py-2 rounded-lg transition-colors truncate ${
                      category === c.slug
                        ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                        : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Merchant Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Toko / Merchant</label>
              <div className="flex flex-col gap-1 text-xs max-h-48 overflow-y-auto pr-1">
                <Link
                  href={createFilterUrl({ merchant: undefined })}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    !merchant
                      ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  Semua Merchant
                </Link>
                {merchants.map((m) => (
                  <Link
                    key={m.id}
                    href={createFilterUrl({ merchant: m.slug })}
                    className={`px-3 py-2 rounded-lg transition-colors truncate ${
                      merchant === m.slug
                        ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                        : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Promo Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter aktif:
            </span>
            {q && (
              <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-200 text-zinc-800 font-medium">
                Pencarian: &quot;{q}&quot;
              </span>
            )}
            {category && (
              <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 font-medium">
                Kategori: {category}
              </span>
            )}
            {merchant && (
              <span className="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                Merchant: {merchant}
              </span>
            )}
            {!q && !category && !merchant && (
              <span className="text-xs text-zinc-600 italic">Semua Promo Aktif</span>
            )}
          </div>

          <PromoGrid
            promotions={promoData}
            emptyMessage={
              q
                ? `Tidak ada promo ditemukan untuk kata kunci "${q}". Silakan coba kata kunci lain atau reset filter.`
                : "Belum ada promo yang terdaftar untuk filter ini."
            }
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                const isCurrent = pageNumber === page;
                return (
                  <Link
                    key={pageNumber}
                    href={createFilterUrl({ page: String(pageNumber) })}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
