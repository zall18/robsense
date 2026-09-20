import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding RobSense database...');

  // 1. Buat Admin User
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@robsense.id' },
    update: {},
    create: {
      email: 'admin@robsense.id',
      password: 'hashed-password-dummy',
    },
  });
  console.log(`Verified admin user: ${admin.email}`);

  // 2. Buat Data Profil Kecamatan
  const profilData = [
    {
      namaKecamatan: 'Genuk',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 420,
      totalPopulasi: 32000,
      penggunaAirTanah: 27200, // 85%
    },
    {
      namaKecamatan: 'Semarang Utara',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 180,
      totalPopulasi: 45000,
      penggunaAirTanah: 32400, // 72%
    },
    {
      namaKecamatan: 'Tugu',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 240,
      totalPopulasi: 30000,
      penggunaAirTanah: 21000, // 70%
    },
    {
      namaKecamatan: 'Pedurungan',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 350,
      totalPopulasi: 40000,
      penggunaAirTanah: 23200, // 58%
    },
    {
      namaKecamatan: 'Gayamsari',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 1500,
      totalPopulasi: 28000,
      penggunaAirTanah: 12600, // 45%
    },
    {
      namaKecamatan: 'Semarang Barat',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 850,
      totalPopulasi: 36000,
      penggunaAirTanah: 15120, // 42%
    },
    {
      namaKecamatan: 'Semarang Tengah',
      tingkatRisiko: 'Rendah',
      pendaftarEdukasi: 5200,
      totalPopulasi: 55000,
      penggunaAirTanah: 16500, // 30%
    },
    {
      namaKecamatan: 'Banyumanik',
      tingkatRisiko: 'Rendah',
      pendaftarEdukasi: 3400,
      totalPopulasi: 50000,
      penggunaAirTanah: 17500, // 35%
    }
  ];

  for (const data of profilData) {
    await prisma.profilKecamatan.upsert({
      where: { namaKecamatan: data.namaKecamatan },
      update: data,
      create: data,
    });
  }
  console.log(`Upserted ${profilData.length} profil kecamatan.`);

  // 3. Buat Dummy Data Genangan & Cuaca (Realistis Semarang Pesisir)
  const cuacaData = [
    {
      kecamatan: 'Semarang Utara',
      statusRisiko: 'Tinggi',
      ketinggianAir: 125.4,
      trendStatus: 'Meningkat',
      suhu: 28.5,
      kelembapan: 85,
      kondisi: 'Hujan Sedang',
    },
    {
      kecamatan: 'Genuk',
      statusRisiko: 'Tinggi',
      ketinggianAir: 95.0,
      trendStatus: 'Meningkat',
      suhu: 29.0,
      kelembapan: 84,
      kondisi: 'Hujan Lebat',
    },
    {
      kecamatan: 'Tugu',
      statusRisiko: 'Sedang',
      ketinggianAir: 45.8,
      trendStatus: 'Stabil',
      suhu: 29.5,
      kelembapan: 80,
      kondisi: 'Hujan Ringan',
    },
    {
      kecamatan: 'Gayamsari',
      statusRisiko: 'Sedang',
      ketinggianAir: 55.2,
      trendStatus: 'Meningkat',
      suhu: 29.5,
      kelembapan: 82,
      kondisi: 'Hujan Ringan',
    },
    {
      kecamatan: 'Semarang Barat',
      statusRisiko: 'Sedang',
      ketinggianAir: 35.0,
      trendStatus: 'Stabil',
      suhu: 30.0,
      kelembapan: 78,
      kondisi: 'Berawan',
    },
    {
      kecamatan: 'Semarang Tengah',
      statusRisiko: 'Rendah',
      ketinggianAir: 12.0,
      trendStatus: 'Menurun',
      suhu: 31.0,
      kelembapan: 70,
      kondisi: 'Cerah',
    },
    {
      kecamatan: 'Banyumanik',
      statusRisiko: 'Rendah',
      ketinggianAir: 0.0,
      trendStatus: 'Menurun',
      suhu: 27.0,
      kelembapan: 75,
      kondisi: 'Cerah Berawan',
    }
  ];

  for (const data of cuacaData) {
    await prisma.dataCuacaGenangan.create({ data });
  }
  console.log(`Inserted ${cuacaData.length} catatan riwayat cuaca/genangan.`);

  // 4. Buat Contoh Laporan Warga
  const initialReports = [
    {
      kecamatan: 'Semarang Utara',
      gejala: 'Gatal-gatal di kaki dan ruam kulit setelah kontak air genangan rob.',
      isVerified: true,
      kategori: 'Tinggi',
    },
    {
      kecamatan: 'Genuk',
      gejala: 'Demam tinggi dan gatal-gatal sejak kemarin malam pasca genangan naik 30cm.',
      isVerified: true,
      kategori: 'Tinggi',
    },
    {
      kecamatan: 'Genuk',
      gejala: 'Air sumur terasa payau dan keruh saat dipompa, kulit terasa gatal.',
      isVerified: true,
      kategori: 'Sedang',
    },
    {
      kecamatan: 'Gayamsari',
      gejala: 'Saluran pembuangan meluap ke halaman rumah, bau tidak sedap.',
      isVerified: true,
      kategori: 'Sedang',
    },
    {
      kecamatan: 'Tugu',
      gejala: 'Air pasang masuk ke tambak dan jalan kampung, anak-anak gatal-gatal.',
      isVerified: false,
      kategori: 'Tinggi',
    },
    {
      kecamatan: 'Semarang Tengah',
      gejala: 'Genangan air surut lambat di jalan arteri pasca hujan lebat.',
      isVerified: false,
      kategori: 'Rendah',
    }
  ];

  for (const report of initialReports) {
    await prisma.laporanWarga.create({ data: report });
  }
  console.log(`Inserted ${initialReports.length} laporan warga.`);

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
