import React from 'react';
import dynamic from 'next/dynamic';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { assignCoordinates } from '@/app/utils/geo';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

import ClientMap from './ClientMap';

export const revalidate = 0; // Dynamic route

export default async function WargaPetaPage() {
  // Ambil data terbaru dari DataCuacaGenangan
  const updates = await prisma.dataCuacaGenangan.findMany({
    orderBy: { timestamp: 'desc' },
    take: 4
  });

  // Ambil laporan warga untuk peta
  const laporanWargaRaw = await prisma.laporanWarga.findMany({
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
      <p className="text-sm text-gray-600 mb-6">Pantau tingkat risiko wilayah secara real-time.</p>
      
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Cari Kecamatan..." 
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-[10px] leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#254B94] focus:border-[#254B94] sm:text-sm"
        />
      </div>

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
