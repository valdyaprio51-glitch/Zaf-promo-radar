# TASK_LIST.md — PromoRadar Project Tasks

Status Legend:
- `[ ]` : TODO (Belum dikerjakan)
- `[~]` : IN PROGRESS (Sedang dikerjakan)
- `[x]` : DONE (Selesai dan terverifikasi)
- `[BLOCKED]` : Terhalang dependency / issue

---

## 🎯 PRIORITAS 0: INISIALISASI PROYEK & MEMORI AGENT
- [x] Inisialisasi 4 File Otak: [`AGENTS.md`](file:///d:/APP/Zaf-promo-radar/AGENTS.md), [`TASK_LIST.md`](file:///d:/APP/Zaf-promo-radar/TASK_LIST.md), [`DEVLOG.md`](file:///d:/APP/Zaf-promo-radar/DEVLOG.md), [`BACKLOG.md`](file:///d:/APP/Zaf-promo-radar/BACKLOG.md)
- [x] Inisialisasi Next.js (App Router, TypeScript, Tailwind CSS, ESLint)
- [x] Konfigurasi UI essentials: Lucide Icons, clsx, tailwind-merge, class-variance-authority
- [x] Setup struktur folder standar (`src/app`, `components`, `services`, `repositories`, `lib`, `worker`)
- [x] Konfigurasi environment variables template ([`.env.example`](file:///d:/APP/Zaf-promo-radar/.env.example) & [`.env`](file:///d:/APP/Zaf-promo-radar/.env))

---

## 🎯 PRIORITAS 1: DATABASE & CORE INFRASTRUCTURE
- [x] Setup Prisma ORM 6 stabil & generated Prisma Client
- [x] Implementasi schema Prisma lengkap ([`prisma/schema.prisma`](file:///d:/APP/Zaf-promo-radar/prisma/schema.prisma)):
  - [x] Model `User` (id, email, passwordHash, name, role, timestamps)
  - [x] Model `Merchant` (id, name, slug, logoUrl, websiteUrl, status, timestamps)
  - [x] Model `Category` (id, name, slug, parentId, isActive)
  - [x] Model `Promotion` (id, merchantId, categoryId, title, slug, description, imageUrl, originalPrice, promoPrice, discountPercentage, termsText, startAt, endAt, status, verificationStatus, lastVerifiedAt, sourceId, sourceUrl, timestamps)
  - [x] Model `PromotionSource` (id, name, sourceType, baseUrl, termsUrl, collectionMethod, isActive, lastSuccessAt, lastErrorAt)
  - [x] Model `PromotionPriceHistory` (id, promotionId, originalPrice, promoPrice, capturedAt, sourceReference)
  - [x] Model `Favorite` (userId, promotionId, createdAt — compound unique)
  - [x] Model `UserAlert` (id, userId, keyword, categoryId, merchantId, locationCode, isActive, createdAt)
  - [x] Model `PromotionReport` (id, promotionId, userId, reportType, description, status, createdAt, resolvedAt)
  - [x] Model `IngestionRun` (id, sourceId, startedAt, finishedAt, status, recordsProcessed, recordsFailed, errorMessage)
- [x] Buat database seeder ([`prisma/seed.ts`](file:///d:/APP/Zaf-promo-radar/prisma/seed.ts)) untuk sample Merchant, Category, Promo, dan Price History terverifikasi
- [ ] Eksekusi `npx prisma migrate dev` saat instance PostgreSQL lokal/cloud tersambung

---

## 🎯 PRIORITAS 2: REPOSITORY & SERVICE LAYER (BUSINESS LOGIC)
- [x] Repository: [`promo.repository.ts`](file:///d:/APP/Zaf-promo-radar/src/repositories/promo.repository.ts) (pencarian, filter, pagination, slug lookup, update status, suggestions)
- [x] Repository: [`merchant.repository.ts`](file:///d:/APP/Zaf-promo-radar/src/repositories/merchant.repository.ts) (CRUD merchant, query promo by merchant)
- [x] Repository: [`category.repository.ts`](file:///d:/APP/Zaf-promo-radar/src/repositories/category.repository.ts) (CRUD kategori, hierarchy/tree query)
- [x] Service: [`promo.service.ts`](file:///d:/APP/Zaf-promo-radar/src/services/promo.service.ts) (validasi diskon, kalkulasi Rupiah, slug auto-generation, history capture, report)
- [x] Service: [`verification.service.ts`](file:///d:/APP/Zaf-promo-radar/src/services/verification.service.ts) (verifikasi promo, auto-expire trigger, log review)
- [x] Service: [`merchant.service.ts`](file:///d:/APP/Zaf-promo-radar/src/services/merchant.service.ts) & [`category.service.ts`](file:///d:/APP/Zaf-promo-radar/src/services/category.service.ts)

---

## 🎯 PRIORITAS 3: API CONTRACT & ROUTE HANDLERS (/api/v1)
- [x] Zod Schemas ([`src/lib/validation/`](file:///d:/APP/Zaf-promo-radar/src/lib/validation)): DTO validation untuk promo, merchant, category, query params
- [x] `GET /api/v1/promotions` (multi-filter `q`, category, merchant, status, sortBy, pagination)
- [x] `POST /api/v1/promotions` (create verified promotion)
- [x] `GET /api/v1/promotions/:slug` (detail promo, riwayat harga, sumber asli)
- [x] `PATCH /api/v1/promotions/:slug` (update promo)
- [x] `POST /api/v1/promotions/:slug/report` (lapor promo kedaluwarsa / keliru)
- [x] `GET /api/v1/categories` & `POST /api/v1/categories`
- [x] `GET /api/v1/merchants` & `POST /api/v1/merchants` & `GET /api/v1/merchants/:slug`
- [x] `GET /api/v1/search/suggestions` (autocomplete / suggestion keyword)
- [x] Admin API:
  - [x] `POST /api/v1/admin/promotions/:id/verify`
  - [x] `POST /api/v1/admin/promotions/:id/deactivate`

---

## 🎯 PRIORITAS 4: FRONTEND & PUBLIC UI (RESPONSIVE & PWA)
- [x] Komponen Layout:
  - [x] [`Header.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/layout/Header.tsx)
  - [x] [`Footer.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/layout/Footer.tsx)
  - [x] [`MobileNav.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/layout/MobileNav.tsx) (Bottom navigation bar)
- [x] Komponen Promo:
  - [x] [`PromoCard.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/promo/PromoCard.tsx) (Badge diskon, harga akhir IDR, countdown expired, logo merchant)
  - [x] [`PromoGrid.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/promo/PromoGrid.tsx) (Responsive grid, loading skeleton, empty state)
  - [x] [`PromoBadge.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/promo/PromoBadge.tsx) (Active, Expiring Soon, Expired, Verified)
- [x] Komponen Pencarian:
  - [x] [`SearchBar.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/search/SearchBar.tsx) (Instant suggestions dropdown as user types)
  - [x] [`CategoryPills.tsx`](file:///d:/APP/Zaf-promo-radar/src/components/search/CategoryPills.tsx) (Horizontal scrollable pills)
- [x] Halaman Utama / Homepage ([`src/app/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/page.tsx)):
  - [x] Hero section dengan search bar utama
  - [x] Quick Category Pills
  - [x] Section: Promo Terbaru Terverifikasi
  - [x] Section: Promo Segera Berakhir (Ending Soon)
  - [x] Section: Merchant Populer
  - [x] Banner Value Proposition & Integritas Promo
- [x] Halaman Daftar & Pencarian Promo ([`src/app/(public)/promos/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/(public)/promos/page.tsx)):
  - [x] Multi-filter (Kategori, Merchant, Status) & Sorting
  - [x] Pagination controls & Active filter chips
- [x] Halaman Detail Promo ([`src/app/(public)/promos/[slug]/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/(public)/promos/[slug]/page.tsx)):
  - [x] Info harga akhir, diskon, hemat kalkulasi
  - [x] Syarat & Ketentuan lengkap
  - [x] Masa berlaku WIB & status terakhir diverifikasi
  - [x] Tombol "Lihat di Sumber Resmi"
  - [x] Transparansi Riwayat Perubahan Harga
- [x] Halaman Kategori ([`src/app/(public)/categories/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/(public)/categories/page.tsx))
- [x] Halaman Merchant ([`src/app/(public)/merchants/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/(public)/merchants/page.tsx))
- [x] Halaman Login ([`src/app/(auth)/login/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/(auth)/login/page.tsx)) & Register ([`src/app/(auth)/register/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/(auth)/register/page.tsx))

---

## 🎯 PRIORITAS 5: ADMIN DASHBOARD
- [x] Layout & Halaman Admin ([`src/app/admin/page.tsx`](file:///d:/APP/Zaf-promo-radar/src/app/admin/page.tsx)):
  - [x] KPI metrics: Promo Aktif, Total Merchant, Kategori, Skor Integritas
  - [x] Tabel moderasi promo lengkap dengan link sumber & aksi verifikasi

---

## 🎯 PRIORITAS 6: BACKGROUND WORKER & INGESTION
- [x] Standalone worker entrypoint ([`worker/index.ts`](file:///d:/APP/Zaf-promo-radar/worker/index.ts))
- [x] Job pemeriksaan berkala promo kedaluwarsa ([`worker/jobs/check-expired.job.ts`](file:///d:/APP/Zaf-promo-radar/worker/jobs/check-expired.job.ts))
- [x] Provider adapter ingestion partner ([`worker/providers/sample-partner.provider.ts`](file:///d:/APP/Zaf-promo-radar/worker/providers/sample-partner.provider.ts))

---

## 🎯 PRIORITAS 7: SEO, PERFORMANCE & PWA
- [x] Dynamic sitemap ([`src/app/sitemap.ts`](file:///d:/APP/Zaf-promo-radar/src/app/sitemap.ts))
- [x] Web crawler policy ([`src/app/robots.ts`](file:///d:/APP/Zaf-promo-radar/src/app/robots.ts))
- [x] PWA Web App Manifest ([`public/manifest.json`](file:///d:/APP/Zaf-promo-radar/public/manifest.json))
- [x] Production build verification (`npm run build` PASS with code 0)
