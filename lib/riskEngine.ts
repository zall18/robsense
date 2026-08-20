export type Kecamatan = 'Semarang Utara' | 'Genuk' | 'Gayamsari' | 'Pedurungan' | string;

export type WeatherCondition = 'Hujan' | 'Cerah' | 'Berawan' | string;
export type TideLevel = 'Tinggi' | 'Normal' | 'Rendah' | string;
export type RiskStatus = 'Tinggi' | 'Sedang' | 'Rendah';

// Daftar kecamatan dengan amblesan tinggi (Semarang Utara & Genuk dan kelurahannya)
const HIGH_SUBSIDENCE_AREAS = [
  'Semarang Utara', 'Genuk', 
  'Tanjung Mas', 'Bandarharjo', 'Panggung Lor', 'Panggung Kidul', 'Kuningan', 'Dadapsari', 
  'Terboyo Wetan', 'Terboyo Kulon', 'Trimulyo', 'Mukti Harjo Lor', 'Genuksari'
];

// Daftar kecamatan dengan amblesan sedang (Gayamsari & Pedurungan dan kelurahannya)
const MEDIUM_SUBSIDENCE_AREAS = [
  'Gayamsari', 'Pedurungan', 
  'Tambakrejo', 'Kaligawe', 'Sawah Besar', 
  'Muktiharjo Kidul', 'Tlogosari Kulon', 'Tlogosari Wetan'
];

export function calculateRiskScore(
  kecamatan: Kecamatan,
  weatherCondition: WeatherCondition,
  tideLevel: TideLevel
): RiskStatus {
  const isRaining = weatherCondition.toLowerCase().includes('hujan');
  const isHighTide = tideLevel.toLowerCase() === 'tinggi' || tideLevel.toLowerCase() === 'ekstrem' || tideLevel.toLowerCase().includes('tinggi');

  if (HIGH_SUBSIDENCE_AREAS.includes(kecamatan)) {
    // Semarang Utara & Genuk (Amblesan Tinggi)
    // Jika cuaca "Hujan" ATAU input pasang air "Tinggi" -> Risiko Tinggi (Merah)
    if (isRaining || isHighTide) {
      return 'Tinggi';
    }
    // Jika cuaca cerah/berawan -> Risiko Sedang (Kuning)
    return 'Sedang';
  }

  if (MEDIUM_SUBSIDENCE_AREAS.includes(kecamatan)) {
    // Gayamsari & Pedurungan (Amblesan Sedang)
    // Jika cuaca "Hujan" DAN pasang air "Tinggi" -> Risiko Tinggi
    if (isRaining && isHighTide) {
      return 'Tinggi';
    }
    // Jika hujan saja -> Sedang
    if (isRaining) {
      return 'Sedang';
    }
    // Jika cerah -> Rendah (Hijau)
    return 'Rendah';
  }

  // Fallback untuk daerah lain
  if (isRaining && isHighTide) return 'Tinggi';
  if (isRaining || isHighTide) return 'Sedang';
  return 'Rendah';
}
