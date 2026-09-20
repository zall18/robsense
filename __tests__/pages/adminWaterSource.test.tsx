import React from 'react';
import { render, screen } from '@testing-library/react';
import WaterSourcePage from '@/app/admin/(dashboard)/water-source/page';

jest.mock('lucide-react', () => ({
  Droplet: () => <div data-testid="icon-droplet" />,
  ArrowUpRight: () => <div data-testid="icon-arrow-up" />,
  ArrowRight: () => <div data-testid="icon-arrow-right" />,
  Filter: () => <div data-testid="icon-filter" />,
  Download: () => <div data-testid="icon-download" />,
}));

// Mock Prisma
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        profilKecamatan: {
          findMany: jest.fn().mockResolvedValue([
            {
              id: '1',
              namaKecamatan: 'Genuk',
              tingkatRisiko: 'Tinggi',
              totalPopulasi: 32000,
              penggunaAirTanah: 27200, // 85%
              pendaftarEdukasi: 420,
            },
            {
              id: '2',
              namaKecamatan: 'Semarang Utara',
              tingkatRisiko: 'Tinggi',
              totalPopulasi: 45000,
              penggunaAirTanah: 32400, // 72%
              pendaftarEdukasi: 180,
            }
          ])
        }
      };
    })
  };
});
// Mock pg
jest.mock('pg', () => {
  return { Pool: jest.fn() };
});
jest.mock('@prisma/adapter-pg', () => {
  return { PrismaPg: jest.fn() };
});

describe('Halaman Cakupan Sumber Air', () => {
  it('berhasil merender judul, summary cards, dan tabel', async () => {
    const PageComponent = await WaterSourcePage({ searchParams: Promise.resolve({}) });
    render(PageComponent);
    
    // Periksa judul
    expect(screen.getByText('Indikator Cakupan Sumber Air')).toBeInTheDocument();
    
    // Periksa Summary Cards
    expect(screen.getByText('Sumber Air Tanah')).toBeInTheDocument();
    expect(screen.getByText('Layanan PDAM')).toBeInTheDocument();
    expect(screen.getByText('Indeks Kerentanan Global')).toBeInTheDocument();
    
    // Rata-rata dari mock:
    // Total Tanah: 27200 + 32400 = 59600
    // Total Pop: 32000 + 45000 = 77000
    // Rata Tanah = 59600 / 77000 = 77.4%
    expect(screen.getByText('77.4%')).toBeInTheDocument(); // Mock data calculation
    
    // Periksa isi tabel (Mock data)
    expect(screen.getAllByText('Genuk')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Semarang Utara')[0]).toBeInTheDocument();
    
    // Periksa persentase di tabel
    expect(screen.getByText('85.0%')).toBeInTheDocument();
    expect(screen.getByText('72.0%')).toBeInTheDocument();
  });
});
