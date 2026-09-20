'use client';

import React, { useState, useEffect } from 'react';
import { submitLaporan } from '@/app/actions/warga';

export default function WargaLaporPage() {
  const [kecamatan, setKecamatan] = useState('');
  const [gejala, setGejala] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const savedKecamatan = localStorage.getItem('userKecamatan');
    if (savedKecamatan) {
      setKecamatan(savedKecamatan);
    }

    const lastReport = localStorage.getItem('lastReportTime');
    if (lastReport) {
      const timePassed = Date.now() - parseInt(lastReport);
      if (timePassed < COOLDOWN_DURATION) {
        setCooldownTime(COOLDOWN_DURATION - timePassed);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1000) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  const kecamatanOptions = [
    'Genuk',
    'Semarang Utara',
    'Pedurungan',
    'Banyumanik',
    'Gayamsari',
    'Semarang Tengah',
    'Semarang Barat',
    'Semarang Timur'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kecamatan || !gejala) return;
    
    setLoading(true);
    const result = await submitLaporan(kecamatan, gejala);
    setLoading(false);
    
    if (result.success) {
      setSuccess(true);
      const now = Date.now();
      localStorage.setItem('lastReportTime', now.toString());
      setCooldownTime(COOLDOWN_DURATION);
      // Reset form if wanted, or leave it and let user read success message
    } else {
      alert(result.error || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 pb-12 pt-16">
      
      <h1 className="text-2xl font-bold text-gray-900 mb-10">
        Lapor Gejala Kamu
      </h1>

      {success ? (
        <div className="border border-green-500 bg-green-50 rounded-[8px] p-6 text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-green-700 mb-2">Laporan Terkirim!</h2>
          <p className="text-sm text-green-600 mb-6">
            Terima kasih atas partisipasi Anda. Laporan telah kami terima dan akan dianalisis untuk mitigasi dini.
          </p>
          <button 
            onClick={() => { setSuccess(false); setKecamatan(''); setGejala(''); }}
            disabled={cooldownTime > 0}
            className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cooldownTime > 0 
              ? `Tunggu ${Math.floor(cooldownTime / 60000)}m ${Math.floor((cooldownTime % 60000) / 1000)}s` 
              : "Lapor Lagi"}
          </button>
        </div>
      ) : (
        <div className="border border-[#254B94] rounded-[12px] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Kecamatan */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">Kecamatan/Kelurahan</label>
              <div className="relative">
                <select 
                  value={kecamatan} 
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full appearance-none bg-[#F4F5FB] border border-[#254B94] rounded-[6px] px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#254B94] focus:border-transparent"
                  required
                >
                  <option value="" disabled>-</option>
                  {kecamatanOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Gejala */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">Gejala</label>
              <textarea 
                value={gejala}
                onChange={(e) => setGejala(e.target.value)}
                placeholder="Sampaikan gejala mu !"
                rows={5}
                className="w-full bg-[#F4F5FB] border border-[#254B94] rounded-[6px] px-4 py-3 text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#254B94] focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex justify-end mt-2">
              <button 
                type="submit"
                disabled={!kecamatan || !gejala || loading || cooldownTime > 0}
                className="bg-[#254B94] text-white font-bold py-2.5 px-8 rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : cooldownTime > 0 ? (
                  `Tunggu ${Math.floor(cooldownTime / 60000)}m ${Math.floor((cooldownTime % 60000) / 1000)}s`
                ) : "Kirim Laporan"}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
