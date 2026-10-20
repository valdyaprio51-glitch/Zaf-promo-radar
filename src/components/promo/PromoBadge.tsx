import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

interface PromoBadgeProps {
  status?: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "NEEDS_VERIFICATION" | string;
  verificationStatus?: "VERIFIED" | "UNVERIFIED" | "REJECTED" | string;
  className?: string;
}

export function PromoBadge({
  status,
  verificationStatus,
  className,
}: PromoBadgeProps) {
  if (verificationStatus === "VERIFIED") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",
          className
        )}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Terverifikasi
      </span>
    );
  }

  if (status === "EXPIRING_SOON") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse",
          className
        )}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Segera Berakhir
      </span>
    );
  }

  if (status === "EXPIRED") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200",
          className
        )}
      >
        Kedaluwarsa
      </span>
    );
  }

  if (status === "NEEDS_VERIFICATION") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200",
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
        Perlu Verifikasi
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200",
        className
      )}
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
      Aktif
    </span>
  );
}

