import React from 'react';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Droplet, ArrowUpRight, ArrowRight, Download, Filter } from 'lucide-react';
import Badge from '@/app/components/Badge';
import SelectFilter from '@/app/admin/components/SelectFilter';
import ExportButton from '@/app/admin/components/ExportButton';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function WaterSourcePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const risiko = params.risiko;

  const profiles = await prisma.profilKecamatan.findMany({
    where: risiko ? { tingkatRisiko: risiko } : undefined
  });
  
  // Hitung rata-rata
  const totalKecamatan = profiles.length;
  let totalAirTanah = 0;
  let totalPopulasi = 0;
  
  profiles.forEach(p => {
    totalAirTanah += p.penggunaAirTanah;
    totalPopulasi += p.totalPopulasi;
  });
  
  const rataRataAirTanah = totalPopulasi > 0 ? (totalAirTanah / totalPopulasi) * 100 : 0;
  const rataRataPDAM = 100 - rataRataAirTanah;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
          Indikator Cakupan Sumber Air
        </h1>
        <div className="flex items-center gap-2 text-[#3B82F6] text-sm font-medium">
          <Droplet className="w-4 h-4" />
          <span>Cakupan Wilayah Prioritas Edukasi</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Sumber Air Tanah */}
        <div className="bg-white rounded-[12px] p-6 border border-[var(--color-border-base)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Sumber Air Tanah</span>
            <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center">
              <Droplet className="w-4 h-4 text-[#92400E]" />
            </div>
          </div>
          <div className="text-4xl font-semibold text-[var(--color-text-primary)] mb-2">{rataRataAirTanah.toFixed(1)}%</div>
          <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            +2.1% (30 hari terakhir)
          </div>
        </div>
        
        {/* Card 2: Layanan PDAM */}
        <div className="bg-white rounded-[12px] p-6 border border-[var(--color-border-base)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Layanan PDAM</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M2 22 22 2"/><path d="M14 2 2 14"/><path d="m14 10 6 6-4 4-6-6"/></svg>
            </div>
          </div>
          <div className="text-4xl font-semibold text-[var(--color-text-primary)] mb-2">{rataRataPDAM.toFixed(1)}%</div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <ArrowRight className="w-3 h-3" />
            Stabil (30 hari terakhir)
          </div>
        </div>

        {/* Card 3: Indeks Kerentanan Global */}
        <div className="bg-white rounded-[12px] p-6 border border-[var(--color-border-base)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Indeks Kerentanan Global</span>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Tinggi</span>
          </div>
          
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden flex mb-3">
            <div className="bg-[#92400E] h-full" style={{ width: `${rataRataAirTanah}%` }}></div>
            <div className="bg-[#2563EB] h-full" style={{ width: `${rataRataPDAM}%` }}></div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-medium">
            <div className="flex items-center gap-1.5 text-gray-600">
              <div className="w-2 h-2 rounded-full bg-[#92400E]"></div>
              Air Tanah (Ketergantungan Tinggi)
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
              PDAM (Kapasitas Terbatas)
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[12px] border border-[var(--color-border-base)] overflow-hidden shadow-sm">
        
        <div className="px-6 py-5 border-b border-[var(--color-border-base)] flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg text-[var(--color-text-primary)]">Rincian Wilayah Prioritas Edukasi</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Distribusi pemakaian sumber air per distrik (Kecamatan).</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[180px]">
              <SelectFilter
                paramName="risiko"
                placeholder="Semua Risiko"
                options={[
                  { label: 'Risiko Tinggi', value: 'Tinggi' },
                  { label: 'Risiko Sedang', value: 'Sedang' },
                  { label: 'Risiko Rendah', value: 'Rendah' }
                ]}
                icon={<Filter className="w-4 h-4" />}
              />
            </div>
            <ExportButton data={profiles} filename="sumber_air" className="flex items-center gap-2 text-sm text-white font-medium bg-[#2563EB] px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm h-[38px]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] border-b border-[var(--color-border-base)]">
              <tr>
                <th className="px-6 py-4">Kecamatan</th>
                <th className="px-6 py-4">Tingkat Risiko</th>
                <th className="px-6 py-4 w-1/3">Rasio Sumber Air (Tanah vs PDAM)</th>
                <th className="px-6 py-4 text-center">% Air Tanah</th>
                <th className="px-6 py-4 text-center">% PDAM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-base)]">
              {profiles.map((row) => {
                const pctTanah = row.totalPopulasi > 0 ? (row.penggunaAirTanah / row.totalPopulasi) * 100 : 0;
                const pctPdam = 100 - pctTanah;
                
                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-[var(--color-text-primary)]">{row.namaKecamatan}</td>
                    <td className="px-6 py-5">
                      <Badge text={row.tingkatRisiko} variant={row.tingkatRisiko} />
                    </td>
                    <td className="px-6 py-5">
                       <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden flex">
                        <div className="bg-[#92400E] h-full" style={{ width: `${pctTanah}%` }}></div>
                        <div className="bg-[#2563EB] h-full" style={{ width: `${pctPdam}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-medium text-[#92400E]">
                      {pctTanah.toFixed(1)}%
                    </td>
                    <td className="px-6 py-5 text-center font-medium text-[#2563EB]">
                      {pctPdam.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data profil kecamatan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
