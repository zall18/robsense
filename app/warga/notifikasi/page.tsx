'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type DemoState = 'Tinggi' | 'Sedang' | 'Rendah';

export default function WargaNotifikasiPage() {
  const [demoState, setDemoState] = useState<DemoState>('Tinggi');

  return (
    <div className="flex flex-col min-h-full bg-[#F8F9FB] p-6 pb-8 pt-8 relative">
      
      {/* Demo Controls (Khusus Presentasi) */}
      <div className="absolute top-2 right-2 flex bg-white rounded-full shadow-md border border-gray-200 overflow-hidden z-50 text-[10px] font-bold">
        <button 
          onClick={() => setDemoState('Tinggi')}
          className={`px-3 py-1.5 ${demoState === 'Tinggi' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Demo: Merah
        </button>
        <button 
          onClick={() => setDemoState('Sedang')}
          className={`px-3 py-1.5 border-l border-r border-gray-200 ${demoState === 'Sedang' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Demo: Oranye
        </button>
        <button 
          onClick={() => setDemoState('Rendah')}
          className={`px-3 py-1.5 ${demoState === 'Rendah' ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Demo: Hijau
        </button>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifikasi</h1>
      
      {/* Peringatan Mendesak (Tergantung Demo State) */}
      {demoState === 'Tinggi' && (
        <div className="border border-red-500 rounded-[12px] bg-white p-5 mb-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Peringatan Mendesak</span>
              <h2 className="text-red-600 text-lg font-bold mt-0.5">Siaga Rob Tinggi</h2>
            </div>
          </div>
          
          <p className="text-sm font-bold text-gray-900 mb-4 leading-relaxed">
            Penyebab Utama: Akibat penurunan muka tanah yang signifikan di wilayah pesisir Utara, dipadukan dengan siklus pasang surut maksimum (Supermoon).
          </p>

          <div className="bg-[#F4F5FB] rounded-lg p-4 mb-5">
             <div className="flex items-center gap-2 mb-2 text-[#254B94]">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <span className="text-xs font-bold">Tindakan Pencegahan</span>
             </div>
             <p className="text-xs text-gray-600 leading-relaxed">
               Mari kurangi penggunaan air tanah secara masif untuk mencegah dampak penurunan muka tanah lebih lanjut. Segera beralih ke layanan air perpipaan (PAM).
             </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/warga/peta" className="w-full bg-[#254B94] text-white text-center text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              Lihat Peta Terdampak
            </Link>
            <button className="w-full border border-gray-300 text-[#254B94] text-center text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 bg-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      )}

      {demoState === 'Sedang' && (
        <div className="border border-orange-500 rounded-[12px] bg-white p-5 mb-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Perhatian</span>
              <h2 className="text-orange-600 text-lg font-bold mt-0.5">Waspada Genangan</h2>
            </div>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-4 leading-relaxed">
            Terpantau ada peningkatan debit air di beberapa wilayah pesisir. Harap waspada akan potensi genangan ringan.
          </p>
        </div>
      )}

      {demoState === 'Rendah' && (
        <div className="border border-green-500 rounded-[12px] bg-white p-5 mb-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Informasi</span>
              <h2 className="text-green-600 text-lg font-bold mt-0.5">Kondisi Aman</h2>
            </div>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-4 leading-relaxed">
            Tidak ada indikasi genangan rob dalam waktu dekat. Kondisi pasang laut normal.
          </p>
        </div>
      )}


      {/* Riwayat Peringatan (Statis untuk Demo) */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">Riwayat Peringatan</h3>
      
      <div className="flex flex-col gap-3">
        {/* Item 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-gray-900">Pembersihan Saluran Air</h4>
              <span className="text-[10px] font-semibold text-gray-500">Kemarin</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Jadwal gotong royong pembersihan saluran air di RT 04/RW 02 untuk mengantisipasi musim hujan.
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-gray-900">Perbaikan Pompa Air</h4>
              <span className="text-[10px] font-semibold text-gray-500">3 Hari Lalu</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Informasi perbaikan rumah pompa Sentiong. Kapasitas pompa berkurang 30% selama 2 hari ke depan.
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-gray-900">Status Siaga Rob Dicabut</h4>
              <span className="text-[10px] font-semibold text-gray-500">1 Minggu Lalu</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Kondisi pasang laut telah kembali normal. Pintu air utara beroperasi optimal.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
