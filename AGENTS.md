# AGENTS.md — PromoRadar System Architecture & Agent Rules

Dokumen ini adalah pedoman operasional utama (Rules of Engagement) untuk AI Agent dan developer yang bekerja pada codebase **PromoRadar**.

---

## ⚠️ ATURAN EMAS (GOLDEN RULES) — WAJIB DIPATUHI

1. **SESSION MEMORY LOAD (DILARANG FULL SCAN):**
   - Setiap kali membuka sesi percakapan baru, **WAJIB HANYA MEMBACA 4 FILE OTAK** di root:
     1. [`AGENTS.md`](file:///d:/APP/Zaf-promo-radar/AGENTS.md)
     2. [`TASK_LIST.md`](file:///d:/APP/Zaf-promo-radar/TASK_LIST.md)
     3. [`DEVLOG.md`](file:///d:/APP/Zaf-promo-radar/DEVLOG.md)
     4. [`BACKLOG.md`](file:///d:/APP/Zaf-promo-radar/BACKLOG.md)
   - **DILARANG** melakukan pemindaian seluruh folder codebase (`find`, `Get-ChildItem -Recurse`, dsb.) pada awal sesi.
   - Hanya buka dan baca file spesifik yang langsung relevan dengan task yang sedang dikerjakan.

2. **UPDATE STATUS DISIPLIN:**
   - Setelah menyelesaikan atau mengubah status pekerjaan:
     - Update status di [`TASK_LIST.md`](file:///d:/APP/Zaf-promo-radar/TASK_LIST.md) (`[ ]`, `[~]`, `[x]`, `[BLOCKED]`).
     - Catat ringkasan aksi, file yang diubah/dibuat, dan keputusan teknis di [`DEVLOG.md`](file:///d:/APP/Zaf-promo-radar/DEVLOG.md).
     - Catat ide, perbaikan tertunda, atau bug baru di [`BACKLOG.md`](file:///d:/APP/Zaf-promo-radar/BACKLOG.md).

3. **INTEGRITAS DATA & VALIDASI PROMO:**
   - **Zero Hallucination / No Fake Claims:** PromoRadar adalah platform promo *terpercaya*. Jangan pernah membuat data promo tanpa sumber yang sah, atau menandai promo kedaluwarsa sebagai aktif.
   - Harga disimpan dalam format integer Rupiah (IDR) konsisten, bukan floating-point.
   - Status promo harus jelas: `ACTIVE`, `EXPIRING_SOON`, `EXPIRED`, `NEEDS_VERIFICATION`.

---

## 1. Konteks Project

- **Nama Produk:** PromoRadar (Smart Promo Discovery Platform)
- **Target Pasar:** Indonesia (Fokus bahasa: Bahasa Indonesia, mata uang: IDR)
- **Model Bisnis:** Freemium, Affiliate, Sponsored Promotion, B2B Subscription
- **Tujuan Utama:** Menghadirkan platform pencarian, perbandingan, dan kurasi promo terverifikasi dari supermarket, restoran, toko ritel, dan e-commerce di Indonesia.

---

## 2. Technology Stack

### Frontend & UI
- **Framework:** Next.js (App Router, React 19 / Server Components & Client Components terpisah)
- **Language:** TypeScript (Strict mode enabled, `noImplicitAny: true`)
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui + Radix UI primitives + Lucide React Icons
- **Form Management:** React Hook Form + Zod
- **Client State / Fetching:** TanStack Query (React Query) untuk interaksi data dinamis di client

### Backend & API
- **API Runtime:** Next.js Route Handlers (`src/app/api/v1/...`)
- **Architecture Pattern:** Clean Layered Architecture:
  - **Route Handlers (`src/app/api/v1/`)**: Parsing HTTP request, validation via Zod, delegasi ke Service, return response.
  - **Service Layer (`src/services/`)**: Seluruh business logic, kalkulasi diskon, aturan verifikasi, validasi masa berlaku.
  - **Repository Layer (`src/repositories/`)**: Akses query database, abstraksi Prisma client, filtering & pagination.
- **Validation:** Zod schemas di seluruh layer input & API contract.

### Database & ORM
- **Database:** PostgreSQL (Mendukung Full-Text Search / Trigram `pg_trgm`)
- **ORM:** Prisma ORM (Schema di `prisma/schema.prisma`)
- **Migrations:** Prisma Migrate

### Authentication & Authorization
- **Auth Library:** Auth.js (NextAuth v5) / JWT session cookie aman
- **Role-Based Access Control (RBAC):**
  - `USER`: Mencari, melihat detail, favorit, alert notifikasi
  - `MERCHANT`: Mengelola promo bisnis sendiri, statistik klik (Phase 2/3)
  - `ADMIN`: Moderasi promo, CRUD category & merchant, manajemen sumber data, inspeksi report

### Background Jobs & Ingestion Worker
- **Scheduler & Queue:** Node.js standalone worker terpisah dari Next.js + BullMQ + Redis
- **Ingestion Pipeline:** Adapter/provider modular untuk sumber data terdaftar, normalisasi schema, deduplikasi, validasi kedaluwarsa berkala

---

## 3. Struktur Direktori Standar

```
promoradar/
├── public/                 # Static assets, favicon, manifest PWA
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Halaman publik (SSR / ISR)
│   │   │   ├── page.tsx    # Homepage (Hero, search, curated promos)
│   │   │   ├── promos/     # /promos & /promos/[slug]
│   │   │   ├── categories/ # /categories & /categories/[slug]
│   │   │   └── merchants/  # /merchants & /merchants/[slug]
│   │   ├── (auth)/         # Halaman autentikasi
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/      # User dashboard (Favorites, Alerts, Settings)
│   │   ├── admin/          # Admin portal (Moderasi, Data Sources, CRUD)
│   │   └── api/
│   │       └── v1/         # REST API v1 Route Handlers
│   ├── components/         # Reusable UI Components
│   │   ├── ui/             # shadcn/ui atomic components
│   │   ├── promo/          # PromoCard, PromoBadge, PromoGrid, PriceHistory
│   │   ├── search/         # SearchBar, FilterSheet, CategoryPills
│   │   └── layout/         # Header, Footer, MobileNav, AdminSidebar
│   ├── features/           # Feature-driven hooks & client logic
│   │   ├── promotions/
│   │   ├── merchants/
│   │   ├── favorites/
│   │   └── alerts/
│   ├── lib/                # Shared utilities & configurations
│   │   ├── auth/           # NextAuth configs, RBAC guards
│   │   ├── db/             # Prisma client singleton
│   │   ├── validation/     # Shared Zod schemas
│   │   └── utils/          # Currency formatters, date helpers (WIB/ID)
│   ├── services/           # Business Logic Layer
│   │   ├── promo.service.ts
│   │   ├── merchant.service.ts
│   │   ├── category.service.ts
│   │   └── verification.service.ts
│   ├── repositories/       # Data Access Layer (Prisma queries)
│   │   ├── promo.repository.ts
│   │   ├── merchant.repository.ts
│   │   └── category.repository.ts
│   └── types/              # Global TypeScript interfaces & DTOs
├── prisma/
│   └── schema.prisma       # Database schema & indexes
├── worker/                 # Standalone Background Worker
│   ├── jobs/               # Expired check, data scraping/import, cleanup
│   ├── providers/          # Adapter per data source resmi
│   └── index.ts            # Worker entrypoint (BullMQ)
├── tests/                  # Unit & integration tests
├── .env.example            # Sample environment variables
├── package.json
└── tsconfig.json
```

---

## 4. Alur Data & Business Logic

### A. Alur Ingestion & Verifikasi Promo
```
[Sumber Resmi / API Mitra / Merchant]
              │
              ▼
    [Ingestion Worker (BullMQ)]
              │ (Normalisasi, Cek Duplikasi by SourceID/URL)
              ▼
    [Validation Pipeline]
    ├─ Tanggal Berakhir Valid? ── No ──► [Tandai EXPIRED / Rejeki]
    ├─ Format Harga Valid?     ── No ──► [Antrean Moderasi Manual]
    └─ Valid                     ── Yes ─► [Simpan ke Database (PostgreSQL)]
              │
              ▼
    [Promotion Status: ACTIVE / NEEDS_VERIFICATION]
              │
              ▼
    [Tampil di Halaman Publik & API /api/v1/promotions]
```

### B. Alur Validasi Kedaluwarsa Otomatis
- Scheduler berjalan tiap jam / terjadwal.
- Cari promo dengan `end_at < NOW()` dan `status = 'ACTIVE'`.
- Update status menjadi `EXPIRED`. Promo kedaluwarsa otomatis disembunyikan dari hasil pencarian default.

### C. Alur Pencarian (Search & Filter)
- Input: `q` (keyword), `category`, `merchant`, `city`, `status`, `page`, `limit`.
- Search query menggunakan PostgreSQL Full-Text Search / Trigram pada kolom `title`, `description`, `terms_text`, nama merchant, dan kategori.
- Sorting mengutamakan: Status Terverifikasi > Relevansi Keyword > Promo Mendekati Berakhir > Popularitas (bukan sekadar diskon terbesar).

---

## 5. Standar Penulisan Kode (Coding Guidelines)

1. **TypeScript Strict:** Dilarang menggunakan `any`. Gunakan interface/type eksplisit atau Zod `z.infer<typeof schema>`.
2. **Layer Separation:** Route handler tidak boleh langsung memanggil Prisma model. Selalu lewat Service -> Repository.
3. **Mata Uang & Waktu:**
   - Mata uang: IDR integer (contoh: `25000` untuk Rp 25.000). Gunakan helper `formatIDR(val)`.
   - Waktu: Simpan dalam UTC di database (`DateTime @db.Timestamptz`), format tampilan ke zona waktu Indonesia (`Asia/Jakarta` / WIB / WITA / WIT).
4. **Mobile First UI:** Pastikan seluruh komponen responsif, sentuhan (tap target minimal 44x44px), visual loading skeleton, dan empty state ramah pengguna.
5. **Keamanan:**
   - Semua input API divalidasi dengan Zod schema.
   - Endpoint `/admin` dan `/api/v1/admin/*` diproteksi middleware RBAC (`role === 'ADMIN'`).
   - Terapkan rate-limiting pada endpoint publik dan endpoint autentikasi.

