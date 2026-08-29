import React from 'react';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Calendar, Filter } from 'lucide-react';
import Badge from '@/app/components/Badge';
import SelectFilter from '@/app/admin/components/SelectFilter';
import ExportButton from '@/app/admin/components/ExportButton';
import VerifyToggle from '@/app/admin/components/VerifyToggle';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function LaporanWargaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const kecamatan = params.kecamatan;

  const data = await prisma.laporanWarga.findMany({
    where: kecamatan ? { kecamatan } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  const distinctKecamatan = await prisma.profilKecamatan.findMany({
    select: { namaKecamatan: true },
    orderBy: { namaKecamatan: 'asc' }
  });
  
  const kecamatanOptions = distinctKecamatan.map(k => ({
    label: `Kec. ${k.namaKecamatan}`,
    value: k.namaKecamatan
  }));

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Laporan Warga</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Daftar lengkap laporan gejala kesehatan yang dikirimkan oleh warga.
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
            filename="laporan_warga" 
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-base)] rounded-[8px] text-sm bg-white hover:bg-gray-50 text-[var(--color-text-primary)] shadow-sm h-[38px]" 
          />
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[var(--color-border-base)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8F9FB] text-[var(--color-text-secondary)] border-b border-[var(--color-border-base)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu Pelaporan</th>
                <th className="px-6 py-4 font-semibold">Kecamatan</th>
                <th className="px-6 py-4 font-semibold">Gejala</th>
                <th className="px-6 py-4 font-semibold">Status Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-base)]">
              {data.map((row) => {
                const date = new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                }).format(row.createdAt);
                
                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-[var(--color-text-primary)] whitespace-nowrap">{date}</td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)] font-medium">{row.kecamatan}</td>
                    <td className="px-6 py-4 text-gray-700 max-w-md truncate" title={row.gejala}>{row.gejala}</td>
                    <td className="px-6 py-4">
                      <VerifyToggle id={row.id} initialStatus={row.isVerified} initialCategory={row.kategori} />
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada laporan warga.
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
