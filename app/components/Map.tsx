"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const SEMARANG_CENTER: [number, number] = [-6.966667, 110.416664];

function MapBounds({ reports }: { reports: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const avgLat = reports.reduce((sum, r) => sum + r.latitude, 0) / reports.length;
      const avgLng = reports.reduce((sum, r) => sum + r.longitude, 0) / reports.length;
      map.flyTo([avgLat, avgLng], 13, { duration: 1.5 });
    }
  }, [reports, map]);
  return null;
}

function getCategoryColor(category: string | null) {
  if (category === 'Tinggi') return 'var(--color-risk-high)'; // Merah
  if (category === 'Sedang') return 'var(--color-risk-medium)'; // Oranye
  return 'var(--color-risk-low)'; // Biru/Hijau
}

export default function Map({ reports = [] }: { reports?: { id: string, latitude: number | null, longitude: number | null, gejala: string, kecamatan: string, kategori?: string | null }[] }) {
  // Filter only reports with valid coordinates
  const validReports = reports.filter(r => r.latitude !== null && r.longitude !== null);

  // Clustering for Zones
  const grouped: Record<string, typeof validReports> = {};
  validReports.forEach(r => {
    if (!grouped[r.kecamatan]) grouped[r.kecamatan] = [];
    grouped[r.kecamatan].push(r);
  });

  const clusterZones = Object.entries(grouped)
    .map(([kecamatan, items]) => {
      const avgLat = items.reduce((sum, r) => sum + r.latitude!, 0) / items.length;
      const avgLng = items.reduce((sum, r) => sum + r.longitude!, 0) / items.length;
      let color = 'var(--color-risk-low)';
      let label = 'RENDAH';
      if (items.length >= 5) {
        color = 'var(--color-risk-high)';
        label = 'TINGGI';
      } else if (items.length >= 3) {
        color = 'var(--color-risk-medium)';
        label = 'SEDANG';
      }
      return { kecamatan, count: items.length, lat: avgLat, lng: avgLng, color, label };
    });

  return (
    <MapContainer 
      center={SEMARANG_CENTER} 
      zoom={13} 
      className="w-full h-full rounded-[12px] z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapBounds reports={validReports} />
      
      {/* Zona Klaster */}
      {clusterZones.map((zone, idx) => (
        <Circle 
          key={`zone-${idx}`}
          center={[zone.lat, zone.lng]} 
          radius={800}
          pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.4 }}
        >
          <Popup>
            <div className="font-bold" style={{ color: zone.color }}>ZONA {zone.label}: {zone.kecamatan}</div>
            <div>{zone.count} Laporan Terverifikasi</div>
          </Popup>
        </Circle>
      ))}

      {/* Titik Laporan Individu */}
      {validReports.map((report) => (
        <Circle 
          key={report.id}
          center={[report.latitude!, report.longitude!]} 
          radius={100}
          pathOptions={{ color: getCategoryColor(report.kategori || null), fillColor: getCategoryColor(report.kategori || null), fillOpacity: 0.6 }}
        >
          <Popup>
            <div className="font-bold" style={{ color: getCategoryColor(report.kategori || null) }}>
              Laporan: {report.kecamatan}
            </div>
            <div className="text-sm">{report.gejala}</div>
            <div className="text-xs mt-1">Kategori: {report.kategori || 'Rendah'}</div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
