import React from 'react';
import BottomNav from './components/BottomNav';

export default function WargaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-4">
      {/* Mobile container constraint */}
      <div className="w-full max-w-[400px] bg-white h-[100dvh] md:h-[800px] md:max-h-[90vh] md:rounded-3xl md:shadow-2xl overflow-hidden flex flex-col relative">
        <main className="flex-1 overflow-y-auto pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
