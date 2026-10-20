import React from "react";
import Link from "next/link";
import { Radar, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Radar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900">
            Buat Akun PromoRadar
          </h1>
          <p className="text-xs text-zinc-600">
            Mulai simpan penawaran terbaik dan atur preferensi belanja
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Budi Santoso"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="nama@email.com"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            Daftar Sekarang
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-zinc-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Masuk Disini
          </Link>
        </div>
      </div>
    </div>
  );
}

