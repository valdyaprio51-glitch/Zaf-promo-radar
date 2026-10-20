import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge classnames with tailwind classes cleanly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer IDR to Indonesian Rupiah representation (e.g. 25000 -> "Rp 25.000")
 */
export function formatIDR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO Date string or Date object to WIB / Indonesia standard representation
 */
export function formatWIB(
  date: Date | string | null | undefined,
  includeTime = false
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }
      : {}),
  };

  return new Intl.DateTimeFormat("id-ID", options).format(d);
}

/**
 * Calculate discount percentage safely
 */
export function calculateDiscountPercentage(
  originalPrice: number | null | undefined,
  promoPrice: number | null | undefined
): number | null {
  if (!originalPrice || !promoPrice || originalPrice <= promoPrice) {
    return null;
  }
  return Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
}

/**
 * Check promo status dynamically based on current time & end_at
 */
export function resolvePromoStatus(
  status: string,
  endAt: Date | string | null | undefined
): "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "NEEDS_VERIFICATION" {
  if (status === "NEEDS_VERIFICATION") return "NEEDS_VERIFICATION";
  if (!endAt) return status as any;

  const endDate = typeof endAt === "string" ? new Date(endAt) : endAt;
  const now = new Date();

  if (endDate.getTime() < now.getTime()) {
    return "EXPIRED";
  }

  // If ending within 48 hours
  const diffHours = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffHours <= 48 && diffHours > 0) {
    return "EXPIRING_SOON";
  }

  return (status as any) || "ACTIVE";
}

