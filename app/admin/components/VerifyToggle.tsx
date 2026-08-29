'use client';
import React, { useState, useTransition } from 'react';
import { toggleVerifyLaporan } from '@/app/actions/warga';

export default function VerifyToggle({ id, initialStatus, initialCategory }: { id: string, initialStatus: boolean, initialCategory: string | null }) {
  const [isVerified, setIsVerified] = useState(initialStatus);
  const [category, setCategory] = useState(initialCategory || 'Rendah');
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const nextStatus = !isVerified;
    setIsVerified(nextStatus); // Optimistic update
    startTransition(async () => {
      const res = await toggleVerifyLaporan(id, nextStatus, nextStatus ? category : null);
      if (!res.success) {
        setIsVerified(!nextStatus); // Revert on failure
        alert("Gagal memverifikasi laporan.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={toggle}
        disabled={isPending}
        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors flex items-center gap-1.5 ${
          isVerified 
            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
        } disabled:opacity-50`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        {isVerified ? 'Terverifikasi' : 'Verifikasi'}
      </button>

      {!isVerified && (
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isPending}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 outline-none bg-white text-gray-700 focus:border-blue-400"
        >
          <option value="Rendah">Rendah (Biru)</option>
          <option value="Sedang">Sedang (Oranye)</option>
          <option value="Tinggi">Tinggi (Merah)</option>
        </select>
      )}
      {isVerified && category && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
          category === 'Tinggi' ? 'bg-red-50 text-red-700 border-red-200' :
          category === 'Sedang' ? 'bg-orange-50 text-orange-700 border-orange-200' :
          'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {category}
        </span>
      )}
    </div>
  );
}
