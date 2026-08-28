'use client';
import React, { useState, useTransition } from 'react';
import { toggleVerifyLaporan } from '@/app/actions/warga';

export default function VerifyToggle({ id, initialStatus }: { id: string, initialStatus: boolean }) {
  const [isVerified, setIsVerified] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const nextStatus = !isVerified;
    setIsVerified(nextStatus); // Optimistic update
    startTransition(async () => {
      const res = await toggleVerifyLaporan(id, nextStatus);
      if (!res.success) {
        setIsVerified(!nextStatus); // Revert on failure
        alert("Gagal memverifikasi laporan.");
      }
    });
  };

  return (
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
      {isVerified ? 'Terverifikasi' : 'Belum Diverifikasi'}
    </button>
  );
}
