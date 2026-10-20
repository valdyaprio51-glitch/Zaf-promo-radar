# DEVLOG.md — PromoRadar Daily Engineering Log

Dokumen ini mencatat riwayat pengerjaan, keputusan teknis (ADR mini), perbaikan bug, dan progres harian codebase PromoRadar.

---

## 📌 Format Entri Log Standar
```markdown
### [YYYY-MM-DD] — <Judul Singkat Task>
- **Status:** COMPLETED / IN PROGRESS
- **Pekerjaan yang Dilakukan:**
  - Poin 1
  - Poin 2
- **File Dibuat / Dimodifikasi:**
  - `path/to/file`
- **Keputusan Teknis / Catatan Penting:**
  - Penjelasan alasan pemilihan pendekatan tertentu
- **Next Step:**
  - Task yang harus dikerjakan berikutnya
```

---

## 📜 Log Riwayat Pengerjaan

### [2026-10-20] — Implementasi Penuh MVP PromoRadar (Clean Layered Architecture & UI)
- **Status:** COMPLETED
- **Pekerjaan yang Dilakukan:**
  - Inisialisasi Next.js 16 (App Router, TypeScript Strict, Tailwind CSS).
  - Pemasangan dependensi inti: Lucide React, clsx, tailwind-merge, Zod, date-fns, bcryptjs, TanStack Query, dan Prisma ORM v6 stabil.
  - Implementasi skema database PostgreSQL lengkap di [`prisma/schema.prisma`](file:///d:/APP/Zaf-promo-radar/prisma/schema.prisma) mencakup tabel users, merchants, categories, promotions, promotion_sources, promotion_price_history, favorites, user_alerts, promotion_reports, dan ingestion_runs.
  - Pembuatan database seeder di [`prisma/seed.ts`](file:///d:/APP/Zaf-promo-radar/prisma/seed.ts) berisi data merchant supermarket terpercaya (Super Indo, Alfamart, Indomaret, Watsons, Kopi Kenangan, Tokopedia) beserta contoh promo terverifikasi.
  - Implementasi Repository Layer (`src/repositories/`) untuk pemisahan akses query database.
  - Implementasi Service Layer (`src/services/`) yang menangani validasi harga Rupiah integer, kalkulasi diskon, status kedaluwarsa dinamis, dan riwayat harga.
  - Implementasi Zod Schemas (`src/lib/validation/`) untuk validasi kontrak API request & DTO.
  - Implementasi REST API Route Handlers v1 (`/api/v1/promotions`, `/categories`, `/merchants`, `/search/suggestions`, `/admin/promotions/...`).
  - Pembuatan komponen antarmuka: `Header`, `Footer`, `MobileNav`, `PromoCard`, `PromoGrid`, `PromoBadge`, `SearchBar` (dengan autocomplete instant), dan `CategoryPills`.
  - Pembangunan halaman publik: Homepage (`/`), Listing & Multi-filter Promo (`/promos`), Detail Promo (`/promos/[slug]`), Kategori (`/categories`), Merchant (`/merchants`), Login (`/login`), dan Register (`/register`).
  - Pembangunan Admin Dashboard (`/admin`) untuk moderasi promo dan pemantauan KPI.
  - Setup Standalone Worker di `worker/` untuk validasi otomatis promo kedaluwarsa dan ingestion batch.
  - Konfigurasi SEO sitemap (`/sitemap.xml`), `robots.txt`, dan PWA manifest (`public/manifest.json`).
  - Verifikasi kompilasi produksi `npm run build` berhasil 100% (exit code 0).
- **File Dibuat / Dimodifikasi:**
  - `package.json`, `next.config.ts`, `prisma/schema.prisma`, `prisma/seed.ts`
  - `src/lib/utils.ts`, `src/lib/db/prisma.ts`
  - `src/lib/validation/*.ts` (promo, merchant, category)
  - `src/repositories/*.ts` (promo, merchant, category)
  - `src/services/*.ts` (promo, verification, merchant, category)
  - `src/app/api/v1/**/*.ts`
  - `src/components/**/*.tsx` (layout, promo, search)
  - `src/app/(public)/**/*.tsx`, `src/app/(auth)/**/*.tsx`, `src/app/admin/page.tsx`
  - `worker/**/*.ts`
  - `public/manifest.json`, `src/app/sitemap.ts`, `src/app/robots.ts`
- **Keputusan Teknis / Catatan Penting:**
  - Menghindari hardcoded error saat build static dengan membungkus query DB di halaman SSR dengan graceful fallback mock, sehingga aplikasi tetap dapat di-build atau diuji bahkan sebelum database PostgreSQL eksternal dijalankan.
  - Membungkus `MobileNav` dengan `<Suspense>` untuk mematuhi aturan rendering Next.js 16 terkait client hooks URL data.
  - Penyimpanan harga menggunakan integer Rupiah murni untuk mencegah floating point inaccuracies.
- **Next Step:**
  - Penyambungan database PostgreSQL lokal/cloud menggunakan `DATABASE_URL` di `.env` dan eksekusi `npx prisma db push` atau `npx prisma migrate dev` dilanjutkan `npx prisma db seed`.

---

### [2026-10-20] — Inisialisasi Sistem "4 File Otak" & Arsitektur PRD PromoRadar v1.0
- **Status:** COMPLETED
- **Pekerjaan yang Dilakukan:**
  - Menganalisis PRD v1.0 PromoRadar dan menyusun sistem 4 file otak root.
- **File Dibuat:**
  - `AGENTS.md`, `TASK_LIST.md`, `DEVLOG.md`, `BACKLOG.md`
