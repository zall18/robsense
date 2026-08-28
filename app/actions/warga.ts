'use server';

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { z } from 'zod';

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
    // 1. Validasi Input (Mencegah Bypass & Spam Panjang)
    const validated = LaporanSchema.parse({ kecamatan, gejala });

    // 2. Simpan ke Database
    const newLaporan = await prisma.laporanWarga.create({
      data: {
        kecamatan: validated.kecamatan,
        gejala: validated.gejala,
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
