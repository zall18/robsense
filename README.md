# 🌊 RobSense
> **"Dari Akar Masalah Air Tanah ke Kota Rendah Risiko"**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=flat&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**RobSense** adalah platform GovTech dan *Circular Water Awareness* yang dirancang untuk mengatasi akar masalah amblesan tanah di wilayah pesisir Kota Semarang. Proyek ini dikembangkan untuk kompetisi **Diponegoro Software Development Competition (DSDC) ANFORCOM 2026** di bawah subtema *Eco-Health Monitoring & Early Warning Platforms*.

---

## 🌐 Live Demo & Akses

Prototipe aplikasi telah di-deploy dan dapat diakses melalui tautan berikut:

*   🖥️ **Dashboard Admin (Pemkot/Puskesmas)**: [https://robsense-of56.vercel.app/admin](https://robsense-of56.vercel.app/admin)
*   📱 **Portal Warga (PWA & Instalasi)**: [https://robsense-of56.vercel.app/install](https://robsense-of56.vercel.app/install)
*   🌐 **Akses Lokal (Warga)**: `http://localhost:3000/warga/onboarding`

---

## 📖 Latar Belakang Masalah

Banjir rob di pesisir utara Jawa (khususnya Semarang) terus memburuk dan berdampak langsung pada kesehatan lingkungan (Eco-Health). Alih-alih hanya berfokus pada infrastruktur hilir (pompa & tanggul), RobSense membidik penyebab utama dari sisi hulu: **Eksploitasi Air Tanah Berlebih (menyumbang 74-82% penyebab amblesan tanah)**.

RobSense memanfaatkan sistem Peringatan Dini (Early Warning System) banjir rob sebagai instrumen untuk mengedukasi dan mendorong perubahan perilaku masyarakat agar beralih ke praktik **Sirkularitas Air** (*rainwater harvesting* & efisiensi air).

---

## ✨ Fitur Utama (MVP)

Aplikasi ini menggunakan pendekatan **Single Codebase** yang membagi fungsionalitas menjadi 3 modul utama:

### 1. Risk Scoring Engine (Backend)
*   Berfungsi sebagai *Single Source of Truth*.
*   Mengkalkulasi tingkat risiko per kecamatan dengan menggabungkan data pasang surut/cuaca BMKG dengan bobot laju amblesan tanah (Land Subsidence).

### 2. Portal Warga (Mobile PWA)
*   **Peta Risiko Publik**: Visualisasi zonasi risiko (Merah/Kuning/Hijau) tanpa perlu otentikasi.
*   **Targeted Onboarding**: Pendaftaran peringatan dini yang mengumpulkan data sumber air utama warga (Air Tanah vs PDAM).
*   **Sirkular Edukasi**: Memberikan instruksi pengurangan ekstraksi air tanah khusus bagi pengguna sumur bor di zona rawan.
*   **Lapor Gejala (Crowdsource)**: Pelaporan indikasi penyakit lingkungan (seperti Demam/Gatal) dalam 2 klik. Dilengkapi sistem *Rate-Limiting* (1 laporan/IP/24 jam) untuk mencegah manipulasi data.

### 3. Dashboard Admin (Desktop Web)
*   **Health Heat Map**: Pemetaan klaster penyakit lingkungan untuk respons taktis puskesmas. Menggunakan ambang batas *syndromic surveillance* untuk mencegah *false alarm*.
*   **Prioritas Edukasi**: Tabel pengurutan kecamatan berdasarkan tingkat risiko dan cakupan adopsi air sirkular.
*   **Indikator Circular Economy**: *Headline metrics* yang melacak rasio penggunaan Air Tanah vs PDAM di wilayah prioritas.

---

## 🛠️ Tech Stack & Arsitektur

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, API Routes, Server Actions)
*   **Database**: PostgreSQL di-[host] pada [Supabase](https://supabase.com/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Maps**: [Leaflet.js](https://leafletjs.com/) (via `react-leaflet`)
*   **Deployment**: [Vercel](https://vercel.com/)
*   **PWA**: `next-pwa`

---

## 🚀 Panduan Instalasi (Development)

Untuk menjalankan proyek ini di mesin lokal, ikuti langkah-langkah berikut:

### Prasyarat
*   Node.js (v18 atau lebih baru)
*   NPM / Yarn / pnpm
*   Akun Supabase (atau PostgreSQL lokal)

### Langkah Instalasi

1. **Clone repositori**
   ```bash
   git clone [https://github.com/username-kamu/robsense.git](https://github.com/username-kamu/robsense.git)
   cd robsense