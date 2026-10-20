import React from "react";
import { CategoryService } from "@/services/category.service";
import { PromoService } from "@/services/promo.service";
import { PromoGrid } from "@/components/promo/PromoGrid";
import { SearchBar } from "@/components/search/SearchBar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { Metadata } from "next";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await CategoryService.getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori Promo — PromoRadar",
    };
  }

  return {
    title: `Promo ${category.name} Terbaru & Terverifikasi — PromoRadar`,
    description: `Kumpulan promo diskon ${category.name} terbaik dari berbagai supermarket, restoran, dan toko di Indonesia. Hemat belanja harianmu.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  let category: any = null;
  let promotions: any[] = [];

  try {
    const [cat, promoRes] = await Promise.all([
      CategoryService.getCategoryBySlug(slug),
      PromoService.getPromotions({
        category: slug,
        status: "ACTIVE",
        sortBy: "newest",
        page: 1,
        limit: 20,
      }),
    ]);

    category = cat;
    promotions = promoRes.data;
  } catch (err) {
    console.error("Error loading category promos:", err);
  }

  if (!category) {
    // If category not in DB yet, fallback friendly display
    category = {
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
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Semua Kategori
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          Katalog Kategori
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900">
          Promo {category.name}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl">
          Daftar penawaran dan diskon terverifikasi untuk kategori {category.name} dari berbagai merchant resmi mitra PromoRadar.
        </p>

        <div className="pt-2 max-w-xl">
          <SearchBar placeholder={`Cari di kategori ${category.name}...`} />
        </div>
      </div>

      {/* Promo Grid */}
      <div className="pt-4">
        <PromoGrid
          promotions={promotions}
          emptyMessage={`Belum ada promo aktif untuk kategori ${category.name}. Silakan cek kembali nanti atau lihat kategori lainnya.`}
        />
      </div>
    </div>
  );
}

