import React from "react";
import { CategoryService } from "@/services/category.service";
import Link from "next/link";
import { Grid, ArrowRight, ShoppingBag, Coffee, Laptop, Sparkles, Shirt, Baby } from "lucide-react";

export const metadata = {
  title: "Kategori Promo — PromoRadar",
  description: "Jelajahi promo berdasarkan kategori kebutuhan harian, kuliner, gadget, dan skincare.",
};

export default async function CategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await CategoryService.getCategories(true);
  } catch (err) {
    console.error("Error fetching categories:", err);
  }

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "supermarket-sembako":
        return <ShoppingBag className="w-6 h-6 text-emerald-600" />;
      case "makanan-minuman":
        return <Coffee className="w-6 h-6 text-amber-600" />;
      case "elektronik-gadget":
        return <Laptop className="w-6 h-6 text-blue-600" />;
      case "kesehatan-kecantikan":
        return <Sparkles className="w-6 h-6 text-rose-600" />;
      case "fashion-lifestyle":
        return <Shirt className="w-6 h-6 text-purple-600" />;
      case "ibu-bayi":
        return <Baby className="w-6 h-6 text-teal-600" />;
      default:
        return <Grid className="w-6 h-6 text-zinc-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
          Kategori Promo Pilihan
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1">
          Temukan penawaran terbaik berdasarkan kelompok kebutuhan belanja Anda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/promos?category=${cat.slug}`}
            className="group p-6 bg-white rounded-3xl border border-zinc-200 hover:border-emerald-500 hover:shadow-lg transition-all flex items-start gap-4"
          >
            <div className="p-3.5 rounded-2xl bg-zinc-50 group-hover:bg-emerald-50 transition-colors">
              {getCategoryIcon(cat.slug)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 text-base transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                {cat._count?.promotions ? `${cat._count.promotions} promo aktif` : "Lihat penawaran"}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                Jelajah Kategori
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
