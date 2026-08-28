'use client';

import dynamic from 'next/dynamic';

const MapWrapper = dynamic(() => import('@/app/components/MapWrapper'), { ssr: false });

export default function ClientMap({ reports = [] }: { reports?: any[] }) {
  return <MapWrapper reports={reports} />;
}
