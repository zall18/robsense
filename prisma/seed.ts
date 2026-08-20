import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DIRECT_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')

  // Buat Admin User
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@robsense.go.id' },
    update: {},
    create: {
      email: 'admin@robsense.go.id',
      password: 'hashed-password-dummy', // In real app, hash the password
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // Buat Dummy Data Genangan
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
      statusRisiko: 'Sedang',
      ketinggianAir: 45.8,
      trendStatus: 'Stabil',
      suhu: 29.0,
      kelembapan: 80,
      kondisi: 'Hujan Ringan',
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
      kecamatan: 'Gayamsari',
      statusRisiko: 'Sedang',
      ketinggianAir: 55.2,
      trendStatus: 'Meningkat',
      suhu: 29.5,
      kelembapan: 82,
      kondisi: 'Hujan Ringan',
    }
  ];

  for (const data of cuacaData) {
    await prisma.dataCuacaGenangan.create({ data })
  }

  // Buat Data Profil Kecamatan
  const profilData = [
    {
      namaKecamatan: 'Genuk',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 400,
      totalPopulasi: 32000,
      penggunaAirTanah: 27200, // 85%
    },
    {
      namaKecamatan: 'Semarang Utara',
      tingkatRisiko: 'Tinggi',
      pendaftarEdukasi: 120,
      totalPopulasi: 45000,
      penggunaAirTanah: 32400, // 72%
    },
    {
      namaKecamatan: 'Pedurungan',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 200,
      totalPopulasi: 40000,
      penggunaAirTanah: 23200, // 58%
    },
    {
      namaKecamatan: 'Banyumanik',
      tingkatRisiko: 'Rendah',
      pendaftarEdukasi: 3200,
      totalPopulasi: 50000,
      penggunaAirTanah: 17500, // 35%
    },
    {
      namaKecamatan: 'Gayamsari',
      tingkatRisiko: 'Sedang',
      pendaftarEdukasi: 1500,
      totalPopulasi: 28000,
      penggunaAirTanah: 12600, // 45%
    },
    {
      namaKecamatan: 'Semarang Tengah',
      tingkatRisiko: 'Rendah',
      pendaftarEdukasi: 5000,
      totalPopulasi: 55000,
      penggunaAirTanah: 16500, // 30%
    }
  ];

  for (const data of profilData) {
    await prisma.profilKecamatan.upsert({
      where: { namaKecamatan: data.namaKecamatan },
      update: data,
      create: data,
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
