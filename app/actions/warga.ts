'use server';

import { PrismaClient, LaporanWarga } from '@prisma/client';
import { assignCoordinates } from '@/app/utils/geo';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { z } from 'zod';
import { headers } from 'next/headers';

// Kita pastikan inisiasi koneksi sama dengan yang lain
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
 * Menyimpan laporan warga ke database
 */
export async function submitLaporan(kecamatan: string, gejala: string) {
  try {
    // 0. Ambil IP Address untuk Rate Limiting
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    // 1. Cek Rate-Limiting (5 Menit)
    if (ipAddress !== 'unknown') {
      const lastReport = await prisma.laporanWarga.findFirst({
        where: { ipAddress },
        orderBy: { createdAt: 'desc' }
      });

      if (lastReport) {
        const minutesDiff = (new Date().getTime() - lastReport.createdAt.getTime()) / (1000 * 60);
        if (minutesDiff < 5) {
          return { success: false, error: `Anda melapor terlalu cepat. Harap tunggu ${Math.ceil(5 - minutesDiff)} menit lagi.` };
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
    return { success: false, error: 'Gagal menyimpan laporan' };
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
