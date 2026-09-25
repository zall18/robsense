// === WEIGHTED MULTI-FACTOR RISK SCORING ENGINE (ROBSENSE DSDC 2026) ===
// Berbasis Kerangka Regulasi Perka BNPB No.2/2012:
// Risiko Bencana = f(Bahaya [Hazard 50%], Kerentanan [Vulnerability 35%], Kapasitas [Capacity 15%])

export type Kecamatan = 
  | 'Semarang Utara' | 'Genuk' | 'Tugu' | 'Gayamsari' 
  | 'Semarang Barat' | 'Pedurungan' | 'Semarang Timur' 
  | 'Semarang Tengah' | 'Banyumanik' | 'Gajahmungkur' | string;

export type WeatherCondition = 'Hujan' | 'Cerah' | 'Berawan' | string;
export type TideLevel = 'Tinggi' | 'Normal' | 'Rendah' | string;
export type RiskStatus = 'Tinggi' | 'Sedang' | 'Rendah';

export interface RiskFactors {
  kecamatan: string;
  weatherCondition: string;
  seaCondition?: string;     // BMKG Maritim Wave Category / Kondisi Gelombang
  tideLevel?: string;        // Alias backward-compatibility
  humidity?: number;         // % kelembapan udara (BMKG 'hu')
  windSpeed?: number;        // km/jam atau knot (BMKG 'ws')
  isManualInput?: boolean;
}

export interface RiskScoreBreakdown {
  subsidenceScore: number;    // maks 20 poin (Laju amblesan tanah Badan Geologi)
  weatherScore: number;       // maks 25 poin (Presipitasi, kelembapan, angin BMKG)
  seaScore: number;           // maks 25 poin (Tinggi gelombang BMKG Maritim)
  vulnerabilityScore: number; // maks 30 poin (Ketergantungan air tanah BPS & elevasi/drainase)
}

export interface ConfidenceInfo {
  level: 'Tinggi' | 'Sedang' | 'Rendah';
  percentage: number;
  source: string;
}

export interface RiskScoreResult {
  status: RiskStatus;
  score: number;              // 0 - 100
  breakdown: RiskScoreBreakdown;
  confidence: ConfidenceInfo;
  methodology: string;
}

// 1. Data Laju Amblesan Tanah per Kecamatan (cm/tahun) — Sumber: Badan Geologi & Publikasi Geodesi Undip
export const SUBSIDENCE_RATE: Record<string, number> = {
  'Semarang Utara': 9.0,    // Pesisir pelabuhan Tanjung Mas, laju amblesan tertinggi
  'Genuk': 7.0,             // Dataran aluvial & kawasan industri Terboyo
  'Tugu': 6.5,              // Pesisir barat & kawasan tambak Mangkang
  'Gayamsari': 5.0,         // Aluvial Kaligawe / Banjir Kanal Timur
  'Semarang Barat': 4.0,    // Pesisir barat bandara & muara BKB
  'Pedurungan': 3.5,        // Dataran aluvial transisi timur
  'Semarang Timur': 2.5,    // Zona permukiman tengah-timur
  'Semarang Tengah': 1.5,   // Pusat kota komersial, drainase polder relatif baik
  'Banyumanik': 0.5,        // Semarang atas, batuan vulkanik / zona resapan
  'Gajahmungkur': 0.3,      // Perbukitan struktural
};

// 2. Data Ketergantungan Air Tanah (Rasio Pengguna Air Tanah terhadap Populasi) — Sumber: BPS Kota Semarang 2024
export const GROUNDWATER_DEPENDENCY: Record<string, number> = {
  'Genuk': 0.84,
  'Semarang Utara': 0.74,
  'Tugu': 0.71,
  'Gayamsari': 0.66,
  'Pedurungan': 0.56,
  'Semarang Barat': 0.47,
  'Semarang Timur': 0.43,
  'Semarang Tengah': 0.35,
  'Banyumanik': 0.32,
  'Gajahmungkur': 0.30,
};

// 3. Faktor Kapasitas Balik Elevasi & Drainase Gravitasi (Skor tinggi = kapasitas rendah / elevasi rendah)
export const ELEVATION_INVERSE_CAPACITY: Record<string, number> = {
  'Semarang Utara': 11,
  'Tugu': 10,
  'Genuk': 10,
  'Gayamsari': 8,
  'Semarang Barat': 7,
  'Pedurungan': 5,
  'Semarang Timur': 4,
  'Semarang Tengah': 3,
  'Banyumanik': 1,
  'Gajahmungkur': 0,
};

