import React from 'react';
import { HelpCircle, ChevronRight, BookOpen, Mail, MessageSquare } from 'lucide-react';

export default function BantuanPage() {
  return (
    <div className="max-w-4xl mx-auto w-full pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <HelpCircle className="w-8 h-8 text-blue-600" /> Pusat Bantuan
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Temukan panduan penggunaan dan jawaban untuk pertanyaan umum seputar Robsense.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-blue-300 transition-colors cursor-pointer">
          <BookOpen className="w-10 h-10 text-blue-500 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Panduan Pengguna</h3>
          <p className="text-sm text-gray-500">Pelajari cara menggunakan semua fitur Dashboard.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-blue-300 transition-colors cursor-pointer">
          <MessageSquare className="w-10 h-10 text-green-500 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">FAQ</h3>
          <p className="text-sm text-gray-500">Pertanyaan yang sering diajukan oleh Admin.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-blue-300 transition-colors cursor-pointer">
          <Mail className="w-10 h-10 text-orange-500 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Hubungi Dukungan</h3>
          <p className="text-sm text-gray-500">Laporkan masalah atau bug teknis.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800">Pertanyaan Umum (FAQ)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-5">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" /> Bagaimana cara memverifikasi laporan warga?
            </h4>
            <p className="text-sm text-gray-600 mt-2 ml-6">
              Buka menu <b>Laporan Warga</b>, cari laporan yang ingin diverifikasi, lalu klik tombol "Verifikasi" di kolom Aksi. Anda juga dapat memilih tingkat keparahan (Tinggi, Sedang, Rendah) yang akan memengaruhi warna klaster di Peta Kesehatan.
            </p>
          </div>
          <div className="p-5">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" /> Dari mana data Cuaca & Genangan berasal?
            </h4>
            <p className="text-sm text-gray-600 mt-2 ml-6">
              Data ditarik secara langsung (real-time) melalui integrasi API publik BMKG. Sistem secara otomatis menghitung tingkat kerentanan dengan memadukan data cuaca BMKG dan status penurunan muka air tanah (amblesan).
            </p>
          </div>
          <div className="p-5">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" /> Apa fungsi toggle Pencegahan Alarm Palsu?
            </h4>
            <p className="text-sm text-gray-600 mt-2 ml-6">
              Saat diaktifkan, sistem akan memfilter dan menyembunyikan laporan-laporan terisolasi (kurang dari 3 laporan di satu kecamatan) untuk memfokuskan perhatian pada area yang benar-benar berstatus kritis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
