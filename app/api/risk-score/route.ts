import { NextResponse } from 'next/server';
import { calculateRiskScore } from '@/lib/riskEngine';
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
    let { kecamatan, adm4, suhu, kondisi, pasangSurut } = body;

    // Mode Otomatis (jika adm4 disediakan, tarik data cuaca BMKG)
    if (adm4) {
      const weatherData = await fetchDistrictWeather(adm4);
      const marineData = await fetchMarineWeather();

      if (weatherData && weatherData.data && weatherData.data[0].cuaca.length > 0) {
        // Ambil prakiraan cuaca terbaru (indeks 0)
        const currentCuaca = weatherData.data[0].cuaca[0][0]; 
        suhu = currentCuaca.t;
        kondisi = currentCuaca.weather_desc;
        
        // Ambil pasang surut dari marine data API (Perairan Semarang-Demak)
        if (marineData && marineData.data && marineData.data.length > 0) {
          const waveCat = marineData.data[0].wave_cat; // "Tenang", "Rendah", "Sedang", "Tinggi", dll
          pasangSurut = waveCat.toLowerCase().includes('tinggi') || waveCat.toLowerCase().includes('ekstrem') ? 'Tinggi' : 'Normal';
        } else {
          pasangSurut = 'Normal';
        }
      }
    }

    if (!kecamatan || !kondisi || !pasangSurut) {
      return NextResponse.json({ error: 'Data tidak lengkap untuk kalkulasi (butuh kecamatan, kondisi, pasangSurut).' }, { status: 400 });
    }

    const statusRisiko = calculateRiskScore(kecamatan, kondisi, pasangSurut);

    // Simpan ke database
    const savedData = await prisma.dataCuacaGenangan.create({
      data: {
        kecamatan,
        statusRisiko,
        suhu: suhu ? parseFloat(suhu.toString()) : null,
        kelembapan: null,
        kondisi,
      },
    });

    return NextResponse.json({ success: true, data: savedData });
  } catch (error) {
    console.error('Risk Score API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