// Mapping Kelurahan ke Kecamatan Induk
const KELURAHAN_TO_KECAMATAN: Record<string, string> = {
  // Semarang Utara
  'tanjung mas': 'Semarang Utara',
  'bandarharjo': 'Semarang Utara',
  'panggung lor': 'Semarang Utara',
  'panggung kidul': 'Semarang Utara',
  'kuningan': 'Semarang Utara',
  'dadapsari': 'Semarang Utara',
  'bulu lor': 'Semarang Utara',
  'plombokan': 'Semarang Utara',
  // Genuk
  'terboyo wetan': 'Genuk',
  'terboyo kulon': 'Genuk',
  'trimulyo': 'Genuk',
  'muktiharjo lor': 'Genuk',
  'mukti harjo lor': 'Genuk',
  'genuksari': 'Genuk',
  'bangetayu kulon': 'Genuk',
  'bangetayu wetan': 'Genuk',
  'karangroto': 'Genuk',
  'banjardowo': 'Genuk',
  'gebangsari': 'Genuk',
  // Tugu
  'mangkang kulon': 'Tugu',
  'mangkang wetan': 'Tugu',
  'mangunharjo': 'Tugu',
  'randugarut': 'Tugu',
  'karanganyar': 'Tugu',
  'tugurejo': 'Tugu',
  'jerakah': 'Tugu',
  // Gayamsari
  'tambakrejo': 'Gayamsari',
  'kaligawe': 'Gayamsari',
  'sawah besar': 'Gayamsari',
  'gayamsari': 'Gayamsari',
  'siwalan': 'Gayamsari',
  'sambirejo': 'Gayamsari',
  'pandean lamper': 'Gayamsari',
  // Pedurungan
  'muktiharjo kidul': 'Pedurungan',
  'tlogosari kulon': 'Pedurungan',
  'tlogosari wetan': 'Pedurungan',
  'kalicari': 'Pedurungan',
  'palebon': 'Pedurungan',
  'pedurungan tengah': 'Pedurungan',
  'pedurungan kidul': 'Pedurungan',
  'pedurungan lor': 'Pedurungan',
  'gemah': 'Pedurungan',
  'plamongan sari': 'Pedurungan',
  'penggaron kidul': 'Pedurungan',
};

export function resolveKecamatan(name: string): string {
  if (!name) return 'Semarang Tengah';
  const clean = name.trim().toLowerCase().replace(/^kecamatan\s+/i, '').replace(/^kec\.\s*/i, '');
  
  if (KELURAHAN_TO_KECAMATAN[clean]) {
    return KELURAHAN_TO_KECAMATAN[clean];
  }
  for (const [kel, kec] of Object.entries(KELURAHAN_TO_KECAMATAN)) {
    if (clean.includes(kel)) return kec;
  }
  for (const kec of Object.keys(SUBSIDENCE_RATE)) {
    if (clean === kec.toLowerCase() || clean.includes(kec.toLowerCase())) {
      return kec;
    }
  }
  return name.trim();
}

export function calculateConfidence(factors: {
  hasWeatherData: boolean;
  hasMarineData: boolean;
  isManualInput?: boolean;
}): ConfidenceInfo {
  if (factors.isManualInput) {
    return {
      level: 'Rendah',
      percentage: 45,
      source: 'Input Manual Administrator'
    };
  }
  if (factors.hasWeatherData && factors.hasMarineData) {
    return {
      level: 'Tinggi',
      percentage: 92,
      source: 'API BMKG Wilayah + BMKG Maritim (Real-time)'
    };
  }
  if (factors.hasWeatherData || factors.hasMarineData) {
    return {
      level: 'Sedang',
      percentage: 68,
      source: 'API BMKG Parsial (Fallback Model)'
    };
  }
  return {
    level: 'Rendah',
    percentage: 30,
    source: 'Data Estimasi Statis'
  };
}

/**
 * Kalkulasi Multi-Faktor Terbobot berbasis Perka BNPB No.2/2012
 */
