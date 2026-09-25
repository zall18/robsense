# 🌊 RobSense
> **"Dari Akar Masalah Air Tanah ke Kota Rendah Risiko"**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=flat&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**RobSense** adalah platform GovTech dan *Circular Water Awareness* yang dirancang untuk membantu kota mengurangi ketergantungan pada air tanah melalui edukasi berbasis risiko. Proyek ini dikembangkan untuk kompetisi **Diponegoro Software Development Competition (DSDC) ANFORCOM 2026**.

---

## 1. Live Demo & Akses

Prototipe MVP aplikasi telah di-deploy dan dapat diuji coba melalui tautan berikut:
*   🖥️ **Dashboard Admin (Pemkot/Puskesmas)**: [https://robsense-of56.vercel.app/admin](https://robsense-of56.vercel.app/admin)
*   📱 **Portal Warga (Mobile-first PWA)**: [https://robsense-of56.vercel.app/install](https://robsense-of56.vercel.app/install)
*   🌐 **Akses Onboarding Warga (Local)**: `http://localhost:3000/warga/onboarding`

---

## 2. Latar Belakang Masalah (Rantai Sebab-Akibat)

Banjir rob di pesisir utara Jawa terus memburuk[cite: 3]. Alih-alih berfokus pada infrastruktur hilir, RobSense membidik penyebab utama dari sisi hulu: **Eksploitasi air tanah → tanah ambles → rob makin parah → dampak kesehatan warga pesisir**. 

RobSense memanfaatkan sistem Peringatan Dini rob sebagai pemicu untuk mengubah perilaku masyarakat agar beralih ke praktik ekonomi sirkular air.

---

## 3. Tiga Modul MVP

Aplikasi ini tidak memisahkan kode untuk warga dan admin, melainkan menggunakan satu ekosistem yang terbagi menjadi 3 modul utama:

*   **Modul 1 - Risk Scoring Engine (Backend)**: Menarik data pasang surut/cuaca dari API publik resmi BMKG (dengan jalur cadangan input manual) dan menggabungkannya dengan tabel bobot amblesan tanah statis per kecamatan. Logika *rule-based* ini menghasilkan status risiko (rendah/sedang/tinggi).
*   **Modul 2 - Portal Warga (Aplikasi Publik)**: Menampilkan peta status warna (hijau/kuning/merah) tanpa *login*. Menyediakan *onboarding* notifikasi terpadu di mana warga menjawab sumber air utamanya (PDAM/air tanah) dan mendapatkan *feedback* instan berupa anjuran pengurangan air tanah jika berada di zona risiko tinggi. Terdapat form lapor gejala dengan *rate-limiting* (maksimal satu laporan/IP per 24 jam).
*   **Modul 3 - Dashboard Admin (Puskesmas/Pemkot)**: Pusat kendali visual yang menampilkan *Health Heat Map* (zona ditandai merah hanya jika jumlah laporan melampaui ambang batas), riwayat status genangan, serta indikator cakupan sumber air (Air Tanah vs PDAM) sebagai metrik wilayah prioritas edukasi.

---

## 4. Tech Stack (Satu Basis Kode)

RobSense menggunakan satu basis kode (Single Codebase) untuk menghindari kompleksitas yang tidak perlu bagi tim kecil dengan waktu terbatas:
*   **Framework Aplikasi**: Next.js (Fullstack & API Routes), dikonfigurasi sebagai PWA agar dapat dipasang di HP tanpa aplikasi *native* terpisah.
*   **Notifikasi**: Web Push API (tanpa layanan pihak ketiga berbayar).
*   **Basis Data**: PostgreSQL + Prisma ORM (cukup untuk skala data historis dan laporan warga).
*   **Peta Visual**: Leaflet.js yang ringan dan interaktif.
*   **Hosting**: Vercel (untuk iterasi cepat).

---

## 5. Timeline Eksekusi (3 Minggu)

Pengembangan MVP ini dieksekusi dengan target hingga 31 Agustus 2026:
*   **Minggu 1**: Pembangunan *Risk Scoring Engine*, skema database, dan tabel bobot amblesan.
*   **Minggu 2**: Pembangunan Portal Warga, peta status, *onboarding* notifikasi air, dan form lapor gejala.
*   **Minggu 3**: Pembangunan Dashboard Admin (*heat map*, ambang batas, tabel cakupan), uji coba *end-to-end*, rekam video demo, dan penulisan proposal final.

---

## 6. Batasan Klaim Impact Projection

Untuk menghindari kesan *overclaim* pada solusi perangkat lunak, batasan klaim telah ditetapkan:
*   **Dapat Diklaim (Terverifikasi Sistem)**: Jumlah warga di kecamatan risiko tinggi yang terjangkau peringatan dini, jumlah pendaftar anjuran pengurangan air tanah, dan ambang batas deteksi *syndromic surveillance*.
*   **Tidak Boleh Diklaim**: Penurunan laju amblesan tanah (proses geologis), penurunan kasus penyakit aktual, dan perubahan perilaku warga yang diklaim secara sepihak tanpa data sistem.

*(Catatan: Kami juga secara sengaja tidak membangun algoritma penjadwalan air dinamis, tracking open-rate notifikasi, maupun AI/Computer Vision demi menjaga kesederhanaan MVP)*.

---

## 7. Sumber Data & Atribusi Resmi (BMKG)

Sistem ini bergantung pada data terbuka pemerintah. Kami memberikan atribusi penuh kepada:
1. **BMKG**: Data Prakiraan Cuaca Umum (`api.bmkg.go.id`) dan Pasang Surut Maritim (`maritim.bmkg.go.id`). **RobSense mencantumkan dan mengakui BMKG sebagai sumber data utama peringatan dini cuaca**.
2. **Badan Geologi & ESDM**: Data laju penurunan muka tanah pesisir utara Semarang.
3. **BNPB**: Metodologi kalkulasi didasarkan pada Perka No. 2 Tahun 2012.

---

# 🚀 Panduan Instalasi & Menjalankan RobSense

Repositori Resmi: [https://github.com/zall18/robsense](https://github.com/zall18/robsense)

---

## 📋 Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem pengujian Anda telah memenuhi prasyarat berikut:
- **Node.js**: v18.17.0+ atau v20.x LTS (disarankan)
- **Package Manager**: `npm` (v9+) / `pnpm` / `yarn`
- **Database**: PostgreSQL (dapat menggunakan instance lokal atau cloud seperti **Supabase**)
- **Browser Modern**: Chrome / Edge / Firefox / Safari (Mendukung Service Worker untuk PWA)

---

## ⚙️ Langkah-langkah Instalasi Lokal

### 1. Kloning Repositori
Buka terminal dan jalankan:
```bash
git clone https://github.com/zall18/robsense.git
cd robsense
```

### 2. Instalasi Dependensi
Pasang seluruh dependensi proyek menggunakan npm:
```bash
npm install
```

### 3. Konfigurasi Environment Variable (`.env`)
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi koneksi database Anda di dalam file `.env`:
- `DATABASE_URL`: URI koneksi PostgreSQL / Supabase pooler (port 6543)
- `DIRECT_URL`: URI koneksi langsung PostgreSQL (port 5432)
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Kredensial login dashboard admin

### 4. Setup Database & Seed Data
Generate Prisma Client dan populate data inisial wilayah kecamatan Kota Semarang:
```bash
# 1. Sinkronisasi skema ke database
npx prisma db push

# 2. Seeding profil kecamatan, riwayat genangan, dan data awal
npx prisma db seed
```

### 5. Menjalankan Server Development
Jalankan dev server Next.js:
```bash
npm run dev
```
Buka peramban di:
- **Portal Publik Warga**: [http://localhost:3000/warga/peta](http://localhost:3000/warga/peta)
- **Dashboard Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Email: `admin@robsense.id`, Password: `admin123`)*

---

## 🧪 Pengujian Otomatis (Automated Testing)

RobSense dilengkapi dengan **37 skenario pengujian** otomatis menggunakan **Jest** dan **React Testing Library** yang mencakup:
- **Unit Testing**: *Weighted Risk Engine* BNPB No.2/2012, algoritma koordinat deterministik, dan autentikasi admin.
- **Component Testing**: Komponen UI atomik, tombol interaktif, dan status badge.
- **Page Integration Testing**: Portal warga (Peta, Onboarding, Notifikasi, Lapor) dan Dashboard admin (History, Education Priority, Water Source Monitoring).

Jalankan seluruh test suite dengan:
```bash
npm test
```
*(Seluruh 13 test suite dikonfigurasi untuk pass 100% tanpa external database leak).*

Untuk pemeriksaan *static code analysis* dan *linter*:
```bash
npm run lint
```

---

## 📁 Struktur Direktori Proyek

```
robsense/
├── app/                  # Next.js App Router
│   ├── actions/          # Next.js Server Actions (Database mutation & queries)
│   ├── admin/            # Route terproteksi untuk Dashboard Puskesmas & Pemkot
│   ├── api/              # API Routes (BMKG sync, risk calculation, webhooks)
│   ├── components/       # Komponen UI bersama (MapWrapper, Badge, Topbar, dll.)
│   └── warga/            # Portal publik warga (PWA, Peta, Form Lapor, Edukasi)
├── lib/                  # Logika Bisnis Inti & Algoritma
│   ├── riskEngine.ts     # Multi-Factor Weighted Risk Scoring Engine (BNPB)
│   ├── fetchWeather.ts   # Integrasi API Prakiraan BMKG & BMKG Maritim
│   ├── geo.ts            # Utilitas spasial & jitter deterministik koordinat
│   └── prisma.ts         # Singleton Prisma Client & Database Pooler
├── prisma/               # Skema Database & Migrasi
│   ├── schema.prisma     # Definisi model PostgreSQL
│   └── seed.ts           # Seeder profil kecamatan Kota Semarang
├── __tests__/            # Automated Test Suites (Jest & RTL)
│   ├── components/       # Pengujian komponen visual
│   ├── pages/            # Pengujian integrasi alur halaman
│   └── utils/            # Pengujian matematis algoritma & keamanan
└── public/               # Asset statis, ikon PWA, manifest, & service worker
```

---

## 📄 Lisensi & Hak Cipta
Dikembangkan oleh Tim RobSense untuk **Diponegoro Software Development Competition (DSDC) ANFORCOM 2026**.
Seluruh data publik cuaca mengacu pada atribusi resmi BMKG Republik Indonesia.

