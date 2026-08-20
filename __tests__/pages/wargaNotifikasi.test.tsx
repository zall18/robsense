import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WargaNotifikasiPage from '../../app/warga/notifikasi/page';

describe('WargaNotifikasiPage', () => {
  it('renders Demo Controls and Urgent Warning by default', () => {
    render(<WargaNotifikasiPage />);
    
    // Default is Tinggi
    expect(screen.getByText('Siaga Rob Tinggi')).toBeInTheDocument();
    
    // Switch to Sedang
    fireEvent.click(screen.getByText('Demo: Oranye'));
    expect(screen.getByText('Waspada Genangan')).toBeInTheDocument();
    
    // Switch to Rendah
    fireEvent.click(screen.getByText('Demo: Hijau'));
    expect(screen.getByText('Kondisi Aman')).toBeInTheDocument();
  });

  it('renders history statically', () => {
    render(<WargaNotifikasiPage />);
    expect(screen.getByText('Pembersihan Saluran Air')).toBeInTheDocument();
    expect(screen.getByText('Perbaikan Pompa Air')).toBeInTheDocument();
    expect(screen.getByText('Status Siaga Rob Dicabut')).toBeInTheDocument();
  });
});