export function calculateDetailedRiskScore(factors: RiskFactors): RiskScoreResult {
  const normalizedKecamatan = resolveKecamatan(factors.kecamatan);
  const subsidence = SUBSIDENCE_RATE[normalizedKecamatan] ?? 2.0;
  const groundwater = GROUNDWATER_DEPENDENCY[normalizedKecamatan] ?? 0.40;
  const capacityInverse = ELEVATION_INVERSE_CAPACITY[normalizedKecamatan] ?? 5;

  // === 1. KOMPONEN BAHAYA (HAZARD) — BOBOT TOTAL 50% ===
  // A. Cuaca & Presipitasi (Maks 25 poin)
  let weatherScore = 0;
  const w = (factors.weatherCondition || '').toLowerCase();
  if (w.includes('lebat') || w.includes('petir') || w.includes('ekstrem') || w.includes('badai')) {
    weatherScore = 25;
  } else if (w.includes('hujan sedang')) {
    weatherScore = 18;
  } else if (w.includes('hujan ringan') || w.includes('hujan lokal') || w.includes('hujan')) {
    weatherScore = 12;
  } else if (w.includes('berawan') || w.includes('kabut') || w.includes('udara kabur')) {
    weatherScore = 5;
  } else {
    weatherScore = 0; // Cerah
  }

  // Parameter tambahan BMKG: Kelembapan & Kecepatan Angin
  if (factors.humidity && factors.humidity > 85 && weatherScore > 0) {
    weatherScore += 2; // Kelembapan sangat tinggi memicu presipitasi berulang
  }
  if (factors.windSpeed && factors.windSpeed > 20) {
    weatherScore += 3; // Angin kencang mendorong akumulasi genangan / storm surge
  }
  weatherScore = Math.min(weatherScore, 25);

  // B. Kondisi Laut / Gelombang Pasang BMKG Maritim (Maks 25 poin)
  let seaScore = 0;
  const seaInput = (factors.seaCondition || factors.tideLevel || '').toLowerCase();
  if (seaInput.includes('sangat tinggi') || seaInput.includes('ekstrem') || seaInput.includes('berbahaya')) {
    seaScore = 25;
  } else if (seaInput.includes('tinggi')) {
    seaScore = 20;
  } else if (seaInput.includes('sedang')) {
    seaScore = 10;
  } else if (seaInput.includes('rendah')) {
    seaScore = 5;
  } else {
    seaScore = 0; // Tenang / Normal
  }
  seaScore = Math.min(seaScore, 25);

  // === 2. KOMPONEN KERENTANAN (VULNERABILITY) — BOBOT TOTAL 35% ===
  // Laju Amblesan Tanah (0 - 20 poin, dinormalisasi dari 0 - 9.0 cm/tahun)
  const rawSubsidenceScore = Math.min((subsidence / 9.0) * 20, 20);
  const subsidenceScore = Math.round(rawSubsidenceScore * 10) / 10;

  // Ketergantungan Air Tanah (0 - 12 poin)
  const rawGroundwaterScore = groundwater * 12;

  // === 3. KOMPONEN KAPASITAS BALIK / ELEVASI DRAINASE (CAPACITY INVERSE) — BOBOT 15% ===
  // Kapasitas rendah / elevasi cekungan (0 - 18 poin)
  const rawVulnerabilityScore = Math.min(30, rawGroundwaterScore + capacityInverse);
  const vulnerabilityScore = Math.round(rawVulnerabilityScore * 10) / 10;

  // === 4. TOTAL SKOR RISIKO (0 - 100) ===
  const totalScore = Math.round(
    weatherScore + seaScore + subsidenceScore + vulnerabilityScore
  );
  const finalScore = Math.min(100, Math.max(0, totalScore));

  // Threshold Klasifikasi Status Risiko
  let status: RiskStatus = 'Rendah';
  if (finalScore >= 50) {
    status = 'Tinggi';
  } else if (finalScore >= 28) {
    status = 'Sedang';
  } else {
    status = 'Rendah';
  }

  const confidence = calculateConfidence({
    hasWeatherData: Boolean(factors.weatherCondition && factors.weatherCondition !== 'Unknown'),
    hasMarineData: Boolean(factors.seaCondition || factors.tideLevel),
    isManualInput: Boolean(factors.isManualInput),
  });

  return {
    status,
    score: finalScore,
    breakdown: {
      subsidenceScore: Math.round(subsidenceScore),
      weatherScore: Math.round(weatherScore),
      seaScore: Math.round(seaScore),
      vulnerabilityScore: Math.round(vulnerabilityScore),
    },
    confidence,
    methodology: 'Adaptasi Perka BNPB No.2/2012: Risiko = f(Bahaya, Kerentanan, Kapasitas)',
  };
}

// Overload signature untuk menjaga kompatibilitas ke fungsi pemanggil lama
export function calculateRiskScore(factors: RiskFactors): RiskScoreResult;
export function calculateRiskScore(
  kecamatan: Kecamatan,
  weatherCondition: WeatherCondition,
  tideLevel: TideLevel
): RiskStatus;
export function calculateRiskScore(
  param1: Kecamatan | RiskFactors,
  weatherCondition?: WeatherCondition,
  tideLevel?: TideLevel
): RiskStatus | RiskScoreResult {
  if (typeof param1 === 'object' && param1 !== null) {
    return calculateDetailedRiskScore(param1);
  }

  const result = calculateDetailedRiskScore({
    kecamatan: param1,
    weatherCondition: weatherCondition || '',
    seaCondition: tideLevel || 'Normal',
  });

  return result.status;
}

