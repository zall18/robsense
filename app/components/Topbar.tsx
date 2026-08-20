import React from 'react';
import { Bell, Settings, UserCircle } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-[var(--color-border-base)] flex items-center justify-between px-6 shrink-0 z-10">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Dashboard Pemkot & Puskesmas</h2>
      
      <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
        <button className="hover:text-[var(--color-text-primary)] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="hover:text-[var(--color-text-primary)] transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center overflow-hidden border border-[var(--color-border-base)]">
          <UserCircle className="w-full h-full text-gray-400" />
        </div>
      </div>
    </header>
  );
}
