"use client";
import React from 'react';
import { ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import MapWrapper from '@/app/components/MapWrapper';

export default function HealthHeatMapPage() {
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
        <div className="flex-1 w-full h-full p-2">
          <MapWrapper />
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
              <select className="w-full border border-[var(--color-border-base)] rounded-[8px] px-3 py-2 text-sm bg-white text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand-primary)]">
                <option>24 Jam Terakhir</option>
                <option>7 Hari Terakhir</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Kategori Gejala</label>
              <select className="w-full border border-[var(--color-border-base)] rounded-[8px] px-3 py-2 text-sm bg-white text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand-primary)]">
                <option>Demam / Gatal (Air Tanah)</option>
                <option>Pernapasan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Tingkat Verifikasi</label>
              <select className="w-full border border-[var(--color-border-base)] rounded-[8px] px-3 py-2 text-sm bg-white text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand-primary)]">
                <option>Klaster Terverifikasi</option>
                <option>Semua Laporan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Intensitas Klaster */}
        <div className="bg-white p-5 rounded-[12px] border border-[var(--color-border-base)] shadow-sm">
          <h3 className="font-bold text-[var(--color-text-primary)] mb-3 text-sm">Intensitas Klaster</h3>
          <div className="space-y-2 text-sm text-[var(--color-text-primary)]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-risk-high)]"></div> Tinggi (&gt;50 laporan)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-risk-medium)]"></div> Sedang (20-50)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-brand-primary)]"></div> Rendah (&lt;20)</div>
          </div>
          
          <hr className="my-4 border-[var(--color-border-base)]" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Pencegahan Alarm Palsu</span>
            <div className="w-10 h-5 bg-[var(--color-brand-primary)] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
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
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">18</div>
            </div>
            <div className="bg-white p-3 rounded-[8px] border border-[var(--color-border-base)]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] mb-1">Tren Mingguan</div>
              <div className="text-lg font-bold text-[var(--color-risk-high)] flex items-center gap-1">
                ↗ +12%
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-[8px] border border-[var(--color-border-base)]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] mb-1">Kecamatan Terdampak Parah</div>
            <div className="font-bold text-[var(--color-text-primary)]">Semarang Utara</div>
          </div>
        </div>

      </div>
    </div>
  );
}
