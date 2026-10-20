"use client";

import React, { useState } from "react";
import { Bell, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface AlertItem {
  id: string;
  keyword: string;
  category: string;
  isActive: boolean;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "a1",
      keyword: "Minyak Goreng 2L",
      category: "Supermarket & Sembako",
      isActive: true,
    },
    {
      id: "a2",
      keyword: "Susu UHT 1 Liter",
      category: "Supermarket & Sembako",
      isActive: true,
    },
  ]);

  const [keywordInput, setKeywordInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("Semua Kategori");

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;

    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      keyword: keywordInput.trim(),
      category: categoryInput,
      isActive: true,
    };

    setAlerts([newAlert, ...alerts]);
    setKeywordInput("");
  };

  const handleToggle = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Bell className="w-3.5 h-3.5" />
          Pengingat Belanja Cerdas
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
          Atur Promo Radar & Notifikasi
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600">
          Dapatkan pemberitahuan otomatis saat promo untuk produk kebutuhan Anda dirilis oleh supermarket atau merchant mitra.
        </p>
      </div>

      {/* Add Alert Form */}
      <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          Tambah Radar Kata Kunci Baru
        </h2>

        <form onSubmit={handleAddAlert} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Contoh: Beras 5kg, Popok Bayi, Kopi Mantan..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Supermarket & Sembako">Supermarket & Sembako</option>
              <option value="Makanan & Minuman">Makanan & Minuman</option>
              <option value="Elektronik & Gadget">Elektronik & Gadget</option>
              <option value="Kesehatan & Kecantikan">Kesehatan & Kecantikan</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-colors"
            >
              Pasang Alert
            </button>
          </div>
        </form>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-zinc-900">
          Radar Aktif ({alerts.length})
        </h2>

        {alerts.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600">
            Belum ada radar alert yang dipasang. Tambahkan kata kunci di atas untuk memulai!
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(alert.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      alert.isActive
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold ${
                        alert.isActive ? "text-zinc-900" : "text-zinc-400 line-through"
                      }`}
                    >
                      {alert.keyword}
                    </span>
                    <span className="text-[11px] text-zinc-600">
                      {alert.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(alert.id)}
                  className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Hapus Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

