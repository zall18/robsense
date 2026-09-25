'use client';

import React, { useState } from 'react';
import { getLaporanCount } from '@/app/actions/warga';
import { 
  X, CloudRain, Droplets, Thermometer, Users, 
  TrendingUp, TrendingDown, Minus, ShieldCheck, 
  Waves, Mountain, Wind, Activity
} from 'lucide-react';

export default function HistoryDetailModal({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [laporanCount, setLaporanCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = async () => {
    setIsOpen(true);
    if (laporanCount === null) {
      setIsLoading(true);
      const count = await getLaporanCount(data.kecamatan, data.timestamp);
      setLaporanCount(count);
      setIsLoading(false);
    }
  };

  const closeModal = () => setIsOpen(false);

  const dateStr = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(data.timestamp));

  // Estimasi skor & breakdown jika record lawas belum memiliki data numerik
  const riskScore = data.riskScore ?? (
    data.statusRisiko === 'Tinggi' ? 75 : data.statusRisiko === 'Sedang' ? 42 : 18
  );
  const weatherScore = data.weatherScore ?? (data.kondisi?.toLowerCase().includes('hujan') ? 18 : 5);
  const seaScore = data.seaScore ?? (data.kondisiLaut?.toLowerCase().includes('tinggi') ? 20 : 5);
  const subsidenceScore = data.subsidenceScore ?? (data.statusRisiko === 'Tinggi' ? 16 : 8);
  const vulnerabilityScore = data.vulnerabilityScore ?? (data.statusRisiko === 'Tinggi' ? 22 : 12);
  const confidenceLevel = data.confidenceLevel || 'Tinggi';
  const trendStatus = data.trendStatus || 'Stabil';

  // Warna aksen berdasarkan skor risiko
  const getThemeColor = (score: number) => {
    if (score >= 50) return { bg: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-700 border-red-200', light: 'bg-red-50' };
    if (score >= 28) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200', light: 'bg-amber-50' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', light: 'bg-emerald-50' };
  };

  const theme = getThemeColor(riskScore);

  return (
    <>
      <button 
        onClick={openModal}
        className="text-[#2563EB] text-xs font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
      >
        <Activity className="w-3.5 h-3.5" />
        Lihat Detail
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-indigo-50/40">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#254B94] text-white rounded-lg">
                  <Activity className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-[var(--color-text-primary)] text-base">Analisis Risiko Multi-Faktor</h3>
              </div>
              <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="px-6 py-5 overflow-y-auto flex flex-col gap-5 text-left">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 font-medium">{dateStr}</span>
                  <h4 className="text-xl font-bold text-gray-900">Kecamatan {data.kecamatan}</h4>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${theme.badge}`}>
                    {data.statusRisiko}
                  </span>
                  {trendStatus && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                      trendStatus === 'Meningkat' ? 'bg-red-50 text-red-600 border-red-200' :
                      trendStatus === 'Menurun' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {trendStatus === 'Meningkat' && <TrendingUp className="w-3 h-3 text-red-500" />}
                      {trendStatus === 'Menurun' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                      {trendStatus === 'Stabil' && <Minus className="w-3 h-3 text-gray-400" />}
                      {trendStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* Gauge Progress Bar (0-100) */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-[14px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-700">Skor Kerentanan & Bahaya</span>
                    <span className="text-[10px] text-gray-400">(0-100)</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${theme.text}`}>{riskScore}</span>
                    <span className="text-xs text-gray-400 font-semibold">/ 100</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${theme.bg}`}
                    style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1 text-gray-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Data Quality: <strong className="text-gray-800">{confidenceLevel}</strong>
                  </span>
                  <span className="italic text-[10px] text-gray-400">
                    Perka BNPB No.2/2012
                  </span>
                </div>
              </div>

              {/* Breakdown 4 Komponen Transparan */}
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Rincian 4 Komponen Skor (Transparansi Model)
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Komponen Cuaca */}
                  <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Cuaca
                      </span>
                      <strong className="text-gray-800 font-bold">{weatherScore}/25</strong>
                    </div>
                    <span className="text-xs font-semibold text-gray-800 truncate" title={data.kondisi}>
                      {data.kondisi || '-'}
                    </span>
                    {(data.kelembapan || data.kecepatanAngin) && (
                      <span className="text-[10px] text-gray-400">
                        {data.kelembapan ? `RH ${data.kelembapan}%` : ''} {data.kecepatanAngin ? `• ${data.kecepatanAngin} km/j` : ''}
                      </span>
                    )}
                  </div>

                  {/* Komponen Laut */}
                  <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Waves className="w-3.5 h-3.5 text-cyan-600" /> Gelombang
                      </span>
                      <strong className="text-gray-800 font-bold">{seaScore}/25</strong>
                    </div>
                    <span className="text-xs font-semibold text-gray-800 truncate" title={data.kondisiLaut || 'Normal'}>
                      {data.kondisiLaut || 'Normal'}
                    </span>
                    <span className="text-[10px] text-gray-400">BMKG Maritim Semarang</span>
                  </div>

                  {/* Komponen Amblesan */}
                  <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-amber-600" /> Amblesan
                      </span>
                      <strong className="text-gray-800 font-bold">{subsidenceScore}/20</strong>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">
                      Data Badan Geologi
                    </span>
                    <span className="text-[10px] text-gray-400">Laju penurunan tanah</span>
                  </div>

                  {/* Komponen Kerentanan & Kapasitas */}
                  <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-indigo-500" /> Kerentanan
                      </span>
                      <strong className="text-gray-800 font-bold">{vulnerabilityScore}/30</strong>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">
                      Air Tanah & Elevasi
                    </span>
                    <span className="text-[10px] text-gray-400">BPS 2024 & Cekungan</span>
                  </div>
                </div>
              </div>

              {/* Parameter Sekunder Lapangan */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-white border border-gray-200 p-2.5 rounded-xl flex flex-col items-center justify-center text-center">
                  <Thermometer className="w-4 h-4 text-orange-500 mb-0.5" />
                  <span className="text-[10px] text-gray-400">Suhu Udara</span>
                  <span className="font-bold text-gray-800 text-xs">{data.suhu ? `${data.suhu}°C` : '-'}</span>
                </div>
                <div className="bg-white border border-gray-200 p-2.5 rounded-xl flex flex-col items-center justify-center text-center">
                  <Droplets className="w-4 h-4 text-blue-600 mb-0.5" />
                  <span className="text-[10px] text-gray-400">Tinggi Genangan</span>
                  <span className="font-bold text-gray-800 text-xs">{data.ketinggianAir ? `${data.ketinggianAir} cm` : '-'}</span>
                </div>
                <div className="bg-blue-50/60 border border-blue-100 p-2.5 rounded-xl flex flex-col items-center justify-center text-center">
                  <Users className="w-4 h-4 text-blue-600 mb-0.5" />
                  <span className="text-[10px] text-blue-600/80">Laporan Warga</span>
                  <span className="font-bold text-blue-700 text-xs">
                    {isLoading ? '...' : (laporanCount !== null ? laporanCount : '-')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 italic">
                RobSense Decision Support System
              </span>
              <button 
                onClick={closeModal}
                className="px-5 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

