'use client';

import React, { useState } from 'react';
import { getRiskData } from '@/app/actions/warga';
import Link from 'next/link';

export default function WargaOnboardingPage() {
  const [step, setStep] = useState(1);
  const [airType, setAirType] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState({ percentage: 0, tingkatRisiko: '', found: false });

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
      const data = await getRiskData(kecamatan);
      setRiskData(data);
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
                className={`flex flex-col p-5 border-2 rounded-[8px] text-left transition-all ${
                  airType === 'PDAM' ? 'border-[#254B94] bg-[#F8F9FB] shadow-md' : 'border-[#254B94] hover:bg-gray-50'
                }`}
              >
                <span className="text-lg font-bold text-gray-900 mb-4">PDAM</span>
                <span className="text-sm text-gray-500">Kualitas terjamin<br/>Aman digunakan</span>
              </button>
              
              <button 
                onClick={() => setAirType('Air Tanah')}
                className={`flex flex-col p-5 border-2 rounded-[8px] text-left transition-all ${
                  airType === 'Air Tanah' ? 'border-[#254B94] bg-[#F8F9FB] shadow-md' : 'border-[#254B94] hover:bg-gray-50'
                }`}
              >
                <span className="text-lg font-bold text-gray-900 mb-4">Air Tanah</span>
                <span className="text-sm text-gray-500">Penggunaan bebas<br/>Pengeboran mandiri</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Kecamatan */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kamu ada di kecamatan mana?</h2>
            
            <div className="relative">
              <select 
                value={kecamatan} 
                onChange={(e) => setKecamatan(e.target.value)}
                className="w-full appearance-none bg-white border border-[#254B94] rounded-[8px] px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#254B94] focus:border-transparent"
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
        )}

        {/* Step 3: Result (Feedback Instan) */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border border-[#254B94] rounded-[8px] p-8 text-center bg-white shadow-lg">
              
              {riskData.tingkatRisiko === 'Tinggi' ? (
                <>
                  <h3 className="text-xl font-bold text-[#E87A00] mb-6">Wilayah kamu sangat berisiko</h3>
                  <div className="text-5xl font-bold text-[#E87A00] mb-8">{riskData.percentage}%</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Kecamatan {kecamatan} memiliki ketergantungan yang amat tinggi terhadap air tanah. 
                    Sebaiknya kamu sudah mulai beralih menggunakan fasilitas PDAM untuk meminimalisir penurunan muka tanah!
                  </p>
                </>
              ) : riskData.tingkatRisiko === 'Sedang' ? (
                <>
                  <h3 className="text-xl font-bold text-[#E87A00] mb-6">Wilayah kamu sedikit berisiko</h3>
                  <div className="text-5xl font-bold text-[#E87A00] mb-8">{riskData.percentage}%</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Kecamatan {kecamatan} memiliki ketergantungan sedang.
                    Sebaiknya kamu sudah mulai untuk mengurangi penggunaan air tanah berlebih dan memantau kerentanan wilayah.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-green-600 mb-6">Wilayah kamu relatif aman</h3>
                  <div className="text-5xl font-bold text-green-600 mb-8">{riskData.percentage}%</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Kecamatan {kecamatan} memiliki rasio yang seimbang.
                    Tetap pertahankan untuk menggunakan layanan PDAM dan kurangi laju penyedotan air tanah ya!
                  </p>
                </>
              )}

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
            onClick={() => {}}
            className="w-full bg-[#254B94] text-white font-bold py-3.5 rounded-[8px] hover:bg-blue-900 transition-colors mt-8"
          >
            Cek Peta Wilayah mu!
          </button>
        )}
      </div>

    </div>
  );
}
