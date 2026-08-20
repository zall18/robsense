"use client";
import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Koordinat Semarang Tengah/Utara
const SEMARANG_CENTER: [number, number] = [-6.966667, 110.416664];

export default function Map() {
  return (
    <MapContainer 
      center={SEMARANG_CENTER} 
      zoom={13} 
      className="w-full h-full rounded-[12px] z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {/* Zona Merah 1: Tegalrejo Dummy */}
      <Circle 
        center={[-6.955, 110.420]} 
        radius={800}
        pathOptions={{ color: 'var(--color-risk-high)', fillColor: 'var(--color-risk-high)', fillOpacity: 0.4 }}
      >
        <Popup>
          <div className="font-bold text-[var(--color-risk-high)]">ZONA MERAH: Tegalrejo</div>
          <div>11 Laporan</div>
        </Popup>
      </Circle>

      {/* Zona Merah 2: Pecinan Dummy */}
      <Circle 
        center={[-6.975, 110.425]} 
        radius={600}
        pathOptions={{ color: 'var(--color-risk-high)', fillColor: 'var(--color-risk-high)', fillOpacity: 0.4 }}
      >
        <Popup>
          <div className="font-bold text-[var(--color-risk-high)]">ZONA MERAH: Pecinan</div>
          <div>14 Laporan</div>
        </Popup>
      </Circle>
      
      {/* Titik laporan individual (dummy scatter) */}
      {[
        [-6.95, 110.415], [-6.96, 110.422], [-6.958, 110.418], 
        [-6.952, 110.419], [-6.972, 110.421], [-6.978, 110.428], 
        [-6.971, 110.426], [-6.961, 110.430], [-6.955, 110.435]
      ].map((pos, idx) => (
        <Circle 
          key={idx}
          center={pos as [number, number]} 
          radius={50}
          pathOptions={{ color: 'var(--color-risk-medium)', fillColor: 'var(--color-risk-medium)', fillOpacity: 0.8, stroke: false }}
        />
      ))}
    </MapContainer>
  );
}
