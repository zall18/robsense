'use client';

import React, { useState } from 'react';
import { loginAdmin } from '@/app/actions/auth';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-[16px] shadow-lg border border-[var(--color-border-base)] p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-full mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Admin</h1>
          <p className="text-sm text-gray-500">Masuk untuk mengelola data Robsense (MVP)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                defaultValue="admin@robsense.id"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-[10px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 transition-all bg-gray-50 focus:bg-white"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                defaultValue="admin123"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-[10px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 transition-all bg-gray-50 focus:bg-white"
                placeholder="Masukkan kata sandi"
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-500 font-medium">Tip: Gunakan sandi "admin123"</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-[10px] shadow-sm text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Masuk ke Dashboard'
            )}
          </button>
        </form>

      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; 2024 Robsense MVP.
      </div>
    </div>
  );
}
