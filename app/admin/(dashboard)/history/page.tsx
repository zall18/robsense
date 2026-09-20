import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '@/app/components/Badge';
import SelectFilter from '@/app/admin/components/SelectFilter';
import ExportButton from '@/app/admin/components/ExportButton';
import HistoryDetailModal from '@/app/admin/components/HistoryDetailModal';

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

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const kecamatan = params.kecamatan;
  const waktu = params.waktu;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const pageSize = 10;

  let dateFilter = {};
  if (waktu === 'Hari Ini') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateFilter = { gte: today };
  } else if (waktu === 'Minggu Ini') {
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    thisWeek.setHours(0, 0, 0, 0);
    dateFilter = { gte: thisWeek };
  } else if (waktu === 'Bulan Ini') {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    dateFilter = { gte: thisMonth };
  }

  const whereClause = {
    ...(kecamatan ? { kecamatan } : {}),
    ...(Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {})
  };

  const [data, totalCount, distinctKecamatan] = await Promise.all([
    prisma.dataCuacaGenangan.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    }),
    prisma.dataCuacaGenangan.count({
      where: whereClause
    }),
    prisma.profilKecamatan.findMany({
      select: { namaKecamatan: true },
      orderBy: { namaKecamatan: 'asc' }
    })
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startRecord = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  const kecamatanOptions = distinctKecamatan.map(k => ({
    label: `Kec. ${k.namaKecamatan}`,
    value: k.namaKecamatan
  }));

  const buildPageUrl = (pageNumber: number) => {
    const q = new URLSearchParams();
    if (kecamatan) q.set('kecamatan', kecamatan);
    if (waktu) q.set('waktu', waktu);
    q.set('page', pageNumber.toString());
    return `/admin/history?${q.toString()}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Riwayat Genangan</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Pantau riwayat level air dan status genangan di berbagai kecamatan secara dinamis.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[180px]">
            <SelectFilter
              paramName="waktu"
              placeholder="Semua Waktu"
              defaultValue="Bulan Ini"
              options={[{label: 'Hari Ini', value: 'Hari Ini'}, {label: 'Minggu Ini', value: 'Minggu Ini'}, {label: 'Bulan Ini', value: 'Bulan Ini'}]}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
          
          <div className="w-[200px]">
            <SelectFilter 
              paramName="kecamatan"
              placeholder="Semua Kecamatan"
              options={kecamatanOptions}
              icon={<Filter className="w-4 h-4" />}
            />
          </div>

          <ExportButton 
            data={data} 
            filename="riwayat_genangan" 
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-base)] rounded-[8px] text-sm bg-white hover:bg-gray-50 text-[var(--color-text-primary)] shadow-sm h-[38px]" 
          />
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
                      <HistoryDetailModal data={row} />
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
        
        {/* Pagination Dinamis */}
        <div className="px-6 py-4 border-t border-[var(--color-border-base)] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-sm text-[var(--color-text-secondary)]">
          <span>Menampilkan {startRecord}–{endRecord} dari {totalCount} data</span>
          <div className="flex items-center gap-1">
            {currentPage > 1 ? (
              <Link 
                href={buildPageUrl(currentPage - 1)}
                className="p-1.5 border border-[var(--color-border-base)] rounded hover:bg-gray-50 text-gray-700"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : (
              <span className="p-1.5 border border-gray-200 rounded text-gray-300 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </span>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                    {p === currentPage ? (
                      <span className="px-3 py-1 border border-[var(--color-brand-primary)] bg-blue-50 text-[var(--color-brand-primary)] rounded font-medium">
                        {p}
                      </span>
                    ) : (
                      <Link 
                        href={buildPageUrl(p)}
                        className="px-3 py-1 border border-[var(--color-border-base)] rounded hover:bg-gray-50 text-gray-700"
                      >
                        {p}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}

            {currentPage < totalPages ? (
              <Link 
                href={buildPageUrl(currentPage + 1)}
                className="p-1.5 border border-[var(--color-border-base)] rounded hover:bg-gray-50 text-gray-700"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="p-1.5 border border-gray-200 rounded text-gray-300 cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
