import React from 'react';
import dynamic from 'next/dynamic';
import prisma from '@/lib/prisma';
import { assignCoordinates } from '@/app/utils/geo';

import ClientMap from './ClientMap';
import SearchInput from './SearchInput';

import Link from 'next/link';
import { cookies } from 'next/headers';

export const revalidate = 0; // Dynamic route

export default async function WargaPetaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  let cookieKecamatan: string | undefined;
  let cookieAirType: string | undefined;
  try {
    const cookieStore = await cookies();
    cookieKecamatan = cookieStore.get('userKecamatan')?.value ? decodeURIComponent(cookieStore.get('userKecamatan')!.value) : undefined;
    cookieAirType = cookieStore.get('userAirType')?.value ? decodeURIComponent(cookieStore.get('userAirType')!.value) : undefined;
  } catch {
    // Graceful fallback for testing or static pre-rendering
  }

  const q = params.q?.toLowerCase();
  const activeKecamatan = q || cookieKecamatan?.toLowerCase();

  // Ambil data terbaru dari DataCuacaGenangan
  const updates = await prisma.dataCuacaGenangan.findMany({
    orderBy: { timestamp: 'desc' },
    take: 6
  });

  // Prioritaskan update untuk kecamatan pengguna di urutan teratas
  if (activeKecamatan) {
    updates.sort((a, b) => {
      const aIsUser = a.kecamatan.toLowerCase().includes(activeKecamatan);
      const bIsUser = b.kecamatan.toLowerCase().includes(activeKecamatan);
      if (aIsUser && !bIsUser) return -1;
      if (!aIsUser && bIsUser) return 1;
      return 0;
    });
  }

  // Ambil laporan warga untuk peta (filter jika ada pencarian/kecamatan aktif)
  const filterKecamatan = q;
  const laporanWargaRaw = await prisma.laporanWarga.findMany({
    where: {
      isVerified: true,
      ...(filterKecamatan ? { kecamatan: { contains: filterKecamatan, mode: 'insensitive' } } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  
  const reports = assignCoordinates(laporanWargaRaw);

  // Hitung jumlah Tinggi, Sedang, Rendah
  const count = {
    tinggi: updates.filter(u => u.statusRisiko === 'Tinggi').length,
    sedang: updates.filter(u => u.statusRisiko === 'Sedang').length,
    rendah: updates.filter(u => u.statusRisiko === 'Rendah').length,
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F8F9FB] p-6 pb-8 pt-8">
      
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Peta Status Risiko</h1>
      <p className="text-sm text-gray-600 mb-4">Pantau tingkat risiko wilayah secara real-time.</p>
      
      {/* Personalized User District Banner */}
      {activeKecamatan && (
        <div className="bg-gradient-to-r from-blue-900 to-[#254B94] text-white rounded-[12px] p-4 mb-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-white/20 px-2 py-0.5 rounded">
                Wilayah Pantauan Anda
              </span>
              {cookieAirType && (
                <span className="text-[10px] font-bold bg-white/20 text-blue-100 px-2 py-0.5 rounded">
                  💧 {cookieAirType}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold capitalize">
              Kecamatan {activeKecamatan}
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Menampilkan titik pantau dan status risiko aktif di wilayahmu.
            </p>
          </div>
          {q && (
            <Link 
              href="/warga/peta" 
              className="text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-2"
            >
              Reset Filter
            </Link>
          )}
        </div>
      )}

      {/* Search Input */}
      <SearchInput />

      {/* Map Area */}
      <div className="h-[250px] w-full bg-gray-200 rounded-[12px] mb-6 overflow-hidden relative border border-gray-300 shadow-sm z-0">
         <ClientMap reports={reports} />
      </div>

      {/* Legends */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 flex flex-col items-center justify-center p-3 border border-gray-200 bg-white rounded-[10px] shadow-sm">
          <div className="w-8 h-8 rounded-full border-[3px] border-[#FDE0E0] bg-[#EF4444] mb-2 flex items-center justify-center relative">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-xs font-semibold text-gray-800">Tinggi</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3 border border-gray-200 bg-white rounded-[10px] shadow-sm">
          <div className="w-8 h-8 rounded-full border-[3px] border-[#FEF3C7] bg-[#F59E0B] mb-2 flex items-center justify-center relative">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-xs font-semibold text-gray-800">Sedang</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3 border border-gray-200 bg-white rounded-[10px] shadow-sm">
          <div className="w-8 h-8 rounded-full border-[3px] border-[#DCFCE7] bg-[#10B981] mb-2 flex items-center justify-center relative">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-xs font-semibold text-gray-800">Rendah</span>
        </div>
      </div>

      {/* Pembaruan Terakhir */}
      <div className="bg-white border border-gray-200 rounded-[12px] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-[#254B94]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-lg font-bold text-gray-900">Pembaruan Terakhir</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          {updates.map((update, idx) => (
            <div key={update.id} className={`flex justify-between items-center ${idx !== updates.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Kecamatan {update.kecamatan}</p>
                <p className="text-xs text-gray-500 mt-1">Status saat ini {update.statusRisiko}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  update.statusRisiko === 'Tinggi' ? 'bg-[#FDE0E0] text-[#EF4444]' :
                  update.statusRisiko === 'Sedang' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                  'bg-[#DCFCE7] text-[#10B981]'
                }`}>
                  {update.statusRisiko}
                </span>
              </div>
            </div>
          ))}
          {updates.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-4">Belum ada pembaruan data cuaca.</p>
          )}
        </div>
      </div>

    </div>
  );
}
