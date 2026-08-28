import React from 'react';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Calendar, Download, TrendingUp, AlertTriangle, ArrowRight, MoreVertical, Filter } from 'lucide-react';
import Badge from '@/app/components/Badge';
import SelectFilter from '@/app/admin/components/SelectFilter';
import ExportButton from '@/app/admin/components/ExportButton';
import ManualReportButton from '@/app/admin/components/ManualReportButton';
import MapWrapper from '@/app/components/MapWrapper';
import Link from 'next/link';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const kecamatan = params.kecamatan;

  const [profiles, riwayat] = await Promise.all([
    prisma.profilKecamatan.findMany(),
    prisma.dataCuacaGenangan.findMany({
      where: kecamatan ? { kecamatan } : undefined,
      orderBy: { timestamp: 'desc' },
      take: 5
    })
  ]);

  const distinctKecamatan = await prisma.profilKecamatan.findMany({
    select: { namaKecamatan: true },
    orderBy: { namaKecamatan: 'asc' }
  });
  
  const kecamatanOptions = distinctKecamatan.map(k => ({
    label: `Kec. ${k.namaKecamatan}`,
    value: k.namaKecamatan
  }));

  // Hitung agregat Distribusi Sumber Air
  let totalAirTanah = 0;
  let totalPopulasi = 0;
  
  profiles.forEach(p => {
    totalAirTanah += p.penggunaAirTanah;
    totalPopulasi += p.totalPopulasi;
  });
  
  const rataRataAirTanah = totalPopulasi > 0 ? (totalAirTanah / totalPopulasi) * 100 : 0;
  const rataRataPDAM = 100 - rataRataAirTanah;

  // Sorting Prioritas Edukasi (Top 3)
  const educationProfiles = profiles.map(p => {
    let riskScore = p.tingkatRisiko === 'Tinggi' ? 3 : p.tingkatRisiko === 'Sedang' ? 2 : 1;
    let coverage = p.totalPopulasi > 0 ? (p.pendaftarEdukasi / p.totalPopulasi) * 100 : 0;
    return { ...p, riskScore, coverage };
  });
  
  educationProfiles.sort((a, b) => {
    if (a.riskScore !== b.riskScore) return b.riskScore - a.riskScore;
    return a.coverage - b.coverage; // Makin kecil coverage, makin prioritas
  });
  const top3 = educationProfiles.slice(0, 3);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">Dashboard Pemantauan</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">Pemantauan real-time status hidrologi dan kerentanan wilayah.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[180px]">
            <SelectFilter
              paramName="kecamatan"
              placeholder="Semua Kecamatan"
              options={kecamatanOptions}
              icon={<Filter className="w-4 h-4" />}
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] font-medium border border-[var(--color-border-base)] px-4 py-2 rounded-[8px] bg-white shadow-sm hover:bg-gray-50 transition-colors h-[38px]">
            <Calendar className="w-4 h-4" /> Hari Ini
          </button>
          <ManualReportButton kecamatanOptions={kecamatanOptions} />
          <ExportButton data={riwayat} filename="laporan_dashboard" label="Ekspor Laporan" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (Peta Risiko) - Span 2 */}
        <div className="lg:col-span-2 bg-white border border-[var(--color-border-base)] rounded-[16px] overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-[var(--color-border-base)] flex items-center justify-between bg-white">
            <h2 className="font-semibold text-lg text-[var(--color-text-primary)]">Peta Risiko Genangan Aktif</h2>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>Tinggi</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>Sedang</div>
            </div>
          </div>
          <div className="relative flex-1 bg-gray-100 min-h-[400px]">
            {/* Peta Interaktif */}
            <MapWrapper />
            
            {/* Overlay Info Card */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white p-4 rounded-xl shadow-lg border border-gray-100 min-w-[200px]">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Status Real-time</div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-red-600 leading-none">18</span>
                <span className="text-sm font-semibold text-gray-700 pb-0.5">Klaster Aktif</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-red-600">
                <TrendingUp className="w-3.5 h-3.5" /> +12% Trend vs Kemarin
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (2 Cards) - Span 1 */}
        <div className="flex flex-col gap-6">
          
          {/* Card: Distribusi Sumber Air */}
          <div className="bg-white border border-[var(--color-border-base)] rounded-[16px] p-6 shadow-sm">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-5 text-base">Distribusi Sumber Air</h3>
            
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-3xl font-bold text-[#2563EB] leading-none mb-1">{rataRataAirTanah.toFixed(1)}%</div>
                <div className="text-[11px] font-medium text-gray-500">Air Tanah</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-gray-700 leading-none mb-1">{rataRataPDAM.toFixed(1)}%</div>
                <div className="text-[11px] font-medium text-gray-500">PDAM / Permukaan</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden flex mb-4">
              <div className="bg-[#2563EB] h-full" style={{ width: `${rataRataAirTanah}%` }}></div>
              <div className="bg-gray-400 h-full" style={{ width: `${rataRataPDAM}%` }}></div>
            </div>
            
            <p className="text-xs text-gray-600 leading-relaxed">
              Ketergantungan tinggi pada air tanah meningkatkan risiko penurunan muka tanah di wilayah pesisir.
            </p>
          </div>

          {/* Card: Prioritas Edukasi & Intervensi */}
          <div className="bg-white border border-[var(--color-border-base)] rounded-[16px] p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <h3 className="font-semibold text-[var(--color-text-primary)] text-base pr-4">Prioritas Edukasi &<br/>Intervensi</h3>
              <div className="p-2 bg-[#B45309] text-white rounded-md flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 flex-1">
              {top3.map((k, index) => {
                let bgClass = "bg-gray-100";
                let titleColor = "text-gray-800";
                let descColor = "text-gray-600";
                let descText = "Pemantauan Rutin Diperlukan";
                
                if (index === 0) {
                  bgClass = "bg-red-50 border border-red-100";
                  titleColor = "text-red-900";
                  descColor = "text-red-600";
                  descText = "Risiko Tinggi, Registrasi Rendah";
                } else if (index === 1) {
                  bgClass = "bg-orange-50 border border-orange-100";
                  titleColor = "text-orange-900";
                  descColor = "text-orange-600";
                  descText = "Risiko Sedang, Kepatuhan Menurun";
                }

                return (
                  <div key={k.id} className={`${bgClass} rounded-[10px] p-3.5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}>
                    <div>
                      <h4 className={`text-sm font-bold ${titleColor} mb-0.5`}>{index + 1}. Kecamatan {k.namaKecamatan}</h4>
                      <p className={`text-[11px] font-medium ${descColor}`}>{descText}</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${descColor}`} />
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>

      {/* Tabel Bawah (Log Terbaru) */}
      <div className="bg-white border border-[var(--color-border-base)] rounded-[16px] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--color-border-base)] flex items-center justify-between">
          <h2 className="font-semibold text-lg text-[var(--color-text-primary)]">Riwayat Genangan & Peringatan Dini (Log Terbaru)</h2>
          <Link href="/admin/history" className="text-sm font-medium text-[#2563EB] hover:underline flex items-center">
            Lihat Semua <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border-base)] bg-[#F8F9FB]">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu Deteksi</th>
                <th className="px-6 py-4 font-semibold">Lokasi (Kecamatan)</th>
                <th className="px-6 py-4 font-semibold">Level Siaga</th>
                <th className="px-6 py-4 font-semibold text-center">Ketinggian Air (cm)</th>
                <th className="px-6 py-4 font-semibold text-center w-16">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-base)]">
              {riwayat.map((r) => {
                const date = new Date(r.timestamp);
                const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                
                // Map statusRisiko (Tinggi, Sedang, Rendah) ke Level Siaga untuk display
                let siagaText = r.statusRisiko;
                if (r.statusRisiko === 'Tinggi') siagaText = 'Bahaya';
                if (r.statusRisiko === 'Sedang') siagaText = 'Siaga';

                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-700">{timeStr}, Hari ini</td>
                    <td className="px-6 py-4 font-semibold text-[var(--color-text-primary)]">{r.kecamatan}</td>
                    <td className="px-6 py-4">
                       <Badge text={siagaText} variant={r.statusRisiko} />
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">{r.ketinggianAir ? r.ketinggianAir.toFixed(1) : '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada log riwayat genangan.
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
