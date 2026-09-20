import React from 'react';
import prisma from '@/lib/prisma';
import { Building2, Droplets, AlertTriangle, Filter } from 'lucide-react';
import Badge from '@/app/components/Badge';
import SelectFilter from '@/app/admin/components/SelectFilter';
import EducationActionButton from '@/app/admin/components/EducationActionButton';

export default async function EducationPriorityPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const risiko = params.risiko;

  // Fetch profiles
  let profiles = await prisma.profilKecamatan.findMany({
    where: risiko ? { tingkatRisiko: risiko } : undefined
  });

  const riskWeight: Record<string, number> = {
    'Tinggi': 3,
    'Sedang': 2,
    'Rendah': 1
  };

  profiles.sort((a, b) => {
    const riskA = riskWeight[a.tingkatRisiko] || 0;
    const riskB = riskWeight[b.tingkatRisiko] || 0;
    
    if (riskA !== riskB) {
      return riskB - riskA;
    }
    
    const coverageA = a.pendaftarEdukasi / a.totalPopulasi;
    const coverageB = b.pendaftarEdukasi / b.totalPopulasi;
    return coverageA - coverageB;
  });

  const totalKecamatan = profiles.length;
  const totalCoverageSum = profiles.reduce((sum, p) => sum + (p.pendaftarEdukasi / p.totalPopulasi), 0);
  const rataRataCakupan = totalKecamatan > 0 ? (totalCoverageSum / totalKecamatan) * 100 : 0;
  const prioritasUtama = totalKecamatan > 0 ? profiles[0].namaKecamatan : '-';

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Daftar Prioritas Edukasi
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm max-w-3xl">
          Rekomendasi alokasi sumber daya berbasis data. Daftar kecamatan di bawah ini diprioritaskan berdasarkan kombinasi tingginya risiko banjir dan rendahnya tingkat registrasi layanan air.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[12px] p-6 border border-[var(--color-border-base)] shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-4">
            <Building2 className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Kecamatan Teridentifikasi</span>
          </div>
          <div className="text-4xl font-medium text-[var(--color-text-primary)]">{totalKecamatan}</div>
        </div>
        
        <div className="bg-white rounded-[12px] p-6 border border-[var(--color-border-base)] shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-4">
            <Droplets className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rata-Rata Cakupan Pendaftar</span>
          </div>
          <div className="text-4xl font-medium text-[var(--color-text-primary)]">{rataRataCakupan.toFixed(1)}%</div>
        </div>

        <div className="bg-white rounded-[12px] p-6 border border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)] relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-1 h-3 bg-red-600 rounded-sm"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800">Kecamatan Prioritas Utama</span>
          </div>
          <div className="text-4xl font-medium text-[var(--color-text-primary)] relative z-10">{prioritasUtama}</div>
          <AlertTriangle className="absolute -right-2 -bottom-4 w-24 h-24 text-gray-100 stroke-gray-200" strokeWidth={1} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[12px] border border-[var(--color-border-base)] overflow-hidden shadow-sm">
        
        <div className="px-6 py-4 border-b border-[var(--color-border-base)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="font-semibold text-base text-[var(--color-text-primary)]">Tabel Skor Prioritas</h2>
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] border-b border-[var(--color-border-base)] bg-[#F8F9FB]">
              <tr>
                <th className="px-6 py-4 text-center w-24">Peringkat</th>
                <th className="px-6 py-4">Kecamatan</th>
                <th className="px-6 py-4 text-center">Tingkat Risiko</th>
                <th className="px-6 py-4 w-48">Cakupan Registrasi</th>
                <th className="px-6 py-4">Skor Prioritas</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-base)]">
              {profiles.map((row, index) => {
                const coverage = (row.pendaftarEdukasi / row.totalPopulasi) * 100;
                
                let priorityStatus = 'Sedang';
                let statusColor = 'text-gray-500';
                
                if (row.tingkatRisiko === 'Tinggi' && coverage < 10) {
                   priorityStatus = 'Kritis';
                   statusColor = 'text-red-600 font-semibold';
                } else if (row.tingkatRisiko === 'Tinggi' || (row.tingkatRisiko === 'Sedang' && coverage < 15)) {
                   priorityStatus = 'Tinggi';
                   statusColor = 'text-orange-600 font-semibold';
                }

                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-center">
                      <span className={index === 0 ? "text-red-500" : "text-gray-600"}>{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--color-text-primary)]">{row.namaKecamatan}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Badge text={row.tingkatRisiko} variant={row.tingkatRisiko} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-600 w-8">{coverage.toFixed(0)}%</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${coverage < 10 ? 'bg-red-600' : coverage < 20 ? 'bg-orange-600' : 'bg-[#3B82F6]'}`} style={{ width: `${Math.min(coverage, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${statusColor}`}>
                      {priorityStatus}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <EducationActionButton 
                        kecamatan={row.namaKecamatan}
                        status={priorityStatus}
                        coverage={coverage}
                      />
                    </td>
                  </tr>
                );
              })}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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
