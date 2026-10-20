"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Grid, Heart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Beranda", href: "/", icon: Home, exact: true },
    { label: "Jelajah", href: "/promos", icon: Compass },
    { label: "Kategori", href: "/categories", icon: Grid },
    { label: "Favorit", href: "/favorites", icon: Heart },
    { label: "Admin", href: "/admin", icon: Shield },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 md:hidden pb-safe">
      <nav className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href.split("?")[0]) && item.href !== "/";

          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-colors",
                isActive ? "text-emerald-600" : "text-zinc-500 hover:text-zinc-800"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive && "stroke-[2.5px]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
