import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShoppingBag, Coffee, Laptop, Sparkles, Shirt, Baby, LayoutGrid } from "lucide-react";

interface CategoryPillsProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  activeCategory?: string;
  className?: string;
}

export function CategoryPills({
  categories,
  activeCategory,
  className,
}: CategoryPillsProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "supermarket-sembako":
        return <ShoppingBag className="w-4 h-4" />;
      case "makanan-minuman":
        return <Coffee className="w-4 h-4" />;
      case "elektronik-gadget":
        return <Laptop className="w-4 h-4" />;
      case "kesehatan-kecantikan":
        return <Sparkles className="w-4 h-4" />;
      case "fashion-lifestyle":
        return <Shirt className="w-4 h-4" />;
      case "ibu-bayi":
        return <Baby className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none", className)}>
      <Link
        href="/promos"
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold shrink-0 transition-all border",
          !activeCategory
            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
            : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        Semua Kategori
      </Link>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/promos?category=${cat.slug}`}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold shrink-0 transition-all border",
              isActive
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
            )}
          >
            {getCategoryIcon(cat.slug)}
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}

