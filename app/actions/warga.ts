'use server';

import prisma from '@/lib/prisma';
import { assignCoordinates } from '@/app/utils/geo';
import { z } from 'zod';
import { headers, cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';

/**
 * Mendapatkan persentase risiko berdasarkan data ProfilKecamatan
 */
export async function getRiskData(kecamatanName: string) {
  try {
    const profil = await prisma.profilKecamatan.findUnique({
      where: { namaKecamatan: kecamatanName }
    });

    if (!profil) {
      return { percentage: 0, tingkatRisiko: 'Rendah', found: false };
    }

    // Persentase Ketergantungan Air Tanah (Risiko Amblesan)
    const percentage = profil.totalPopulasi > 0 
      ? Math.round((profil.penggunaAirTanah / profil.totalPopulasi) * 100) 
      : 0;

    return {
      percentage,
      tingkatRisiko: profil.tingkatRisiko, // Tinggi, Sedang, Rendah
      found: true
    };
  } catch (error) {
    console.error("Error getRiskData:", error);
    return { percentage: 0, tingkatRisiko: 'Rendah', found: false };
  }
}

/**
 * Skema validasi menggunakan Zod
 */
const LaporanSchema = z.object({
  kecamatan: z.string().min(2, "Kecamatan tidak valid").max(100),
  gejala: z.string().min(5, "Gejala terlalu pendek").max(500, "Gejala maksimal 500 karakter"),
});

/**
 * Menyimpan laporan warga ke database dengan rate-limiting 5 menit per IP (Admin dikecualikan)
 */
export async function submitLaporan(kecamatan: string, gejala: string) {
  try {
    // 0. Cek apakah pemanggil adalah Admin (bypass rate-limit)
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    const isAdmin = await verifyAdminToken(adminToken);

    // Ambil IP Address untuk Rate Limiting
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ipAddress = forwarded 
      ? forwarded.split(',')[0].trim() 
      : (headersList.get('x-real-ip') || 'unknown');

    // 1. Cek Rate-Limiting (1 laporan per 5 Menit per IP untuk warga publik)
    if (!isAdmin && ipAddress !== 'unknown') {
      const lastReport = await prisma.laporanWarga.findFirst({
        where: { ipAddress },
        orderBy: { createdAt: 'desc' }
      });

      if (lastReport) {
        const minutesDiff = (new Date().getTime() - lastReport.createdAt.getTime()) / (1000 * 60);
        if (minutesDiff < 5) {
          const remainingMinutes = Math.ceil(5 - minutesDiff);
          return { 
            success: false, 
            error: `Anda hanya dapat mengirim 1 laporan setiap 5 menit. Harap tunggu ${remainingMinutes} menit lagi.` 
          };
        }
      }
    }

    // 2. Validasi Input
    const validated = LaporanSchema.parse({ kecamatan, gejala });

    // 3. Simpan ke Database
    const newLaporan = await prisma.laporanWarga.create({
      data: {
        kecamatan: validated.kecamatan,
        gejala: validated.gejala,
        ipAddress
      }
    });
    return { success: true, id: newLaporan.id };
  } catch (error) {
    console.error("Error submitLaporan:", error);
    return { success: false, error: 'Gagal menyimpan laporan. Silakan periksa kembali isian form Anda.' };
  }
}

/**
 * Menyimpan preferensi Onboarding warga ke ProfilKecamatan
 * Menambah pendaftar edukasi dan pengguna air tanah jika relevan
 */
export async function saveOnboardingResult(kecamatan: string, airType: string) {
  try {
    const existing = await prisma.profilKecamatan.findUnique({
      where: { namaKecamatan: kecamatan }
    });

    if (existing) {
      await prisma.profilKecamatan.update({
        where: { namaKecamatan: kecamatan },
        data: {
          pendaftarEdukasi: { increment: 1 },
          ...(airType === 'Air Tanah' ? { penggunaAirTanah: { increment: 1 } } : {})
        }
      });
    } else {
      await prisma.profilKecamatan.create({
        data: {
          namaKecamatan: kecamatan,
          tingkatRisiko: 'Sedang',
          pendaftarEdukasi: 1,
          totalPopulasi: 30000,
          penggunaAirTanah: airType === 'Air Tanah' ? 1 : 0
        }
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error saveOnboardingResult:", error);
    return { success: false, error: 'Gagal mencatat preferensi wilayah' };
  }
}

/**
 * Menyimpan laporan warga secara massal ke database (dari CSV/Excel Admin)
 */
export async function submitLaporanBatch(laporanList: { kecamatan: string, gejala: string }[]) {
  try {
    const validatedData = laporanList.map(item => LaporanSchema.parse(item));
    
    const result = await prisma.laporanWarga.createMany({
      data: validatedData,
      skipDuplicates: true,
    });
    
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error submitLaporanBatch:", error);
    return { success: false, error: 'Gagal menyimpan laporan massal. Pastikan format sesuai.' };
  }
}

/**
 * Mendapatkan laporan warga untuk peta dengan filter
 */
export async function getLaporanWargaForMap(filters?: { waktu?: string | null, kategori?: string | null, verifikasi?: string | null }) {
  try {
    const where: any = {};
    
    if (filters?.verifikasi !== 'Semua Laporan') {
      where.isVerified = true;
    }

    if (filters?.waktu === '24 Jam Terakhir') {
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);
      where.createdAt = { gte: yesterday };
    } else if (filters?.waktu === '7 Hari Terakhir') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      where.createdAt = { gte: lastWeek };
    }

    if (filters?.kategori === 'Demam / Gatal (Air Tanah)') {
      where.gejala = { contains: 'gatal', mode: 'insensitive' };
    } else if (filters?.kategori === 'Pernapasan') {
      where.gejala = { contains: 'napas', mode: 'insensitive' };
    }

    const laporanWargaRaw = await prisma.laporanWarga.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200
    });
    return assignCoordinates(laporanWargaRaw);
  } catch (error) {
    console.error("Error getLaporanWargaForMap:", error);
    return [];
  }
}

