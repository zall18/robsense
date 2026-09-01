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

# Panduan Instalasi RobSense (`zall18/robsense`)

Repositori GitHub: [https://github.com/zall18/robsense](https://github.com/zall18/robsense)

---

## 📋 Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem Anda telah terpasang:
- **Git** (versi terbaru)
- **Node.js** (LTS disarankan, v18+ / v20+) & **npm** / **yarn** / **pnpm** *(jika project berbasis JavaScript/TypeScript/Web/IoT Dashboard)*
- **Python 3.9+** & **pip** *(jika project berbasis Backend/AI/IoT Python)*
- **Arduino IDE / PlatformIO** *(jika terdapat modul firmware microcontroller/ESP32/Arduino)*

---

## 🚀 Langkah-langkah Instalasi

### 1. Kloning Repositori
Buka terminal / command prompt dan jalankan perintah:

```bash
git clone https://github.com/zall18/robsense.git
cd robsense
```

---

### 2. Instalasi Dependensi (Sesuai Stack Project)

#### Opsi A: Jika Berbasis Node.js / JavaScript / TypeScript
Jika di dalam repository terdapat file `package.json`:

```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
```

#### Opsi B: Jika Berbasis Python
Jika di dalam repository terdapat file `requirements.txt` atau `pyproject.toml`:

```bash
# 1. Buat virtual environment (opsional namun disarankan)
python -m venv venv

# Aktifkan virtual environment:
# - Linux/macOS:
source venv/bin/activate
# - Windows (CMD/PowerShell):
venv\Scripts\activate

# 2. Install dependensi
pip install -r requirements.txt
```

---

### 3. Konfigurasi Environment (`.env`)

Jika project membutuhkan variabel lingkungan (database, port, API keys, atau MQTT broker untuk sensor IoT):

1. Duplikasi file konfigurasi contoh (jika tersedia):
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan konfigurasi pada file `.env` sesuai kebutuhan server/perangkat Anda.

---

### 4. Menjalankan Aplikasi

#### Untuk Aplikasi Node.js / Web:
```bash
# Mode development
npm run dev
# atau
npm start
```
Akses melalui browser di `http://localhost:3000` atau port yang ditentukan.

#### Untuk Backend / Script Python:
```bash
python app.py
# atau
python main.py
```

---

### 5. (Opsional) Setup Microcontroller / Sensor IoT
Jika repository menyertakan kode firmware untuk Arduino / ESP8266 / ESP32:
1. Buka folder sketch firmware di **Arduino IDE** atau **VS Code (PlatformIO)**.
2. Pasang library sensor yang dibutuhkan (melalui *Library Manager*).
3. Sesuaikan konfigurasi WiFi SSID, Password, dan IP Server / Endpoint MQTT.
4. Hubungkan board ke port USB dan lakukan **Upload**.

---

## 🛠️ Troubleshooting

- **Port Conflict / Error `EADDRINUSE`:**  
  Pastikan port default aplikasi tidak digunakan oleh layanan lain atau ubah port di `.env`.
- **Modul/Library Tidak Ditemukan:**  
  Jalankan ulang `npm install` atau `pip install -r requirements.txt`.
- **Izin Akses Git:**  
  Pastikan koneksi internet stabil dan URL repository dapat diakses publik.

---

## 📄 Lisensi & Kontribusi
Silakan buka *Issue* atau kirim *Pull Request* pada repositori resmi jika Anda menemukan bug atau ingin menambahkan fitur baru.
