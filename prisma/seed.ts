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

  // 2. Buat Data Profil Kecamatan (Berdasarkan Data Riil BPS Kota Semarang 2024 & PDAM Tirta Moedal)
  const profilData = [
    {
      namaKecamatan: 'Genuk',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 1520, // Warga terdaftar program edukasi air
      totalPopulasi: 120450, // Riil BPS 2024
      penggunaAirTanah: 101178, // 84% ketergantungan air tanah (zona kritis amblesan ~7 cm/thn)
    },
    {
      namaKecamatan: 'Semarang Utara',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 1340,
      totalPopulasi: 126840, // Riil BPS 2024 (Tanjung Mas, Bandarharjo)
      penggunaAirTanah: 93861, // 74% ketergantungan air tanah (laju amblesan ~9 cm/thn)
    },
    {
      namaKecamatan: 'Tugu',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 480,
      totalPopulasi: 35620, // Pesisir barat Semarang
      penggunaAirTanah: 25290, // 71% ketergantungan air tanah
    },
    {
      namaKecamatan: 'Gayamsari',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 960,
      totalPopulasi: 73180, // Wilayah Kaligawe & Tambakrejo
      penggunaAirTanah: 48300, // 66% ketergantungan air tanah
    },
    {
      namaKecamatan: 'Pedurungan',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 1850,
      totalPopulasi: 194200, // Kecamatan terpadat di Kota Semarang
      penggunaAirTanah: 108752, // 56% ketergantungan air tanah
    },
    {
      namaKecamatan: 'Semarang Barat',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 1120,
      totalPopulasi: 155400,
      penggunaAirTanah: 73038, // 47% ketergantungan air tanah
    },
    {
      namaKecamatan: 'Semarang Timur',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 750,
      totalPopulasi: 74300,
      penggunaAirTanah: 31950, // 43% ketergantungan air tanah
    },
    {
      namaKecamatan: 'Semarang Tengah',
      tingkatRisiko: 'Rendah',
      pendaftarEdukasi: 890,
      totalPopulasi: 62150, // Kawasan perkotaan, jaringan pipa PDAM lebih merata
      penggunaAirTanah: 21752, // 35% ketergantungan air tanah
    },
    {
      namaKecamatan: 'Banyumanik',
      tingkatRisiko: 'Rendah',
      pendaftarEdukasi: 1640,
      totalPopulasi: 143200, // Wilayah Semarang atas (zona resapan)
      penggunaAirTanah: 45824, // 32% ketergantungan air tanah
    },
    {
      namaKecamatan: 'Gajahmungkur',
      tingkatRisiko: 'Rendah',
      pendaftarEdukasi: 620,
      totalPopulasi: 58700,
      penggunaAirTanah: 17610, // 30% ketergantungan air tanah
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
