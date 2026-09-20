const KECAMATAN_COORDS: Record<string, [number, number]> = {
  'Genuk': [-6.9482, 110.4632],
  'Semarang Utara': [-6.9602, 110.4187],
  'Tugu': [-6.9744, 110.3342],
  'Semarang Barat': [-6.9800, 110.3800],
  'Semarang Tengah': [-6.9840, 110.4200],
  'Semarang Timur': [-6.9740, 110.4350],
  'Gayamsari': [-6.9803, 110.4485],
  'Pedurungan': [-6.9922, 110.4678],
  'Banyumanik': [-7.0652, 110.4184],
};

/**
 * Menghasilkan offset posisi yang deterministik berdasarkan ID laporan.
 * Mencegah marker melompat-lompat secara acak saat halaman di-refresh.
 */
function deterministicOffset(id: string, seed: number): number {
  let hash = seed;
  const key = id || 'robsense_fallback_id';
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  // Menghasilkan rentang [-0.01, +0.01] derajat (~1-1.2 km di sekitar pusat kecamatan)
  return (((Math.abs(hash) % 1000) / 1000) - 0.5) * 0.02;
}

export function assignCoordinates(reports: any[]) {
  return reports.map(r => {
    if (r.latitude !== null && r.longitude !== null && r.latitude !== undefined && r.longitude !== undefined) {
      return r;
    }
    // Titik pusat acuan Kota Semarang
    const baseLat = -6.966667;
    const baseLng = 110.416664;
    const coords = KECAMATAN_COORDS[r.kecamatan] || [baseLat, baseLng];
    
    // Gunakan hash deterministik dari ID laporan (atau gejala jika ID belum ada)
    const reportKey = r.id || `${r.kecamatan}_${r.gejala || ''}`;
    const lat = coords[0] + deterministicOffset(reportKey, 101);
    const lng = coords[1] + deterministicOffset(reportKey, 202);

    return { ...r, latitude: lat, longitude: lng };
  });
}
