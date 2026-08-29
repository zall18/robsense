const KECAMATAN_COORDS: Record<string, [number, number]> = {
  'Genuk': [-6.9482, 110.4632],
  'Semarang Utara': [-6.9602, 110.4187],
  'Tugu': [-6.9744, 110.3342],
  'Semarang Barat': [-6.9800, 110.3800],
  'Semarang Tengah': [-6.9840, 110.4200]
};

export function assignCoordinates(reports: any[]) {
  return reports.map(r => {
    if (r.latitude !== null && r.longitude !== null) return r;
    // Default coords for Semarang
    const baseLat = -6.966667;
    const baseLng = 110.416664;
    const coords = KECAMATAN_COORDS[r.kecamatan] || [baseLat, baseLng];
    
    // Add random jitter (approx 1-2km) to simulate different locations in kecamatan
    const lat = coords[0] + (Math.random() - 0.5) * 0.02;
    const lng = coords[1] + (Math.random() - 0.5) * 0.02;
    return { ...r, latitude: lat, longitude: lng };
  });
}
