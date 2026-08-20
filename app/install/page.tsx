import React from 'react';
import InstallButton from '../warga/components/InstallButton';
import Image from 'next/image';

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-32 h-32 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner overflow-hidden relative">
          <Image 
            src="/logo.jpeg" 
            alt="RobSense Logo" 
            fill
            className="object-cover"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-[#254B94] mb-2">RobSense</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Platform Cerdas Pemantauan Risiko Banjir Rob & Konservasi Air Tanah
        </p>

        <InstallButton />
        
        <div className="mt-8 text-xs text-gray-400">
          <p>Jika Anda kesulitan menginstal, buka tautan ini di browser Chrome atau Safari (iOS).</p>
        </div>
      </div>
    </div>
  );
}
