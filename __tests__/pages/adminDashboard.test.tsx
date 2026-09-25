import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/admin/(dashboard)/page';

// Mock MapWrapper
jest.mock('../../app/components/MapWrapper', () => {
  return function MockMapWrapper() {
    return <div data-testid="map-wrapper">Mock Map</div>;
  };
});


// Mock Prisma
jest.mock('../../lib/prisma', () => {
  const mockPrisma = {
    profilKecamatan: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          namaKecamatan: 'Genuk',
          tingkatRisiko: 'Tinggi',
          pendaftarEdukasi: 400,
          totalPopulasi: 32000,
          penggunaAirTanah: 27200,
        },
        {
          id: '2',
          namaKecamatan: 'Semarang Utara',
          tingkatRisiko: 'Sedang',
          pendaftarEdukasi: 120,
          totalPopulasi: 45000,
          penggunaAirTanah: 32400,
        }
      ])
    },
    dataCuacaGenangan: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '101',
          kecamatan: 'Genuk',
          statusRisiko: 'Tinggi',
          ketinggianAir: 45.2,
          timestamp: new Date('2023-10-10T14:32:00Z')
        }
      ])
    },
    laporanWarga: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(100),
    }
  };

  return {
    __esModule: true,
    default: mockPrisma,
    prisma: mockPrisma,
  };
});




describe('Halaman Dashboard Utama', () => {
  it('berhasil merender semua komponen utama', async () => {
    const PageComponent = await DashboardPage({ searchParams: Promise.resolve({}) });
    render(PageComponent);
    
    // Periksa judul
    expect(screen.getByText('Dashboard Pemantauan')).toBeInTheDocument();
    
    // Periksa komponen Peta
    expect(screen.getByText('Peta Status Risiko')).toBeInTheDocument();
    expect(screen.getByTestId('map-wrapper')).toBeInTheDocument();
    expect(screen.getByText('Wilayah Siaga')).toBeInTheDocument();
    expect(screen.getByText('100 Total Laporan Warga')).toBeInTheDocument();
    
    // Periksa Distribusi Sumber Air
    expect(screen.getByText('Distribusi Sumber Air')).toBeInTheDocument();
    
    // Periksa Prioritas Edukasi
    expect(screen.getByText((content) => content.includes('Prioritas Edukasi'))).toBeInTheDocument();
    expect(screen.getByText('1. Kecamatan Genuk')).toBeInTheDocument();
    expect(screen.getByText('2. Kecamatan Semarang Utara')).toBeInTheDocument();
    
    // Periksa Riwayat Genangan
    expect(screen.getByText('Riwayat Genangan & Peringatan Dini (Log Terbaru)')).toBeInTheDocument();
    expect(screen.getByText('Genuk')).toBeInTheDocument(); // In the table
    expect(screen.getByText('45.2')).toBeInTheDocument();
  });
});
