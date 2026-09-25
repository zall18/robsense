import React from 'react';
import { render, screen } from '@testing-library/react';
import HistoryPage from '@/app/admin/(dashboard)/history/page';

// Mock Prisma
jest.mock('../../lib/prisma', () => {
  const mockPrisma = {
    dataCuacaGenangan: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          kecamatan: 'Semarang Utara',
          statusRisiko: 'Tinggi',
          ketinggianAir: 125.4,
          trendStatus: 'Meningkat',
          timestamp: new Date('2023-10-10T14:32:00Z')
        }
      ]),
      count: jest.fn().mockResolvedValue(1)
    },
    profilKecamatan: {
      findMany: jest.fn().mockResolvedValue([
        {
          namaKecamatan: 'Genuk'
        }
      ])
    }
  };

  return {
    __esModule: true,
    default: mockPrisma,
    prisma: mockPrisma,
  };
});




describe('Halaman Riwayat Genangan', () => {
  it('berhasil melakukan render judul dan tombol aksi', async () => {
    // Render Server Component secara asinkron (React 18 / Next 13+ RSC test workaround)
    const PageComponent = await HistoryPage({ searchParams: Promise.resolve({}) });
    render(PageComponent);
    
    // Periksa judul
    expect(screen.getByText('Riwayat Genangan')).toBeInTheDocument();
    expect(screen.getByText('Ekspor')).toBeInTheDocument();
    expect(screen.getByText('Semua Kecamatan')).toBeInTheDocument();
  });

  it('memuat data tabel', async () => {
    const PageComponent = await HistoryPage({ searchParams: Promise.resolve({}) });
    render(PageComponent);

    // Periksa data tabel dirender
    expect(screen.getByText('Semarang Utara')).toBeInTheDocument();
    expect(screen.getByText('125.4')).toBeInTheDocument();
    
    // Badge BAHAYA dan indikator Meningkat
    expect(screen.getByText('BAHAYA')).toBeInTheDocument();
    expect(screen.getByText('Meningkat')).toBeInTheDocument();
  });
});
