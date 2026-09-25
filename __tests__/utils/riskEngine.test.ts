import { 
  calculateRiskScore, 
  calculateDetailedRiskScore, 
  resolveKecamatan 
} from '@/lib/riskEngine';

describe('Risk Engine Calculation - Backward Compatibility', () => {
  it('Semarang Utara (Amblesan Tinggi): Hujan -> Tinggi', () => {
    expect(calculateRiskScore('Semarang Utara', 'Hujan Lebat', 'Normal')).toBe('Tinggi');
  });

  it('Semarang Utara (Amblesan Tinggi): Pasang Tinggi -> Tinggi', () => {
    expect(calculateRiskScore('Semarang Utara', 'Cerah', 'Tinggi')).toBe('Tinggi');
  });

  it('Semarang Utara (Amblesan Tinggi): Cerah & Pasang Normal -> Sedang', () => {
    expect(calculateRiskScore('Semarang Utara', 'Cerah Berawan', 'Normal')).toBe('Sedang');
  });

  it('Gayamsari (Amblesan Sedang): Hujan & Pasang Tinggi -> Tinggi', () => {
    expect(calculateRiskScore('Gayamsari', 'Hujan Sedang', 'Sangat Tinggi')).toBe('Tinggi');
  });

  it('Gayamsari (Amblesan Sedang): Hujan saja -> Sedang', () => {
    expect(calculateRiskScore('Gayamsari', 'Hujan', 'Normal')).toBe('Sedang');
  });

  it('Gayamsari (Amblesan Sedang): Cerah -> Rendah', () => {
    expect(calculateRiskScore('Gayamsari', 'Cerah', 'Normal')).toBe('Rendah');
  });
});

describe('Risk Engine - Kecamatan Tugu & Resolusi Kelurahan (P0 Fix)', () => {
  it('Tugu (Amblesan 6.5 cm/th): Hujan Lebat -> Tinggi', () => {
    const res = calculateRiskScore('Tugu', 'Hujan Lebat', 'Normal');
    expect(res).toBe('Tinggi');
  });

  it('Tugu: Gelombang Pasang Tinggi -> Tinggi', () => {
    const res = calculateRiskScore('Tugu', 'Cerah', 'Tinggi');
    expect(res).toBe('Tinggi');
  });

  it('Tugu: Cerah & Gelombang Tenang -> Sedang (Amblesan tinggi tetap waspada)', () => {
    const res = calculateRiskScore('Tugu', 'Cerah', 'Tenang');
    expect(res).toBe('Sedang');
  });

  it('Resolusi kelurahan Mangkang Kulon ke Kecamatan Tugu', () => {
    expect(resolveKecamatan('Mangkang Kulon')).toBe('Tugu');
    const res = calculateDetailedRiskScore({
      kecamatan: 'Mangkang Kulon',
      weatherCondition: 'Hujan Lebat',
      seaCondition: 'Normal'
    });
    expect(res.status).toBe('Tinggi');
    expect(res.breakdown.subsidenceScore).toBe(14); // Amblesan Tugu 6.5 cm -> 14.4
  });

  it('Resolusi kelurahan Tanjung Mas ke Semarang Utara', () => {
    expect(resolveKecamatan('Tanjung Mas')).toBe('Semarang Utara');
  });
});

describe('Risk Engine - Multi-Factor Weighted Scoring (Perka BNPB No.2/2012)', () => {
  it('Menghasilkan skor numerik 0-100 dan breakdown lengkap', () => {
    const result = calculateDetailedRiskScore({
      kecamatan: 'Genuk',
      weatherCondition: 'Hujan Sedang',
      seaCondition: 'Tinggi',
      humidity: 88,
      windSpeed: 24,
    });

    expect(result.status).toBe('Tinggi');
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.breakdown).toHaveProperty('weatherScore');
    expect(result.breakdown).toHaveProperty('seaScore');
    expect(result.breakdown).toHaveProperty('subsidenceScore');
    expect(result.breakdown).toHaveProperty('vulnerabilityScore');
    expect(result.methodology).toContain('BNPB');
    expect(result.confidence.level).toBe('Tinggi');
  });

  it('Gajahmungkur (Perbukitan): Cuaca cerah dan laut tenang menghasilkan skor rendah (< 20)', () => {
    const result = calculateDetailedRiskScore({
      kecamatan: 'Gajahmungkur',
      weatherCondition: 'Cerah',
      seaCondition: 'Tenang',
    });

    expect(result.status).toBe('Rendah');
    expect(result.score).toBeLessThan(20);
    expect(result.breakdown.subsidenceScore).toBeLessThanOrEqual(2);
  });

  it('Semarang Barat: Hujan dan gelombang tinggi menghasilkan status Tinggi', () => {
    const result = calculateDetailedRiskScore({
      kecamatan: 'Semarang Barat',
      weatherCondition: 'Hujan Lebat',
      seaCondition: 'Tinggi',
    });

    expect(result.status).toBe('Tinggi');
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it('Confidence score menurun bila data hanya input manual', () => {
    const result = calculateDetailedRiskScore({
      kecamatan: 'Semarang Tengah',
      weatherCondition: 'Berawan',
      seaCondition: 'Normal',
      isManualInput: true,
    });

    expect(result.confidence.level).toBe('Rendah');
    expect(result.confidence.percentage).toBeLessThanOrEqual(50);
  });
});

