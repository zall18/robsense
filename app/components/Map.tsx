"use client";
import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const SEMARANG_CENTER: [number, number] = [-6.966667, 110.416664];

export default function Map({ reports = [] }: { reports?: { id: string, latitude: number | null, longitude: number | null, gejala: string, kecamatan: string }[] }) {
  // Filter only reports with valid coordinates
  const validReports = reports.filter(r => r.latitude !== null && r.longitude !== null);

  // Clustering for Red Zones (>= 5 reports)
  const grouped: Record<string, typeof validReports> = {};
  validReports.forEach(r => {
    if (!grouped[r.kecamatan]) grouped[r.kecamatan] = [];
    grouped[r.kecamatan].push(r);
  });

  const redZones = Object.entries(grouped)
    .filter(([_, items]) => items.length >= 5)
    .map(([kecamatan, items]) => {
      const avgLat = items.reduce((sum, r) => sum + r.latitude!, 0) / items.length;
      const avgLng = items.reduce((sum, r) => sum + r.longitude!, 0) / items.length;
      return { kecamatan, count: items.length, lat: avgLat, lng: avgLng };
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
      
      {/* Zona Merah (Klaster >= 5 laporan) */}
      {redZones.map((zone, idx) => (
        <Circle 
          key={`zone-${idx}`}
          center={[zone.lat, zone.lng]} 
          radius={800}
          pathOptions={{ color: 'var(--color-risk-high)', fillColor: 'var(--color-risk-high)', fillOpacity: 0.4 }}
        >
          <Popup>
            <div className="font-bold text-[var(--color-risk-high)]">ZONA MERAH: {zone.kecamatan}</div>
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
          pathOptions={{ color: 'var(--color-risk-high)', fillColor: 'var(--color-risk-high)', fillOpacity: 0.6 }}
        >
          <Popup>
            <div className="font-bold text-[var(--color-risk-high)]">Laporan: {report.kecamatan}</div>
            <div className="text-sm">{report.gejala}</div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
