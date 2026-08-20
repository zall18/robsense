'use client';

import React, { useState } from 'react';
import { Info, Map, Bell, PlusSquare } from 'lucide-react';
import InstallButton from '../components/InstallButton';
import Image from 'next/image';

export default function WargaTentangPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F8F9FB] p-6 pb-8 pt-8">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 text-[#254B94]">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7 2 5.5 5 5 8c0 3 2 5 2 7 0 2-1 4-1 4s2 1 6 1 6-1 6-1-1-2-1-4c0-2 2-4 2-7 0-3-1.5-6-7-6z" />
        </svg>
        <h1 className="text-xl font-bold">Tentang RobSense</h1>
        <Info className="w-5 h-5 ml-auto text-[#254B94]" />
      </div>

      {/* Card 1: Logo & Vision */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#254B94] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 14h1m1 0h1m-3 4h1m1 0h1m-3-8h1m1 0h1M11 6h1m1 0h1m-3 4h1m1 0h1m-3 4h1m1 0h1m-3 4h1m1 0h1M18 6h1m1 0h1m-3 4h1m1 0h1m-3 4h1m1 0h1m-3 4h1m1 0h1"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 leading-tight">ROBSENSE: Dari Akar Masalah Air Tanah ke Kota Rendah Risiko</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          RobSense adalah platform pemantauan dan peringatan dini berbasis data yang dirancang untuk membantu masyarakat dan pemerintah mengelola risiko banjir pesisir (rob) yang diperparah oleh penurunan muka tanah akibat ekstraksi air tanah berlebih. Kami memvisualisasikan data kompleks menjadi informasi yang dapat ditindaklanjuti.
        </p>
      </div>

      {/* Tombol Instalasi PWA */}
      <InstallButton />

      {/* Card 2: Panduan Cepat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Panduan Cepat</h3>
        
        <div className="flex flex-col gap-3">
          <div className="bg-[#F4F5FB] rounded-lg p-3 flex flex-col gap-1.5">
            <Map className="w-4 h-4 text-[#254B94]" />
            <h4 className="text-xs font-bold text-gray-900">Pantau Risiko</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">Lihat peta zonasi risiko banjir rob di area Anda.</p>
          </div>
          
          <div className="bg-[#F4F5FB] rounded-lg p-3 flex flex-col gap-1.5">
            <Bell className="w-4 h-4 text-[#254B94]" />
            <h4 className="text-xs font-bold text-gray-900">Terima Notifikasi</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">Dapatkan peringatan dini saat tingkat air naik.</p>
          </div>
          
          <div className="bg-[#F4F5FB] rounded-lg p-3 flex flex-col gap-1.5">
            <PlusSquare className="w-4 h-4 text-[#254B94]" />
            <h4 className="text-xs font-bold text-gray-900">Lapor Kondisi</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">Laporkan kejadian genangan untuk verifikasi data.</p>
          </div>
        </div>
      </div>

      {/* Card 3: Penting untuk Diketahui */}
      <div className="bg-[#EBF1FF] rounded-xl shadow-sm border border-blue-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#254B94] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900">Penting untuk Diketahui</h3>
        </div>
        <ul className="text-[11px] text-[#254B94] font-medium leading-relaxed space-y-2">
          <li><strong>Sumber Data:</strong> Peringatan pasang surut mengacu pada data BMKG dan stasiun observasi lokal.</li>
          <li><strong>Privasi:</strong> Laporan kejadian genangan dikumpulkan secara anonim untuk melindungi privasi pengguna.</li>
          <li><strong>Solusi:</strong> Pemantauan adalah langkah awal; solusi jangka panjang membutuhkan konservasi air tanah.</li>
        </ul>
      </div>

      {/* Card 4: FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h3>
        
        <div className="flex flex-col gap-2">
          {/* FAQ Item 1 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              onClick={() => toggleFaq(1)}
              className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
            >
              <span className="text-xs font-bold text-gray-800">Bagaimana RobSense menentukan zona risiko?</span>
              <svg className={`w-4 h-4 text-gray-500 transform transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {openFaq === 1 && (
              <div className="px-4 pb-3 bg-white text-[10px] text-gray-500">
                Sistem menggunakan algoritma yang menggabungkan elevasi dataran, prakiraan pasang surut maksimum, curah hujan, serta rekam historis genangan (termasuk laju penurunan muka tanah).
              </div>
            )}
          </div>
          
          {/* FAQ Item 2 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              onClick={() => toggleFaq(2)}
              className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
            >
              <span className="text-xs font-bold text-gray-800">Apakah aplikasi ini gratis digunakan?</span>
              <svg className={`w-4 h-4 text-gray-500 transform transition-transform ${openFaq === 2 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {openFaq === 2 && (
              <div className="px-4 pb-3 bg-white text-[10px] text-gray-500">
                Ya, RobSense sepenuhnya gratis dan ditujukan untuk pelayanan publik masyarakat luas.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
