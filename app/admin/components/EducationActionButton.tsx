'use client';

import React, { useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';

interface Props {
  kecamatan: string;
  status: string;
  coverage: number;
}

export default function EducationActionButton({ kecamatan, status, coverage }: Props) {
  const [planned, setPlanned] = useState(false);

  const shareText = encodeURIComponent(
    `*Peringatan Urgensi Edukasi - Robsense*\n\n` +
    `Kecamatan: *${kecamatan}*\n` +
    `Status Prioritas: *${status}*\n` +
    `Cakupan Registrasi PDAM: *${coverage.toFixed(0)}%*\n\n` +
    `Mohon segera rencanakan tindakan edukasi untuk meminimalisir risiko genangan rob akibat penggunaan air tanah berlebih.`
  );
  
  const handleShare = () => {
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {planned ? (
        <button 
          onClick={() => setPlanned(false)}
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-[#2563EB] px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Check className="w-4 h-4" /> Direncanakan
        </button>
      ) : (
        <button 
          onClick={() => setPlanned(true)}
          className="text-sm font-medium text-[#2563EB] bg-transparent border border-transparent hover:border-blue-200 px-3 py-1.5 rounded-md transition-colors"
        >
          Rencanakan
        </button>
      )}
      
      <button 
        onClick={handleShare}
        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
        title="Bagikan via WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
