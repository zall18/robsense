"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import MapWrapper from '@/app/components/MapWrapper';
import SelectFilter from '@/app/admin/components/SelectFilter';
import { getLaporanWargaForMap, getHealthMapAnalytics } from '@/app/actions/warga';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HealthHeatMapContent() {
  const searchParams = useSearchParams();
  const waktu = searchParams.get('waktu');
  const kategori = searchParams.get('kategori');
  const verifikasi = searchParams.get('verifikasi');

  const [reports, setReports] = useState<any[]>([]);
  const [alarmFilter, setAlarmFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{ trendPercent: number; topKecamatan: string }>({ trendPercent: 0, topKecamatan: '...' });

  useEffect(() => {
    setLoading(true);
    getLaporanWargaForMap({ waktu, kategori, verifikasi }).then(data => {
      setReports(data);
      setLoading(false);
    });
  }, [waktu, kategori, verifikasi]);

  useEffect(() => {
    getHealthMapAnalytics().then(setAnalytics);
  }, []);

  const activeReports = useMemo(() => {
    if (!alarmFilter) return reports;
    
    // Hitung jumlah laporan per kecamatan
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.kecamatan] = (counts[r.kecamatan] || 0) + 1;
    });
    
    // Filter laporan terisolasi (< 3 laporan per kecamatan dianggap berpotensi alarm palsu)
    return reports.filter(r => counts[r.kecamatan] >= 3);
  }, [reports, alarmFilter]);
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      
      {/* Bagian Kiri: Area Peta */}
      <div className="flex-1 bg-white rounded-[12px] border border-[var(--color-border-base)] shadow-sm flex flex-col relative overflow-hidden min-h-[500px]">
        <div className="absolute top-4 left-4 z-[400] bg-white px-3 py-1.5 rounded-[8px] shadow-sm font-semibold text-sm text-[var(--color-text-primary)]">
          Peta Kesehatan Interaktif
        </div>
        <div className="absolute top-4 right-4 z-[400] flex gap-2">
          <button className="bg-white p-2 rounded-[8px] shadow-sm hover:bg-gray-50 text-[var(--color-text-secondary)]"><ZoomIn className="w-4 h-4" /></button>
          <button className="bg-white p-2 rounded-[8px] shadow-sm hover:bg-gray-50 text-[var(--color-text-secondary)]"><ZoomOut className="w-4 h-4" /></button>
          <button className="bg-white p-2 rounded-[8px] shadow-sm hover:bg-gray-50 text-[var(--color-text-secondary)]"><Crosshair className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 w-full h-full p-2 relative">
          {loading && (
            <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <MapWrapper reports={activeReports} />
        </div>
      </div>

      {/* Bagian Kanan: Panel Filter & Analisis */}
      <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto shrink-0">
        
        {/* Filter Peta */}
        <div className="bg-white p-5 rounded-[12px] border border-[var(--color-border-base)] shadow-sm">
          <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Filter Peta</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Rentang Waktu</label>
              <SelectFilter 
                paramName="waktu"
                defaultValue="Semua Waktu"
                options={[
                  { label: 'Semua Waktu', value: 'Semua Waktu' },
                  { label: '24 Jam Terakhir', value: '24 Jam Terakhir' },
                  { label: '7 Hari Terakhir', value: '7 Hari Terakhir' }
                ]}
              />
            </div>
            
            
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Tingkat Verifikasi</label>
              <SelectFilter 
                paramName="verifikasi"
                defaultValue="Klaster Terverifikasi"
                options={[
                  { label: 'Klaster Terverifikasi', value: 'Klaster Terverifikasi' },
                  { label: 'Semua Laporan', value: 'Semua Laporan' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Intensitas Klaster */}
        <div className="bg-white p-5 rounded-[12px] border border-[var(--color-border-base)] shadow-sm">
          <h3 className="font-bold text-[var(--color-text-primary)] mb-3 text-sm">Intensitas Klaster</h3>
          <div className="space-y-2 text-sm text-[var(--color-text-primary)]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-risk-high)]"></div> Tinggi (&ge; 5 laporan)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-risk-medium)]"></div> Sedang (3-4 laporan)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-risk-low)]"></div> Rendah (&lt; 3 laporan)</div>
          </div>
          
          <hr className="my-4 border-[var(--color-border-base)]" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Pencegahan Alarm Palsu</span>
            <div 
              onClick={() => setAlarmFilter(!alarmFilter)}
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${alarmFilter ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${alarmFilter ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}></div>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Zona merah menunjukkan klaster terverifikasi yang melebihi 50 laporan/km persegi dalam 72 jam. Laporan terisolasi otomatis difilter.
          </p>
        </div>

        {/* Analisis Klaster */}
        <div className="bg-[var(--color-bg-secondary)] p-5 rounded-[12px] border border-[var(--color-border-base)] shadow-sm">
          <h3 className="font-bold text-[var(--color-text-primary)] mb-1 text-sm">Analisis Klaster</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">Gambaran umum peringatan aktif waktu nyata.</p>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white p-3 rounded-[8px] border border-[var(--color-border-base)]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] mb-1">Klaster Aktif</div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{activeReports.length}</div>
            </div>
            <div className="bg-white p-3 rounded-[8px] border border-[var(--color-border-base)]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] mb-1">Tren Mingguan</div>
              <div className={`text-lg font-bold flex items-center gap-1 ${analytics.trendPercent > 0 ? 'text-[var(--color-risk-high)]' : analytics.trendPercent < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                {analytics.trendPercent > 0 ? '↗' : analytics.trendPercent < 0 ? '↘' : '→'} {analytics.trendPercent > 0 ? '+' : ''}{analytics.trendPercent}%
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-[8px] border border-[var(--color-border-base)]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] mb-1">Kecamatan Terdampak Parah</div>
            <div className="font-bold text-[var(--color-text-primary)]">{analytics.topKecamatan}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function HealthHeatMapPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat peta...</div>}>
      <HealthHeatMapContent />
    </Suspense>
  );
}
