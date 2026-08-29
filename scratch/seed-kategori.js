const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.hbiqiibhjsfmsennlzev:Zalkyaa12!%40@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const reports = await prisma.laporanWarga.findMany({
    where: { isVerified: true }
  });

  const categories = ['Tinggi', 'Sedang', 'Rendah'];
  
  for (let i = 0; i < reports.length; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    await prisma.laporanWarga.update({
      where: { id: reports[i].id },
      data: { kategori: randomCategory }
    });
  }
  
  // Tambah beberapa laporan baru agar lebih banyak data
  await prisma.laporanWarga.createMany({
    data: [
      { kecamatan: "Gayamsari", gejala: "Air mulai masuk rumah", isVerified: true, kategori: "Tinggi" },
      { kecamatan: "Genuk", gejala: "Jalan utama tergenang", isVerified: true, kategori: "Sedang" },
      { kecamatan: "Semarang Tengah", gejala: "Selokan mampet, air meluap", isVerified: true, kategori: "Rendah" },
      { kecamatan: "Pedurungan", gejala: "Banjir setinggi betis", isVerified: true, kategori: "Tinggi" },
      { kecamatan: "Tugu", gejala: "Banjir rob merendam tambak", isVerified: true, kategori: "Tinggi" },
    ]
  });

  console.log("Seeding categories done!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
