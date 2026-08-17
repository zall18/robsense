import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  const data1 = await prisma.dataCuacaGenangan.create({
    data: {
      kecamatan: 'Semarang Utara',
      statusRisiko: 'Tinggi',
      suhu: 31.5,
      kelembapan: 85,
      kondisi: 'Berawan'
    }
  })

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
