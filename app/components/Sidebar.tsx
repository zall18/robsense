"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  History, 
  GraduationCap, 
  Droplets,
  HelpCircle,
  LogOut,
  FileText
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Health Heat Map', path: '/admin/health-map', icon: Map },
    { name: 'Riwayat Genangan', path: '/admin/history', icon: History },
    { name: 'Laporan Warga', path: '/admin/laporan', icon: FileText },
    { name: 'Prioritas Edukasi', path: '/admin/education', icon: GraduationCap },
    { name: 'Cakupan Sumber Air', path: '/admin/water-source', icon: Droplets },
  ];

  return (
    <div className="w-64 bg-white border-r border-[var(--color-border-base)] flex flex-col h-full shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">RobSense</h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Pemantauan Kesehatan Distrik Kota Semarang</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[var(--color-brand-primary)] text-white' 
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[var(--color-border-base)] space-y-1">
        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <HelpCircle className="w-5 h-5" />
          Bantuan
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <LogOut className="w-5 h-5" />
          Keluar
        </Link>
      </div>
    </div>
  );
}
