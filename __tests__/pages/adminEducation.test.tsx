import React from 'react';
import { render, screen } from '@testing-library/react';
import EducationPriorityPage from '@/app/admin/(dashboard)/education/page';

jest.mock('lucide-react', () => ({
  Building2: () => <div data-testid="icon-building" />,
  Droplets: () => <div data-testid="icon-droplets" />,
  AlertTriangle: () => <div data-testid="icon-alert-triangle" />,
  Filter: () => <div data-testid="icon-filter" />,
  Check: () => <div data-testid="icon-check" />,
  MessageCircle: () => <div data-testid="icon-message-circle" />,
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
              namaKecamatan: 'Semarang Utara',
              tingkatRisiko: 'Tinggi',
              pendaftarEdukasi: 120,
              totalPopulasi: 45000, // 0.2% coverage -> Kritis
            },
            {
              id: '2',
              namaKecamatan: 'Gayamsari',
              tingkatRisiko: 'Sedang',
              pendaftarEdukasi: 1500,
              totalPopulasi: 28000, // 5.3% coverage -> Tinggi
            }
          ])
        }
      };
    })
  };
});
// Mock pg to prevent tests crashing from real db connection attempts
jest.mock('pg', () => {
  return { Pool: jest.fn() };
});
jest.mock('@prisma/adapter-pg', () => {
  return { PrismaPg: jest.fn() };
});

describe('Halaman Prioritas Edukasi', () => {
  it('berhasil merender judul, summary cards, dan tabel', async () => {
    const PageComponent = await EducationPriorityPage({ searchParams: Promise.resolve({}) });
    render(PageComponent);
    
    // Periksa judul
    expect(screen.getByText('Daftar Prioritas Edukasi')).toBeInTheDocument();
    
    // Periksa Summary Cards
    expect(screen.getByText('Total Kecamatan Teridentifikasi')).toBeInTheDocument();
    expect(screen.getAllByText('2')[0]).toBeInTheDocument(); // length of profiles
    expect(screen.getByText('Kecamatan Prioritas Utama')).toBeInTheDocument();
    
    // Periksa isi tabel (Mock data)
    expect(screen.getAllByText('Semarang Utara')[0]).toBeInTheDocument();
    expect(screen.getByText('Gayamsari')).toBeInTheDocument();
    
    // Periksa Status Prioritas ('Kritis' and 'Tinggi')
    expect(screen.getByText('Kritis')).toBeInTheDocument();
    expect(screen.getAllByText('Tinggi').length).toBeGreaterThan(0);
    
    // Peringkat 1 is rendered
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
