export function assignCoordinates(reports: any[]) {
  return reports.map(r => {
    if (r.latitude !== null && r.longitude !== null) return r;
    // Base coords for Semarang
    const baseLat = -6.966667;
    const baseLng = 110.416664;
    // Add some random jitter (approx 1-3km) to simulate different locations in kecamatan
    const lat = baseLat + (Math.random() - 0.5) * 0.04;
    const lng = baseLng + (Math.random() - 0.5) * 0.04;
    return { ...r, latitude: lat, longitude: lng };
  });
}
