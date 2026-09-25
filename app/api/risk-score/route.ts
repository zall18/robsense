import { NextResponse } from 'next/server';
import { calculateDetailedRiskScore } from '@/lib/riskEngine';
import prisma from '@/lib/prisma';
import { fetchMarineWeather, fetchDistrictWeather } from '@/lib/fetchWeather';

export async function POST(request: Request) {
  try {
    // 1. Validasi Token (Mencegah Abuse API / Unauthorized Call)
    const expectedSecret = process.env.CRON_SECRET || 'robsense_cron_secret_dsdc_2026';
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let { 
      kecamatan, 
      adm4, 
      suhu, 
      kelembapan, 
      kecepatanAngin, 
      kondisi, 
      pasangSurut, 
      kondisiLaut, 
      ketinggianAir 
    } = body;

    let hasWeatherData = false;
    let hasMarineData = false;

    // Mode Otomatis (jika adm4 disediakan, tarik data cuaca & maritim BMKG)
    if (adm4) {
      const [weatherData, marineData] = await Promise.all([
        fetchDistrictWeather(adm4),
        fetchMarineWeather()
      ]);

      if (weatherData && weatherData.data && weatherData.data[0]?.cuaca?.length > 0) {
        // Ambil data observasi/prakiraan cuaca terbaru (indeks 0)
        const currentCuaca = weatherData.data[0].cuaca[0][0];
        suhu = currentCuaca.t;
        kondisi = currentCuaca.weather_desc;
        kelembapan = currentCuaca.hu;       // Kelembapan udara (%)
        kecepatanAngin = currentCuaca.ws;   // Kecepatan angin (km/h)
        hasWeatherData = true;
      }

      // Ambil kondisi gelombang laut dari BMKG Maritim (Perairan Semarang-Demak)
      if (marineData && marineData.data && marineData.data.length > 0) {
        const waveCat = marineData.data[0].wave_cat; // "Tenang", "Rendah", "Sedang", "Tinggi", dll
        kondisiLaut = waveCat;
        pasangSurut = waveCat.toLowerCase().includes('tinggi') || waveCat.toLowerCase().includes('ekstrem') ? 'Tinggi' : 'Normal';
        hasMarineData = true;
      }
    }

    // Fallback jika tidak lewat adm4 tapi lewat payload langsung
    kondisiLaut = kondisiLaut || pasangSurut || 'Tenang';

    if (!kecamatan || !kondisi) {
      return NextResponse.json({ 
        error: 'Data tidak lengkap untuk kalkulasi (butuh minimal kecamatan dan kondisi cuaca).' 
      }, { status: 400 });
    }

    // 2. Kalkulasi Skor Risiko Multi-Faktor Terbobot (Perka BNPB No.2/2012)
    const result = calculateDetailedRiskScore({
      kecamatan,
      weatherCondition: kondisi,
      seaCondition: kondisiLaut,
      humidity: kelembapan ? parseFloat(kelembapan.toString()) : undefined,
      windSpeed: kecepatanAngin ? parseFloat(kecepatanAngin.toString()) : undefined,
      isManualInput: !adm4 && !hasWeatherData,
    });

    // 3. Analisis Tren Historis Otomatis
    const previousRecord = await prisma.dataCuacaGenangan.findFirst({
      where: { kecamatan },
      orderBy: { timestamp: 'desc' },
    });

    let trendStatus = 'Stabil';
    if (previousRecord?.riskScore !== null && previousRecord?.riskScore !== undefined) {
      const diff = result.score - previousRecord.riskScore;
      if (diff >= 8) trendStatus = 'Meningkat';
      else if (diff <= -8) trendStatus = 'Menurun';
    }

    // 4. Simpan Log Terperinci ke Database
    const savedData = await prisma.dataCuacaGenangan.create({
      data: {
        kecamatan,
        statusRisiko: result.status,
        riskScore: result.score,
        weatherScore: result.breakdown.weatherScore,
        seaScore: result.breakdown.seaScore,
        subsidenceScore: result.breakdown.subsidenceScore,
        vulnerabilityScore: result.breakdown.vulnerabilityScore,
        kondisiLaut,
        confidenceLevel: result.confidence.level,
        ketinggianAir: ketinggianAir ? parseFloat(ketinggianAir.toString()) : null,
        trendStatus,
        suhu: suhu ? parseFloat(suhu.toString()) : null,
        kelembapan: kelembapan ? parseFloat(kelembapan.toString()) : null,
        kecepatanAngin: kecepatanAngin ? parseFloat(kecepatanAngin.toString()) : null,
        kondisi,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: savedData,
      calculation: {
        score: result.score,
        status: result.status,
        breakdown: result.breakdown,
        trend: trendStatus,
        confidence: result.confidence,
        methodology: result.methodology,
      }
    });
  } catch (error) {
    console.error('Risk Score API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

