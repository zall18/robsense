'use client';

import React, { useState } from 'react';
import { getRiskData, saveOnboardingResult } from '@/app/actions/warga';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function WargaOnboardingPage() {
  const [step, setStep] = useState(1);
  const [airType, setAirType] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState({ percentage: 0, tingkatRisiko: '', found: false });
  const router = useRouter();

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

  const handleNextStep1 = () => {
    if (airType) setStep(2);
  };

  const handleNextStep2 = async () => {
    if (kecamatan) {
      setLoading(true);
      // Simpan preferensi onboarding ke ProfilKecamatan database
      await saveOnboardingResult(kecamatan, airType);
      const data = await getRiskData(kecamatan);
      setRiskData(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userKecamatan', kecamatan);
        localStorage.setItem('userAirType', airType);
        document.cookie = `userKecamatan=${encodeURIComponent(kecamatan)}; path=/; max-age=31536000`;
        document.cookie = `userAirType=${encodeURIComponent(airType)}; path=/; max-age=31536000`;
      }
      setLoading(false);
      setStep(3); // Result page
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 pb-12 pt-16">
      
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900 mb-1 border-b-[3px] border-[#254B94] pb-2 inline-block">
        {step === 3 ? "Resiko Wilayah mu" : "Bantu kami mengatur notifikasi"}
      </h1>

      <div className="flex-1 flex flex-col justify-center my-8">
        
        {/* Step 1: Jenis Air */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kamu pakai fasilitas air jenis apa?</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setAirType('PDAM')}
                className={`flex flex-col p-5 border-2 rounded-[8px] text-left transition-all relative overflow-hidden ${
                  airType === 'PDAM' ? 'border-[#254B94] bg-[#254B94] text-white shadow-md transform scale-[1.02]' : 'border-[#254B94] text-gray-900 hover:bg-gray-50'
                }`}
              >
                {airType === 'PDAM' && <CheckCircle className="absolute top-4 right-4 text-white w-6 h-6 opacity-80" />}
                <span className={`text-lg font-bold mb-4 ${airType === 'PDAM' ? 'text-white' : 'text-gray-900'}`}>PDAM</span>
                <span className={`text-sm ${airType === 'PDAM' ? 'text-blue-100' : 'text-gray-500'}`}>Kualitas terjamin<br/>Aman digunakan</span>
              </button>
              
              <button 
                onClick={() => setAirType('Air Tanah')}
                className={`flex flex-col p-5 border-2 rounded-[8px] text-left transition-all relative overflow-hidden ${
                  airType === 'Air Tanah' ? 'border-[#254B94] bg-[#254B94] text-white shadow-md transform scale-[1.02]' : 'border-[#254B94] text-gray-900 hover:bg-gray-50'
                }`}
              >
                {airType === 'Air Tanah' && <CheckCircle className="absolute top-4 right-4 text-white w-6 h-6 opacity-80" />}
                <span className={`text-lg font-bold mb-4 ${airType === 'Air Tanah' ? 'text-white' : 'text-gray-900'}`}>Air Tanah</span>
                <span className={`text-sm ${airType === 'Air Tanah' ? 'text-blue-100' : 'text-gray-500'}`}>Penggunaan bebas<br/>Pengeboran mandiri</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Kecamatan */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kamu ada di kecamatan mana?</h2>
            
            <div className="relative">
              <input 
                type="text"
                list="kecamatan-list"
                value={kecamatan} 
                onChange={(e) => setKecamatan(e.target.value)}
                placeholder="Ketik nama kecamatan..."
                className="w-full appearance-none bg-white border border-[#254B94] rounded-[8px] px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#254B94] focus:border-transparent"
              />
              <datalist id="kecamatan-list">
                {kecamatanOptions.map(opt => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
          </div>
        )}

        {/* Step 3: Result (Feedback Instan & Personal) */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border border-[#254B94] rounded-[12px] p-6 text-center bg-white shadow-lg">
              
              {/* Badges Pilihan Pengguna */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-[#254B94] rounded-full text-xs font-bold">
                  📍 Kec. {kecamatan}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${airType === 'Air Tanah' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                  💧 Fasilitas: {airType}
                </span>
              </div>

              {riskData.tingkatRisiko === 'Tinggi' ? (
                <>
                  <h3 className="text-lg font-bold text-red-600 mb-2">Wilayah Kamu Berisiko Tinggi</h3>
                  <div className="text-4xl font-bold text-red-600 mb-2">{riskData.percentage}%</div>
                  <p className="text-xs text-gray-500 mb-4">Tingkat Ketergantungan Air Tanah di {kecamatan}</p>
                </>
              ) : riskData.tingkatRisiko === 'Sedang' ? (
                <>
                  <h3 className="text-lg font-bold text-[#E87A00] mb-2">Wilayah Kamu Berisiko Sedang</h3>
                  <div className="text-4xl font-bold text-[#E87A00] mb-2">{riskData.percentage}%</div>
                  <p className="text-xs text-gray-500 mb-4">Tingkat Ketergantungan Air Tanah di {kecamatan}</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-green-600 mb-2">Wilayah Kamu Relatif Aman</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">{riskData.percentage}%</div>
                  <p className="text-xs text-gray-500 mb-4">Tingkat Ketergantungan Air Tanah di {kecamatan}</p>
                </>
              )}

              {/* Respons Khusus Sesuai Pilihan Air Tanah vs PDAM */}
              {airType === 'Air Tanah' ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left mb-2">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Perhatian Khusus Pengguna Air Tanah:</span>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed">
                    Karena kamu menyedot air tanah di <strong>Kecamatan {kecamatan}</strong>, tanah di sekitar lingkunganmu rentan amblas lebih cepat (7–9 cm/tahun). Sistem telah mendaftarkan wilayahmu ke <strong>status pemantauan prioritas</strong> dan mengaktifkan peringatan rob otomatis.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left mb-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pilihan Konservasi Tepat (PDAM):</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Terima kasih telah menggunakan <strong>PDAM</strong>! Kamu telah membantu menekan laju penurunan muka tanah di {kecamatan}. Namun karena mayoritas warga sekitar masih menyedot air tanah, tetap waspada terhadap potensi genangan pasang rob.
                  </p>
                </div>
              )}

              <p className="text-[11px] text-gray-500 mt-3">
                Preferensi Anda berhasil tersimpan. Peta risiko dan notifikasi telah disesuaikan khusus untuk Kecamatan {kecamatan}.
              </p>

            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col gap-3 mt-auto">
        {step === 1 && (
          <>
            <button 
              onClick={handleNextStep1}
              disabled={!airType}
              className="w-full bg-[#254B94] text-white font-bold py-3.5 rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <Link href="/" className="w-full text-center border border-gray-400 text-gray-800 font-bold py-3.5 rounded-[8px] hover:bg-gray-50 transition-colors block">
              Go Back
            </Link>
          </>
        )}
        
        {step === 2 && (
          <>
            <button 
              onClick={handleNextStep2}
              disabled={!kecamatan || loading}
              className="w-full bg-[#254B94] text-white font-bold py-3.5 rounded-[8px] transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Next"}
            </button>
            <button 
              onClick={() => setStep(1)}
              className="w-full border border-gray-400 text-gray-800 font-bold py-3.5 rounded-[8px] hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </>
        )}

        {step === 3 && (
          <button 
            onClick={() => {
              // Set cookie for 1 year so user doesn't see onboarding again
              document.cookie = "hasSeenOnboarding=true; path=/; max-age=31536000";
              router.push(`/warga/peta?q=${encodeURIComponent(kecamatan)}`);
            }}
            className="w-full bg-[#254B94] text-white font-bold py-3.5 rounded-[8px] hover:bg-blue-900 transition-colors mt-6 flex items-center justify-center gap-2"
          >
            <span>Cek Peta Wilayah {kecamatan}!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
