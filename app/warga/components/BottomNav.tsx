'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Bell, PlusSquare, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Jangan tampilkan navigasi bawah di halaman onboarding
  if (pathname === '/warga/onboarding') return null;

  const navItems = [
    { label: 'Peta', href: '/warga/peta', icon: Map },
    { label: 'Notifikasi', href: '/warga/notifikasi', icon: Bell },
    { label: 'Lapor', href: '/warga/lapor', icon: PlusSquare },
    { label: 'Tentang', href: '/warga/tentang', icon: Info },
  ];

  return (
    <div className="bg-white border-t border-gray-200 flex justify-around items-center h-16 shrink-0 mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.05)] relative z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? 'text-[#254B94]' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-50' : ''}`}>
               <Icon className={`w-5 h-5 ${isActive ? 'fill-[#254B94] text-[#254B94]' : ''}`} />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-[#254B94]' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
