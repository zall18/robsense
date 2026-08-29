'use client';

import React, { useState } from 'react';
import { getLaporanCount } from '@/app/actions/warga';
import { X, CloudRain, Droplets, Thermometer, Users } from 'lucide-react';

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

  return (
    <>
      <button 
        onClick={openModal}
        className="text-[#2563EB] text-xs font-semibold hover:underline"
      >
        Lihat Detail
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <h3 className="font-bold text-[var(--color-text-primary)] text-lg">Detail Cuaca & Genangan</h3>
              <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-5">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">{dateStr}</div>
                <div className="text-2xl font-bold text-gray-900">Kecamatan {data.kecamatan}</div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 text-sm font-semibold rounded-full border bg-gray-50">
                   Status Risiko: {data.statusRisiko}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-[12px] flex flex-col items-center justify-center gap-1">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <span className="text-xs text-gray-500">Suhu</span>
                  <span className="font-semibold text-gray-800">{data.suhu ? `${data.suhu}°C` : '-'}</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-[12px] flex flex-col items-center justify-center gap-1">
                  <CloudRain className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-gray-500">Kondisi</span>
                  <span className="font-semibold text-gray-800 text-center leading-tight">{data.kondisi || '-'}</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-[12px] flex flex-col items-center justify-center gap-1">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-gray-500">Tinggi Air</span>
                  <span className="font-semibold text-gray-800">{data.ketinggianAir ? `${data.ketinggianAir} cm` : '-'}</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-[12px] flex flex-col items-center justify-center gap-1">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-blue-600/80">Laporan Warga</span>
                  <span className="font-bold text-blue-700 text-lg leading-none">
                    {isLoading ? '...' : (laporanCount !== null ? laporanCount : '-')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-[8px] hover:bg-gray-50 transition-colors"
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
