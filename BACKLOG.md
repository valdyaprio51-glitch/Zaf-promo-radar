# BACKLOG.md — PromoRadar Ideas, Tech Debt & Future Roadmaps

Dokumen ini menampung ide fitur lanjutan, perbaikan teknis (tech debt), bug yang ditemukan, dan roadmap di luar cakupan MVP aktif.

---

## 💡 IDE FITUR TERTUNDA (PHASE 2 — SHOULD HAVE)

- [ ]   - Notifikasi reminder 24 jam sebelum promo favorit berakhir (*expiring soon*).
**Web Push & Email Notifications:**
  - Integrasi provider notifikasi (e.g. Resend / SendGrid / Firebase Cloud Messaging).
  - Notifikasi ketika promo baru dari kategori atau merchant favorit rilis.

- [ ] **Engine Perbandingan Harga Akhir (Price Comparison):**
  - Kalkulator perbandingan harga bersih setelah diskon persentase, kupon cashback, dan minimum belanja.
  - Visualisasi perbandingan produk identik dari 2+ merchant berbeda.

- [ ] **Geo-Location & City-Based Promo Discovery:**
  - Halaman kurasi promo berdasarkan kota/daerah (misal: `/kota/jakarta`, `/kota/surabaya`, `/kota/bandung`).
  - Filter jarak toko fisik terdekat jika data gerai merchant tersedia.

- [ ] **Merchant Portal (Self-Submission & Verification):**
  - Dashboard khusus merchant untuk submit promo baru lengkap dengan bukti dan banner.
  - Alur moderasi admin sebelum promo merchant dipublikasikan ke publik.

- [ ] **Community Promo Reporting:**
  - Pengguna dapat melaporkan promo yang sudah habis kuota atau tidak sesuai syarat di lapangan.
  - Sistem reputasi sederhana untuk laporan yang terverifikasi benar.

- [ ] **Affiliate Link Tracking & Transparency:**
  - Sub-ID generator untuk melacak conversion klik menuju marketplace atau website merchant mitra.
  - Label disclaimer afiliasi yang jelas dan transparan sesuai regulasi.

- [ ] **Progressive Web App (PWA) Offline-Ready:**
  - Service worker untuk caching halaman promo favorit yang sudah pernah dibuka saat offline.
  - Prompt install "Add to Home Screen" di perangkat mobile.

---

## 🚀 IDE FITUR TERTUNDA (PHASE 3 — FUTURE INNOVATIONS)

- [ ] **AI Shopping Assistant (Verifiable RAG):**
  - Chatbot asisten belanja cerdas berbasis Gemini / LLM yang hanya merujuk pada promo aktif dan terverifikasi di database PromoRadar.
  - Menjawab pertanyaan bahasa sehari-hari: *"Cariin minyak goreng 2 liter paling murah di supermarket minggu ini"*.

- [ ] **Multi-Merchant Basket Optimizer:**
  - Membantu pengguna menghitung total belanja mingguan dari beberapa toko untuk menghasilkan total pengeluaran terendah.

- [ ] **Direct Merchant API & Webhook:**
  - Merchant skala enterprise dapat mengalirkan data promo dan kupon langsung via REST API terenkripsi.

- [ ] **Merchant Subscription & Performance Analytics:**
  - Dashboard analitik B2B berbayar: metrik impresi, CTR, demografi peminat promo, dan benchmarking kategori.

---

## 🛠️ TECHNICAL DEBT & OPTIMIZASI ARSITEKTUR

- [ ] **Advanced Full-Text Search Tuning:**
  - Tambahkan PostgreSQL extension `pg_trgm` (trigram) untuk pencarian toleran typo (*fuzzy search* nama brand/produk).
  - Lakukan benchmark `EXPLAIN ANALYZE` pada query pencarian multi-filter ketika data promo mencapai > 10.000 record.

- [ ] **Redis Caching Layer:**
  - Cache response `GET /api/v1/promotions` (homepage & popular queries) dengan TTL 5-15 menit untuk menghemat beban database.

- [ ] **Object Storage & Image CDN:**
  - Penggunaan Cloudflare R2 / AWS S3 untuk menyimpan gambar materi promosi dengan auto-resize WebP.

- [ ] **Rate Limiting & Anti-Scraping Protection:**
  - Proteksi endpoint publik dan API auth menggunakan Upstash Redis / sliding-window rate limit.

---

## 🐛 TEMUAN BUG & CATATAN DEFECT (BUG TRACKER)

| ID | Tanggal Ditemukan | Deskripsi Issue | Status | Catatan / Solusi |
|---|---|---|---|---|
| - | - | *Belum ada bug yang tercatat.* | - | - |

