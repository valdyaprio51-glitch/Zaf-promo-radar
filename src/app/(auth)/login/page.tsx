import React from "react";
import Link from "next/link";
import { Radar, ShieldCheck, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Radar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900">
            Masuk ke PromoRadar
          </h1>
          <p className="text-xs text-zinc-600">
            Simpan promo favorit dan pantau diskon terbaik di sekitarmu
          </p>
        </div>

        {/* Demo Account Callout */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
          <div className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Akun Demo Siap Pakai:
          </div>
          <p>
            Admin: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">admin@promoradar.id</code> (pass: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">admin123</code>)
          </p>
          <p>
            User: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">user@promoradar.id</code> (pass: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">admin123</code>)
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="nama@email.com"
                defaultValue="admin@promoradar.id"
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
                placeholder="••••••••"
                defaultValue="admin123"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            Masuk
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-zinc-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Daftar Gratis
          </Link>
        </div>
      </div>
    </div>
  );
}

