"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  initialQuery = "",
  placeholder = "Cari minyak goreng, kopi, susu, supermarket...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; slug: string; merchant: { name: string } }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/search/suggestions?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const json = await res.json();
          setSuggestions(json.data || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/promos?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/promos");
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full rounded-2xl bg-white border-2 border-zinc-200 focus-within:border-emerald-500 shadow-sm transition-all overflow-hidden"
      >
        <div className="pl-4 text-zinc-400">
          <Search className="w-5 h-5 text-emerald-600" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full py-3.5 px-3 text-sm md:text-base text-zinc-900 bg-transparent placeholder-zinc-400 focus:outline-none"
        />

        {isLoading && (
          <div className="pr-3 text-zinc-400">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          </div>
        )}

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="p-1.5 mr-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="hidden sm:inline-flex items-center gap-1 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
        >
          Cari
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden z-50">
          <div className="p-2 border-b border-zinc-100 text-xs font-semibold text-zinc-500">
            Saran Pencarian Terverifikasi
          </div>
          <ul className="divide-y divide-zinc-50 max-h-72 overflow-y-auto">
            {suggestions.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/promos/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 hover:bg-emerald-50/50 transition-colors group"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-sm font-medium text-zinc-900 group-hover:text-emerald-700 line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {item.merchant.name}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Lihat semua hasil untuk &quot;{query}&quot; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