/**
 * Memperbarui status verifikasi laporan warga (Admin)
 */
export async function toggleVerifyLaporan(id: string, newStatus: boolean, kategori: string | null = null) {
  try {
    await prisma.laporanWarga.update({
      where: { id },
      data: { isVerified: newStatus, kategori: kategori }
    });
    return { success: true };
  } catch (error) {
    console.error("Error toggleVerifyLaporan:", error);
    return { success: false, error: 'Gagal memperbarui status verifikasi' };
  }
}

/**
 * Mendapatkan jumlah laporan warga di kecamatan tertentu pada rentang waktu (+- 12 jam)
 */
export async function getLaporanCount(kecamatan: string, timestamp: Date) {
  try {
    const start = new Date(timestamp);
    start.setHours(start.getHours() - 12);
    const end = new Date(timestamp);
    end.setHours(end.getHours() + 12);
    
    const count = await prisma.laporanWarga.count({
      where: {
        kecamatan,
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });
    return count;
  } catch (error) {
    console.error("Error getLaporanCount:", error);
    return 0;
  }
}

/**
 * Mengambil status notifikasi peringatan dini dinamis dari database untuk warga
 */
export async function getDynamicAlerts(kecamatan?: string) {
  try {
    const alerts = await prisma.dataCuacaGenangan.findMany({
      where: kecamatan ? { kecamatan } : undefined,
      orderBy: { timestamp: 'desc' },
      take: 5
    });

    const highRiskAlert = alerts.find(a => a.statusRisiko === 'Tinggi');
    const mediumRiskAlert = alerts.find(a => a.statusRisiko === 'Sedang');

    return {
      activeAlert: highRiskAlert || mediumRiskAlert || alerts[0] || null,
      recentAlerts: alerts
    };
  } catch (error) {
    console.error("Error getDynamicAlerts:", error);
    return { activeAlert: null, recentAlerts: [] };
  }
}

/**
 * Mengambil analitik Health Heat Map: tren mingguan dan kecamatan terdampak parah
 */
export async function getHealthMapAnalytics() {
  try {
    const now = new Date();

    // Rentang minggu ini (7 hari terakhir)
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    // Rentang minggu lalu (14-7 hari lalu)
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);

    const [thisWeekCount, lastWeekCount, allReports] = await Promise.all([
      prisma.laporanWarga.count({
        where: { createdAt: { gte: thisWeekStart } }
      }),
      prisma.laporanWarga.count({
        where: {
          createdAt: { gte: lastWeekStart, lt: thisWeekStart }
        }
      }),
      prisma.laporanWarga.groupBy({
        by: ['kecamatan'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1
      })
    ]);

    // Hitung persentase tren
    let trendPercent = 0;
    if (lastWeekCount > 0) {
      trendPercent = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
    } else if (thisWeekCount > 0) {
      trendPercent = 100; // Dari 0 ke positif = +100%
    }

    // Kecamatan dengan laporan terbanyak
    const topKecamatan = allReports.length > 0
      ? allReports[0].kecamatan
      : 'Belum ada data';

    return {
      trendPercent,
      topKecamatan,
      thisWeekCount,
      lastWeekCount
    };
  } catch (error) {
    console.error("Error getHealthMapAnalytics:", error);
    return { trendPercent: 0, topKecamatan: 'N/A', thisWeekCount: 0, lastWeekCount: 0 };
  }
}
