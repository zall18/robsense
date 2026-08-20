import React from 'react';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Badge from '@/app/components/Badge';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Fungsi helper untuk mapping
function getLevelSiaga(risiko: string, air: number | null) {
  if (risiko === 'Tinggi' || (air && air > 100)) return 'BAHAYA';
  if (risiko === 'Sedang' && air && air > 50) return 'SIAGA';
  if (risiko === 'Sedang') return 'WASPADA';
  return 'AMAN';
}

function getTrendIcon(trend: string | null) {
  if (!trend) return <Minus className="w-3 h-3" />;
  if (trend.toLowerCase() === 'meningkat') return <TrendingUp className="w-3 h-3 text-red-500" />;
  if (trend.toLowerCase() === 'menurun') return <TrendingDown className="w-3 h-3 text-green-500" />;
  return <Minus className="w-3 h-3 text-gray-500" />;
}

export default async function HistoryPage() {
  const data = await prisma.dataCuacaGenangan.findMany({
    orderBy: { timestamp: 'desc' },
    take: 5
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Riwayat Genangan</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Pantau riwayat level air dan status genangan di berbagai kecamatan.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-base)] rounded-[8px] text-sm bg-white hover:bg-gray-50 text-[var(--color-text-primary)] shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            01 Okt 2023 - 31 Okt 2023
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-base)] rounded-[8px] text-sm bg-white hover:bg-gray-50 text-[var(--color-text-primary)] shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            Semua Kecamatan
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-base)] rounded-[8px] text-sm bg-white hover:bg-gray-50 text-[var(--color-text-primary)] shadow-sm">
            <Download className="w-4 h-4 text-gray-500" />
            Ekspor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[var(--color-border-base)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8F9FB] text-[var(--color-text-secondary)] border-b border-[var(--color-border-base)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Tanggal & Waktu</th>
                <th className="px-6 py-4 font-semibold">Kecamatan</th>
                <th className="px-6 py-4 font-semibold">Level Siaga</th>
                <th className="px-6 py-4 font-semibold">Ketinggian Air (cm)</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-base)]">
              {data.map((row) => {
                const date = new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                }).format(row.timestamp);
                
                const levelSiaga = getLevelSiaga(row.statusRisiko, row.ketinggianAir);
                const isWarning = levelSiaga === 'BAHAYA' || levelSiaga === 'SIAGA';
                
                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">{date}</td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)]">{row.kecamatan}</td>
                    <td className="px-6 py-4">
                      <Badge text={levelSiaga} variant={levelSiaga} />
                    </td>
                    <td className={`px-6 py-4 font-semibold ${isWarning ? 'text-[var(--color-risk-high)]' : isWarning === false && levelSiaga === 'WASPADA' ? 'text-yellow-500' : 'text-[var(--color-text-primary)]'}`}>
                      {row.ketinggianAir ? row.ketinggianAir.toFixed(1) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(row.trendStatus)}
                        <span className={row.trendStatus === 'Meningkat' ? 'text-[var(--color-risk-high)]' : row.trendStatus === 'Menurun' ? 'text-green-500' : 'text-gray-500'}>
                          {row.trendStatus || 'Tidak Diketahui'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Kosong seperti desain */}
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data riwayat genangan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--color-border-base)] flex items-center justify-between bg-white text-sm text-[var(--color-text-secondary)]">
          <span>Menampilkan 1–{data.length} dari 124 data</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-[var(--color-border-base)] rounded hover:bg-gray-50">&lt;</button>
            <button className="px-3 py-1 border border-[var(--color-brand-primary)] bg-blue-50 text-[var(--color-brand-primary)] rounded font-medium">1</button>
            <button className="px-3 py-1 border border-[var(--color-border-base)] rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-[var(--color-border-base)] rounded hover:bg-gray-50">3</button>
            <span className="px-2">...</span>
            <button className="px-2 py-1 border border-[var(--color-border-base)] rounded hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
