import { assignCoordinates } from '@/app/utils/geo';

describe('Geo Utilities (assignCoordinates)', () => {
  it('preserves existing latitude and longitude if already present', () => {
    const input = [
      { id: '1', kecamatan: 'Genuk', latitude: -6.95, longitude: 110.45 }
    ];
    const result = assignCoordinates(input);
    expect(result[0].latitude).toBe(-6.95);
    expect(result[0].longitude).toBe(110.45);
  });

  it('generates deterministic coordinates for the same report id across multiple calls', () => {
    const report = { id: 'report-abc-123', kecamatan: 'Genuk', gejala: 'Gatal-gatal' };
    
    const run1 = assignCoordinates([report]);
    const run2 = assignCoordinates([report]);

    expect(run1[0].latitude).toBeDefined();
    expect(run1[0].longitude).toBeDefined();
    expect(run1[0].latitude).toBe(run2[0].latitude);
    expect(run1[0].longitude).toBe(run2[0].longitude);
  });

  it('assigns coordinates for known Semarang districts', () => {
    const districts = ['Genuk', 'Semarang Utara', 'Tugu', 'Semarang Barat', 'Pedurungan', 'Banyumanik'];
    const reports = districts.map((kec, i) => ({ id: `rep-${i}`, kecamatan: kec }));
    
    const results = assignCoordinates(reports);
    results.forEach(r => {
      expect(r.latitude).toBeLessThan(0); // Southern hemisphere (Indonesia)
      expect(r.longitude).toBeGreaterThan(100); // Eastern longitude
    });
  });
});
