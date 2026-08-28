"use client";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[var(--color-bg-secondary)] animate-pulse rounded-[12px] flex items-center justify-center text-slate-400">
      Memuat Peta...
    </div>
  )
});

export default function MapWrapper({ reports = [] }: { reports?: any[] }) {
  return <MapComponent reports={reports} />;
}
