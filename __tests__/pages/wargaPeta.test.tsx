import React from 'react';
import { render, screen } from '@testing-library/react';
import WargaPetaPage from '../../app/warga/peta/page';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mPrisma = {
    dataCuacaGenangan: {
      findMany: jest.fn().mockResolvedValue([
        { id: '1', kecamatan: 'Genuk', statusRisiko: 'Tinggi', timestamp: new Date() },
        { id: '2', kecamatan: 'Semarang Utara', statusRisiko: 'Sedang', timestamp: new Date() }
      ])
    }
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

// Mock ClientMap
jest.mock('../../app/warga/peta/ClientMap', () => {
  return function DummyMap() {
    return <div data-testid="map-wrapper">Mock Map</div>;
  };
});

describe('WargaPetaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches recent updates', async () => {
    // Render the async component
    const Page = await WargaPetaPage();
    render(Page);
    
    expect(screen.getByText('Peta Status Risiko')).toBeInTheDocument();
    expect(screen.getByTestId('map-wrapper')).toBeInTheDocument();
    
    // Check if updates are rendered
    expect(screen.getByText('Kecamatan Genuk')).toBeInTheDocument();
    expect(screen.getByText('Kecamatan Semarang Utara')).toBeInTheDocument();
  });
});
