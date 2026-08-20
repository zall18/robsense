import { calculateRiskScore } from '@/lib/riskEngine';

describe('Risk Engine Calculation', () => {
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
