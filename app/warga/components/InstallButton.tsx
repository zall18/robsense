'use client';

import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIOS(true);
    }

    // Capture install prompt for Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  if (isStandalone) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-sm font-bold shadow-sm">
        ✅ Aplikasi sudah terinstal di perangkat Anda!
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#254B94] to-[#3a68c7] rounded-xl shadow-lg border border-blue-800 p-5 mb-6 text-white text-center">
      <h3 className="font-bold text-lg mb-2">Instal RobSense PWA</h3>
      
      {isIOS ? (
        <p className="text-xs leading-relaxed opacity-90">
          Untuk menginstal di iPhone/iPad: Tekan ikon <strong>Share</strong> (Kirim) di bawah layar Safari Anda, lalu pilih <strong>Add to Home Screen</strong> (Tambah ke Layar Utama).
        </p>
      ) : (
        <>
          <p className="text-xs leading-relaxed opacity-90 mb-4">
            Dapatkan pengalaman penuh layaknya aplikasi Native! Akses lebih cepat dan terima notifikasi cuaca langsung di layar utama HP Anda.
          </p>
          <button 
            onClick={handleInstallClick}
            disabled={!deferredPrompt}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all shadow-md ${
              deferredPrompt 
                ? 'bg-white text-[#254B94] hover:bg-gray-50 active:scale-95' 
                : 'bg-white/20 text-white/70 cursor-not-allowed'
            }`}
          >
            {deferredPrompt 
              ? '📲 Instal Aplikasi Sekarang' 
              : timeoutReached 
                ? '⚠️ Instalasi ditolak / tidak didukung' 
                : 'Memeriksa Kompatibilitas...'}
          </button>
        </>
      )}
    </div>
  );
}
